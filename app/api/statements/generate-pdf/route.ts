import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { formatEthiopianBirr } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { userId, accountId, startDate, endDate } = await request.json();

    if (!userId || !accountId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get user information
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('first_name, last_name, email, phone')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get account information
    const { data: account, error: accountError } = await supabase
      .from('bank_accounts')
      .select('account_name, bank_name, account_number, balance')
      .eq('id', accountId)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Get transactions for the period
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('account_id', accountId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (transactionsError) {
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      );
    }

    // Calculate summary statistics
    const totalInflow = transactions
      .filter(t => t.transaction_type === 'credit')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalOutflow = transactions
      .filter(t => t.transaction_type === 'debit')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const netAmount = totalInflow - totalOutflow;

    // Generate HTML for PDF
    const htmlContent = generateStatementHTML({
      user,
      account,
      transactions,
      startDate,
      endDate,
      totalInflow,
      totalOutflow,
      netAmount,
      transactionCount: transactions.length
    });

    return NextResponse.json({
      success: true,
      htmlContent,
      summary: {
        totalInflow,
        totalOutflow,
        netAmount,
        transactionCount: transactions.length
      }
    });

  } catch (error) {
    console.error('Error generating statement:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateStatementHTML(data: any) {
  const { user, account, transactions, startDate, endDate, totalInflow, totalOutflow, netAmount, transactionCount } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nile Pay Statement</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #059669; margin-bottom: 10px; }
        .subtitle { color: #666; font-size: 16px; }
        .account-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-item { margin-bottom: 10px; }
        .label { font-weight: bold; color: #059669; }
        .value { margin-left: 10px; }
        .summary { background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center; }
        .summary-item { padding: 15px; background: white; border-radius: 6px; }
        .summary-value { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        .summary-label { font-size: 12px; color: #666; }
        .transactions { margin-top: 30px; }
        .transaction-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .transaction-table th, .transaction-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .transaction-table th { background: #059669; color: white; font-weight: bold; }
        .credit { color: #059669; font-weight: bold; }
        .debit { color: #dc2626; font-weight: bold; }
        .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
        .ethiopian-flag { font-size: 24px; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🇪🇹 Nile Pay</div>
        <div class="subtitle">Ethiopian Digital Banking Statement</div>
        <div style="margin-top: 15px; font-size: 14px; color: #666;">
          Statement Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}
        </div>
      </div>

      <div class="account-info">
        <h3 style="color: #059669; margin-top: 0;">Account Information</h3>
        <div class="info-grid">
          <div>
            <div class="info-item">
              <span class="label">Account Holder:</span>
              <span class="value">${user.first_name} ${user.last_name}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">${user.email}</span>
            </div>
            <div class="info-item">
              <span class="label">Phone:</span>
              <span class="value">${user.phone || 'N/A'}</span>
            </div>
          </div>
          <div>
            <div class="info-item">
              <span class="label">Account Name:</span>
              <span class="value">${account.account_name}</span>
            </div>
            <div class="info-item">
              <span class="label">Bank:</span>
              <span class="value">${account.bank_name}</span>
            </div>
            <div class="info-item">
              <span class="label">Account Number:</span>
              <span class="value">${account.account_number}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="summary">
        <h3 style="color: #059669; margin-top: 0; text-align: center;">Statement Summary</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-value" style="color: #059669;">+${formatEthiopianBirr(totalInflow)}</div>
            <div class="summary-label">Total Inflow</div>
          </div>
          <div class="summary-item">
            <div class="summary-value" style="color: #dc2626;">-${formatEthiopianBirr(totalOutflow)}</div>
            <div class="summary-label">Total Outflow</div>
          </div>
          <div class="summary-item">
            <div class="summary-value" style="color: ${netAmount >= 0 ? '#059669' : '#dc2626'};">${formatEthiopianBirr(netAmount)}</div>
            <div class="summary-label">Net Amount</div>
          </div>
          <div class="summary-item">
            <div class="summary-value" style="color: #6366f1;">${transactionCount}</div>
            <div class="summary-label">Total Transactions</div>
          </div>
        </div>
      </div>

      <div class="transactions">
        <h3 style="color: #059669;">Transaction Details</h3>
        <table class="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount (ETB)</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.map((transaction: any) => `
              <tr>
                <td>${new Date(transaction.created_at).toLocaleDateString()}</td>
                <td>${transaction.description}</td>
                <td>${transaction.transaction_type === 'credit' ? 'Credit' : 'Debit'}</td>
                <td>${transaction.category}</td>
                <td class="${transaction.transaction_type}">
                  ${transaction.transaction_type === 'credit' ? '+' : '-'}${formatEthiopianBirr(transaction.amount)}
                </td>
                <td>${transaction.reference_number}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <div class="ethiopian-flag">🇪🇹</div>
        <p><strong>Nile Pay</strong> - Ethiopian Digital Banking</p>
        <p>This statement is generated electronically and is valid without signature.</p>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>For support, contact: support@nilepay.et | +251-11-XXX-XXXX</p>
      </div>
    </body>
    </html>
  `;
}
