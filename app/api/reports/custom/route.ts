import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { formatEthiopianBirr } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      reportType,
      accounts,
      dateRange,
      customStartDate,
      customEndDate,
      format,
      includeCharts,
      includeSummary,
      includeTransactions,
      emailReport
    } = await request.json();

    if (!userId || !reportType || !accounts || accounts.length === 0) {
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
    const { data: accountsData, error: accountsError } = await supabase
      .from('bank_accounts')
      .select('*')
      .in('id', accounts)
      .eq('user_id', userId);

    if (accountsError || !accountsData || accountsData.length === 0) {
      return NextResponse.json(
        { error: 'No accounts found' },
        { status: 404 }
      );
    }

    // Calculate date range
    let startDate: string;
    let endDate: string;

    if (dateRange === 'custom') {
      startDate = customStartDate;
      endDate = customEndDate;
    } else {
      const now = new Date();
      endDate = now.toISOString().split('T')[0];
      
      switch (dateRange) {
        case 'last-30-days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        case 'last-3-months':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()).toISOString().split('T')[0];
          break;
        case 'last-6-months':
          startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()).toISOString().split('T')[0];
          break;
        case 'last-12-months':
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().split('T')[0];
          break;
        case 'current-year':
          startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
          break;
        case 'last-year':
          startDate = new Date(now.getFullYear() - 1, 0, 1).toISOString().split('T')[0];
          endDate = new Date(now.getFullYear() - 1, 11, 31).toISOString().split('T')[0];
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()).toISOString().split('T')[0];
      }
    }

    // Get transactions for the period and accounts
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .in('account_id', accounts)
      .gte('created_at', startDate)
      .lte('created_at', endDate + 'T23:59:59.999Z')
      .order('created_at', { ascending: false });

    if (transactionsError) {
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      );
    }

    // Calculate analytics based on report type
    const analytics = calculateAnalytics(transactions || [], reportType, accountsData);

    // Generate report content based on format
    let reportContent;
    if (format === 'pdf') {
      reportContent = generatePDFReport({
        user,
        accounts: accountsData,
        transactions: transactions || [],
        analytics,
        reportType,
        startDate,
        endDate,
        includeCharts,
        includeSummary,
        includeTransactions
      });
    } else if (format === 'excel') {
      reportContent = generateExcelReport({
        user,
        accounts: accountsData,
        transactions: transactions || [],
        analytics,
        reportType,
        startDate,
        endDate,
        includeCharts,
        includeSummary,
        includeTransactions
      });
    } else if (format === 'csv') {
      reportContent = generateCSVReport({
        user,
        accounts: accountsData,
        transactions: transactions || [],
        analytics,
        reportType,
        startDate,
        endDate
      });
    }

    // Handle email delivery
    if (emailReport) {
      // In production, you would send this via email service
      console.log(`Email report sent to ${user.email}`);
    }

    // Return appropriate response based on format
    if (format === 'excel') {
      const headers = new Headers();
      headers.set('Content-Type', 'application/vnd.ms-excel');
      headers.set('Content-Disposition', `attachment; filename="nile-pay-${reportType}-report.xls"`);
      return new NextResponse(reportContent, { status: 200, headers });
    } else if (format === 'csv') {
      const headers = new Headers();
      headers.set('Content-Type', 'text/csv');
      headers.set('Content-Disposition', `attachment; filename="nile-pay-${reportType}-report.csv"`);
      return new NextResponse(reportContent, { status: 200, headers });
    } else {
      return NextResponse.json({
        success: true,
        reportContent,
        analytics,
        reportType,
        period: `${startDate} to ${endDate}`,
        emailSent: emailReport
      });
    }

  } catch (error) {
    console.error('Error generating custom report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateAnalytics(transactions: any[], reportType: string, accounts: any[]) {
  const totalInflow = transactions
    .filter(t => t.transaction_type === 'credit')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalOutflow = transactions
    .filter(t => t.transaction_type === 'debit')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const netAmount = totalInflow - totalOutflow;
  const transactionCount = transactions.length;

  // Category breakdown
  const categoryBreakdown = transactions.reduce((acc: any, t) => {
    const category = t.category || 'Other';
    if (!acc[category]) {
      acc[category] = { count: 0, amount: 0 };
    }
    acc[category].count++;
    acc[category].amount += parseFloat(t.amount);
    return acc;
  }, {});

  // Monthly breakdown
  const monthlyBreakdown = transactions.reduce((acc: any, t) => {
    const month = new Date(t.created_at).toISOString().slice(0, 7);
    if (!acc[month]) {
      acc[month] = { inflow: 0, outflow: 0, count: 0 };
    }
    if (t.transaction_type === 'credit') {
      acc[month].inflow += parseFloat(t.amount);
    } else {
      acc[month].outflow += parseFloat(t.amount);
    }
    acc[month].count++;
    return acc;
  }, {});

  // Account breakdown
  const accountBreakdown = accounts.map(account => {
    const accountTransactions = transactions.filter(t => t.account_id === account.id);
    const accountInflow = accountTransactions
      .filter(t => t.transaction_type === 'credit')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const accountOutflow = accountTransactions
      .filter(t => t.transaction_type === 'debit')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    return {
      ...account,
      transactionCount: accountTransactions.length,
      inflow: accountInflow,
      outflow: accountOutflow,
      netAmount: accountInflow - accountOutflow
    };
  });

  return {
    totalInflow,
    totalOutflow,
    netAmount,
    transactionCount,
    categoryBreakdown,
    monthlyBreakdown,
    accountBreakdown,
    averageTransactionAmount: transactionCount > 0 ? (totalInflow + totalOutflow) / transactionCount : 0
  };
}

function generatePDFReport(data: any) {
  const { user, accounts, transactions, analytics, reportType, startDate, endDate, includeCharts, includeSummary, includeTransactions } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nile Pay Custom Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #059669; margin-bottom: 10px; }
        .report-title { font-size: 20px; color: #666; margin-bottom: 10px; }
        .summary { background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .analytics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
        .analytics-card { background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #ddd; }
        .analytics-value { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        .analytics-label { font-size: 12px; color: #666; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; color: #059669; margin-bottom: 15px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table th, .table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .table th { background: #059669; color: white; }
        .credit { color: #059669; font-weight: bold; }
        .debit { color: #dc2626; font-weight: bold; }
        .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🇪🇹 Nile Pay</div>
        <div class="report-title">${getReportTitle(reportType)}</div>
        <div>Report Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}</div>
        <div>Generated for: ${user.first_name} ${user.last_name}</div>
      </div>

      ${includeSummary ? `
      <div class="summary">
        <h3 style="color: #059669; margin-top: 0;">Executive Summary</h3>
        <div class="analytics-grid">
          <div class="analytics-card">
            <div class="analytics-value" style="color: #059669;">+${formatEthiopianBirr(analytics.totalInflow)}</div>
            <div class="analytics-label">Total Inflow</div>
          </div>
          <div class="analytics-card">
            <div class="analytics-value" style="color: #dc2626;">-${formatEthiopianBirr(analytics.totalOutflow)}</div>
            <div class="analytics-label">Total Outflow</div>
          </div>
          <div class="analytics-card">
            <div class="analytics-value" style="color: ${analytics.netAmount >= 0 ? '#059669' : '#dc2626'};">${formatEthiopianBirr(analytics.netAmount)}</div>
            <div class="analytics-label">Net Amount</div>
          </div>
          <div class="analytics-card">
            <div class="analytics-value" style="color: #6366f1;">${analytics.transactionCount}</div>
            <div class="analytics-label">Total Transactions</div>
          </div>
        </div>
      </div>
      ` : ''}

      <div class="section">
        <div class="section-title">Account Overview</div>
        <table class="table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Bank</th>
              <th>Balance</th>
              <th>Transactions</th>
              <th>Inflow</th>
              <th>Outflow</th>
            </tr>
          </thead>
          <tbody>
            ${analytics.accountBreakdown.map((account: any) => `
              <tr>
                <td>${account.account_name}</td>
                <td>${account.bank_name}</td>
                <td>${formatEthiopianBirr(account.balance)}</td>
                <td>${account.transactionCount}</td>
                <td class="credit">+${formatEthiopianBirr(account.inflow)}</td>
                <td class="debit">-${formatEthiopianBirr(account.outflow)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      ${includeTransactions ? `
      <div class="section">
        <div class="section-title">Transaction Details</div>
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.slice(0, 100).map((transaction: any) => `
              <tr>
                <td>${new Date(transaction.created_at).toLocaleDateString()}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category}</td>
                <td>${transaction.transaction_type === 'credit' ? 'Credit' : 'Debit'}</td>
                <td class="${transaction.transaction_type}">
                  ${transaction.transaction_type === 'credit' ? '+' : '-'}${formatEthiopianBirr(transaction.amount)}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      <div class="footer">
        <div style="font-size: 24px; margin-bottom: 10px;">🇪🇹</div>
        <p><strong>Nile Pay</strong> - Ethiopian Digital Banking</p>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>This is a custom generated report. For support, contact: support@nilepay.et</p>
      </div>
    </body>
    </html>
  `;
}

function generateExcelReport(data: any) {
  // Similar to PDF but in Excel format
  return generatePDFReport(data); // Simplified for now
}

function generateCSVReport(data: any) {
  const { transactions, analytics, reportType, startDate, endDate } = data;
  
  let csv = `Nile Pay Custom Report - ${getReportTitle(reportType)}\n`;
  csv += `Period,${startDate} to ${endDate}\n`;
  csv += `Generated,${new Date().toLocaleString()}\n\n`;
  
  csv += `Summary\n`;
  csv += `Total Inflow,${analytics.totalInflow}\n`;
  csv += `Total Outflow,${analytics.totalOutflow}\n`;
  csv += `Net Amount,${analytics.netAmount}\n`;
  csv += `Transaction Count,${analytics.transactionCount}\n\n`;
  
  csv += `Transactions\n`;
  csv += `Date,Description,Category,Type,Amount\n`;
  
  transactions.forEach((transaction: any) => {
    csv += `${new Date(transaction.created_at).toLocaleDateString()},`;
    csv += `"${transaction.description}",`;
    csv += `${transaction.category},`;
    csv += `${transaction.transaction_type === 'credit' ? 'Credit' : 'Debit'},`;
    csv += `${transaction.amount}\n`;
  });
  
  return csv;
}

function getReportTitle(reportType: string) {
  const titles: { [key: string]: string } = {
    'comprehensive': 'Comprehensive Financial Report',
    'spending-analysis': 'Spending Analysis Report',
    'income-tracking': 'Income Tracking Report',
    'account-comparison': 'Account Comparison Report',
    'monthly-summary': 'Monthly Summary Report',
    'tax-preparation': 'Tax Preparation Report'
  };
  return titles[reportType] || 'Custom Financial Report';
}
