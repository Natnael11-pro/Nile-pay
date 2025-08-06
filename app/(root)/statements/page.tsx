import React from 'react';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getTransactionsByUserId } from '@/lib/actions/transaction.actions';
import { redirect } from 'next/navigation';
import HeaderBox from '@/components/HeaderBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatementsClient from '@/components/StatementsClient';
import StatementsPageClient from '@/components/StatementsPageClient';

const Statements = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    redirect('/sign-in');
  }

  // Get user's accounts and transactions
  const accounts = await getAccounts(loggedIn.$id);
  const transactions = await getTransactionsByUserId({ userId: loggedIn.$id });

  // Generate statement periods (last 6 months) from real transaction data
  const statements = [];

  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // Filter transactions for this period
    const periodTransactions = transactions.filter((t: any) => {
      const transactionDate = new Date(t.created_at);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const totalInflow = periodTransactions
      .filter((t: any) => t.transaction_type === 'credit')
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

    const totalOutflow = periodTransactions
      .filter((t: any) => t.transaction_type === 'debit')
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

    statements.push({
      id: i + 1,
      period: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: i === 0 ? 'current' : 'available',
      transactions: periodTransactions.length,
      totalInflow,
      totalOutflow,
      balance: totalInflow - totalOutflow,
      downloadUrl: `/statements/${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}.pdf`
    });
  }

  return (
    <section className="flex w-full flex-col gap-8 p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <HeaderBox
          title="Account Statements"
          subtext="Download and view your Ethiopian banking statements"
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <span className="mr-2">📧</span>
            Email Settings
          </Button>
          <StatementsPageClient accounts={accounts || []} user={loggedIn} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">📈</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {statements.reduce((sum, s) => sum + s.totalInflow, 0).toLocaleString()} ETB
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Inflow (4 months)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">📉</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {statements.reduce((sum, s) => sum + s.totalOutflow, 0).toLocaleString()} ETB
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Outflow (4 months)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {statements[0].balance.toLocaleString()} ETB
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Balance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {statements.reduce((sum, s) => sum + s.transactions, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</div>
          </CardContent>
        </Card>
      </div>

      {/* Statement Filters - Now handled by StatementsClient */}

      {/* Statements List */}
      <StatementsClient
        statements={statements}
        accounts={accounts || []}
        user={loggedIn}
      />

      {/* Statement Delivery Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <span>⚙️</span>
            Statement Delivery Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Automatic Delivery</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Monthly statements</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Automatically generate and email monthly statements</div>
                  </div>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded" />
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Quarterly summaries</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Receive detailed quarterly financial summaries</div>
                  </div>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Year-end reports</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Annual financial summary for tax purposes</div>
                  </div>
                </label>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Delivery Preferences</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    defaultValue={loggedIn.email}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preferred Format
                  </label>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <option>PDF (Recommended)</option>
                    <option>Excel Spreadsheet</option>
                    <option>CSV Data</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Language
                  </label>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <option>English</option>
                    <option>Amharic (አማርኛ)</option>
                    <option>Oromiffa (Afaan Oromoo)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
              <span className="mr-2">💾</span>
              Save Delivery Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tax Information */}
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="text-lg text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
            <span>📋</span>
            Tax Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-700 dark:text-yellow-300 mb-4">
            Your account statements can be used for Ethiopian tax filing purposes. 
            All transactions are recorded in compliance with Ethiopian Revenue and Customs Authority requirements.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
              <span className="mr-2">📊</span>
              Download Tax Summary
            </Button>
            <Button variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
              <span className="mr-2">📞</span>
              Contact Tax Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ethiopian Flag Footer */}
      <div className="text-center py-6">
        <div className="text-4xl mb-2">🇪🇹</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nile Pay - Comprehensive Ethiopian banking statements and reports
        </p>
      </div>
    </section>
  );
};

export default Statements;
