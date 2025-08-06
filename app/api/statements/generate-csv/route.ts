import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

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

    // Generate CSV content
    const csvContent = generateCSV({
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

    // Return as CSV file
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv');
    headers.set('Content-Disposition', 'attachment; filename="nile-pay-statement.csv"');

    return new NextResponse(csvContent, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error generating CSV:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateCSV(data: any) {
  const { user, account, transactions, startDate, endDate, totalInflow, totalOutflow, netAmount, transactionCount } = data;
  
  // Helper function to escape CSV values
  const escapeCSV = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  let csv = '';
  
  // Header information
  csv += 'Nile Pay - Ethiopian Digital Banking Statement\n';
  csv += `Statement Period,${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}\n`;
  csv += '\n';
  
  // Account information
  csv += 'Account Information\n';
  csv += `Account Holder,${escapeCSV(user.first_name + ' ' + user.last_name)}\n`;
  csv += `Email,${escapeCSV(user.email)}\n`;
  csv += `Phone,${escapeCSV(user.phone || 'N/A')}\n`;
  csv += `Account Name,${escapeCSV(account.account_name)}\n`;
  csv += `Bank,${escapeCSV(account.bank_name)}\n`;
  csv += `Account Number,${escapeCSV(account.account_number)}\n`;
  csv += '\n';
  
  // Summary information
  csv += 'Statement Summary\n';
  csv += `Total Inflow,${totalInflow.toFixed(2)} ETB\n`;
  csv += `Total Outflow,${totalOutflow.toFixed(2)} ETB\n`;
  csv += `Net Amount,${netAmount.toFixed(2)} ETB\n`;
  csv += `Total Transactions,${transactionCount}\n`;
  csv += `Generated On,${new Date().toLocaleString()}\n`;
  csv += '\n';
  
  // Transaction details header
  csv += 'Transaction Details\n';
  csv += 'Date,Description,Type,Category,Amount (ETB),Reference Number\n';
  
  // Transaction data
  transactions.forEach((transaction: any) => {
    const date = new Date(transaction.created_at).toLocaleDateString();
    const description = escapeCSV(transaction.description || '');
    const type = transaction.transaction_type === 'credit' ? 'Credit' : 'Debit';
    const category = escapeCSV(transaction.category || '');
    const amount = `${transaction.transaction_type === 'credit' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}`;
    const reference = escapeCSV(transaction.reference_number || '');
    
    csv += `${date},${description},${type},${category},${amount},${reference}\n`;
  });
  
  // Footer
  csv += '\n';
  csv += 'Footer\n';
  csv += 'Nile Pay - Ethiopian Digital Banking\n';
  csv += 'This statement is generated electronically and is valid without signature.\n';
  csv += 'For support contact: support@nilepay.et | +251-11-XXX-XXXX\n';
  
  return csv;
}
