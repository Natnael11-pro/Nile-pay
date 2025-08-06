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

    // Generate Excel-compatible HTML
    const excelContent = generateExcelHTML({
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

    // Return as Excel file
    const headers = new Headers();
    headers.set('Content-Type', 'application/vnd.ms-excel');
    headers.set('Content-Disposition', 'attachment; filename="nile-pay-statement.xls"');

    return new NextResponse(excelContent, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error generating Excel:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateExcelHTML(data: any) {
  const { user, account, transactions, startDate, endDate, totalInflow, totalOutflow, netAmount, transactionCount } = data;
  
  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <meta name="ProgId" content="Excel.Sheet">
      <meta name="Generator" content="Microsoft Excel 15">
      <style>
        .header { font-weight: bold; background-color: #059669; color: white; }
        .summary { background-color: #e8f5e8; font-weight: bold; }
        .credit { color: #059669; font-weight: bold; }
        .debit { color: #dc2626; font-weight: bold; }
        .center { text-align: center; }
      </style>
    </head>
    <body>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr class="header">
          <td colspan="6" class="center">🇪🇹 Nile Pay - Ethiopian Digital Banking Statement</td>
        </tr>
        <tr>
          <td colspan="6" class="center">Statement Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}</td>
        </tr>
        <tr><td colspan="6"></td></tr>
        
        <tr class="header">
          <td colspan="6">Account Information</td>
        </tr>
        <tr>
          <td><strong>Account Holder:</strong></td>
          <td>${user.first_name} ${user.last_name}</td>
          <td><strong>Email:</strong></td>
          <td>${user.email}</td>
          <td><strong>Phone:</strong></td>
          <td>${user.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td><strong>Account Name:</strong></td>
          <td>${account.account_name}</td>
          <td><strong>Bank:</strong></td>
          <td>${account.bank_name}</td>
          <td><strong>Account Number:</strong></td>
          <td>${account.account_number}</td>
        </tr>
        <tr><td colspan="6"></td></tr>
        
        <tr class="summary">
          <td>Total Inflow</td>
          <td>Total Outflow</td>
          <td>Net Amount</td>
          <td>Total Transactions</td>
          <td colspan="2">Generated On</td>
        </tr>
        <tr class="summary">
          <td class="credit">+${formatEthiopianBirr(totalInflow)}</td>
          <td class="debit">-${formatEthiopianBirr(totalOutflow)}</td>
          <td style="color: ${netAmount >= 0 ? '#059669' : '#dc2626'};">${formatEthiopianBirr(netAmount)}</td>
          <td>${transactionCount}</td>
          <td colspan="2">${new Date().toLocaleString()}</td>
        </tr>
        <tr><td colspan="6"></td></tr>
        
        <tr class="header">
          <td>Date</td>
          <td>Description</td>
          <td>Type</td>
          <td>Category</td>
          <td>Amount (ETB)</td>
          <td>Reference</td>
        </tr>
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
        
        <tr><td colspan="6"></td></tr>
        <tr>
          <td colspan="6" class="center">
            <strong>Nile Pay</strong> - Ethiopian Digital Banking<br>
            This statement is generated electronically and is valid without signature.<br>
            For support, contact: support@nilepay.et | +251-11-XXX-XXXX
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
