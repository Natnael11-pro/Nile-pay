import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { formatEthiopianBirr } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { userId, accountId, startDate, endDate, email, period } = await request.json();

    if (!userId || !accountId || !startDate || !endDate || !email) {
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

    // In a real application, you would send this via email service like SendGrid, Resend, etc.
    // For now, we'll simulate the email sending
    
    const emailContent = generateEmailContent({
      user,
      account,
      period,
      totalInflow,
      totalOutflow,
      netAmount,
      transactionCount: transactions.length,
      startDate,
      endDate
    });

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log the email (in production, this would be sent via email service)
    console.log(`Email sent to ${email}:`, emailContent);

    return NextResponse.json({
      success: true,
      message: `Statement for ${period} has been sent to ${email}`,
      emailSent: true
    });

  } catch (error) {
    console.error('Error emailing statement:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateEmailContent(data: any) {
  const { user, account, period, totalInflow, totalOutflow, netAmount, transactionCount, startDate, endDate } = data;
  
  return {
    to: user.email,
    subject: `Nile Pay Statement - ${period}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">🇪🇹 Nile Pay</h1>
          <p style="color: #666; margin: 10px 0;">Ethiopian Digital Banking Statement</p>
          <p style="color: #666; font-size: 14px;">Statement Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #059669; margin-top: 0;">Dear ${user.first_name} ${user.last_name},</h3>
          <p>Your account statement for <strong>${period}</strong> is ready. Here's a summary of your account activity:</p>
        </div>

        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #059669; text-align: center; margin-top: 0;">Statement Summary</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; text-align: center;">
            <div style="background: white; padding: 15px; border-radius: 6px;">
              <div style="font-size: 18px; font-weight: bold; color: #059669; margin-bottom: 5px;">+${formatEthiopianBirr(totalInflow)}</div>
              <div style="font-size: 12px; color: #666;">Total Inflow</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 6px;">
              <div style="font-size: 18px; font-weight: bold; color: #dc2626; margin-bottom: 5px;">-${formatEthiopianBirr(totalOutflow)}</div>
              <div style="font-size: 12px; color: #666;">Total Outflow</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 6px;">
              <div style="font-size: 18px; font-weight: bold; color: ${netAmount >= 0 ? '#059669' : '#dc2626'}; margin-bottom: 5px;">${formatEthiopianBirr(netAmount)}</div>
              <div style="font-size: 12px; color: #666;">Net Amount</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 6px;">
              <div style="font-size: 18px; font-weight: bold; color: #6366f1; margin-bottom: 5px;">${transactionCount}</div>
              <div style="font-size: 12px; color: #666;">Total Transactions</div>
            </div>
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h4 style="color: #059669; margin-top: 0;">Account Details</h4>
          <p><strong>Account:</strong> ${account.account_name}</p>
          <p><strong>Bank:</strong> ${account.bank_name}</p>
          <p><strong>Account Number:</strong> ${account.account_number}</p>
        </div>

        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
          <p style="margin: 0; color: #856404;"><strong>Note:</strong> For detailed transaction history, please log in to your Nile Pay account or download the full statement from the statements page.</p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <div style="font-size: 24px; margin-bottom: 10px;">🇪🇹</div>
          <p><strong>Nile Pay</strong> - Ethiopian Digital Banking</p>
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>For support, contact: support@nilepay.et | +251-11-XXX-XXXX</p>
        </div>
      </div>
    `,
    text: `
      Nile Pay Statement - ${period}
      
      Dear ${user.first_name} ${user.last_name},
      
      Your account statement for ${period} is ready.
      
      Summary:
      - Total Inflow: +${formatEthiopianBirr(totalInflow)}
      - Total Outflow: -${formatEthiopianBirr(totalOutflow)}
      - Net Amount: ${formatEthiopianBirr(netAmount)}
      - Total Transactions: ${transactionCount}
      
      Account: ${account.account_name}
      Bank: ${account.bank_name}
      Account Number: ${account.account_number}
      
      For detailed transaction history, please log in to your Nile Pay account.
      
      Nile Pay - Ethiopian Digital Banking
    `
  };
}
