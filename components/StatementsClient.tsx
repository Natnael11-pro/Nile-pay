'use client';

import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { formatEthiopianBirr } from '@/lib/utils';
import { Download, Eye, Mail, FileText, Loader2, Filter, Calendar, FileSpreadsheet, FileDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface Statement {
  id: number;
  period: string;
  startDate: string;
  endDate: string;
  status: string;
  transactions: number;
  totalInflow: number;
  totalOutflow: number;
  balance: number;
  downloadUrl: string;
}

interface StatementsClientProps {
  statements: Statement[];
  accounts: any[];
  user: any;
}

const StatementsClient = ({ statements, accounts, user }: StatementsClientProps) => {
  const [loadingPdf, setLoadingPdf] = useState<number | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('6months');
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [emailingStatement, setEmailingStatement] = useState<number | null>(null);
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Filter statements based on selected criteria
  const filteredStatements = useMemo(() => {
    let filtered = [...statements];

    // Filter by period
    if (selectedPeriod === '3months') {
      filtered = filtered.slice(0, 3);
    } else if (selectedPeriod === '12months') {
      filtered = statements.slice(0, 12);
    } else if (selectedPeriod === 'current-year') {
      const currentYear = new Date().getFullYear();
      filtered = statements.filter(s => s.period.includes(currentYear.toString()));
    }

    return filtered;
  }, [statements, selectedPeriod]);

  const generatePDF = async (statement: Statement) => {
    setLoadingPdf(statement.id);
    
    try {
      // Get the primary account for this user
      const primaryAccount = accounts[0];
      
      if (!primaryAccount) {
        alert('No account found for PDF generation');
        return;
      }

      const response = await fetch('/api/statements/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.$id,
          accountId: primaryAccount.id,
          startDate: statement.startDate,
          endDate: statement.endDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Create a new window with the HTML content for PDF generation
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(data.htmlContent);
          printWindow.document.close();
          
          // Wait for content to load then trigger print
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
            }, 500);
          };
        }
      } else {
        const error = await response.json();
        alert(`Failed to generate PDF: ${error.error}`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoadingPdf(null);
    }
  };

  const downloadPDF = async (statement: Statement) => {
    setLoadingPdf(statement.id);

    try {
      const primaryAccount = accounts[0];

      if (!primaryAccount) {
        alert('No account found for PDF generation');
        return;
      }

      const response = await fetch('/api/statements/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.$id,
          accountId: primaryAccount.id,
          startDate: statement.startDate,
          endDate: statement.endDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Create a blob with the HTML content
        const blob = new Blob([data.htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `nile-pay-statement-${statement.period.replace(' ', '-').toLowerCase()}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        alert('Statement downloaded successfully! You can open the HTML file in your browser and print to PDF.');
      } else {
        const error = await response.json();
        alert(`Failed to generate statement: ${error.error}`);
      }
    } catch (error) {
      console.error('Error downloading statement:', error);
      alert('Failed to download statement. Please try again.');
    } finally {
      setLoadingPdf(null);
    }
  };

  const emailStatement = async (statement: Statement) => {
    setEmailingStatement(statement.id);

    try {
      const primaryAccount = accounts[0];

      if (!primaryAccount) {
        alert('No account found for statement generation');
        return;
      }

      const response = await fetch('/api/statements/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.$id,
          accountId: primaryAccount.id,
          startDate: statement.startDate,
          endDate: statement.endDate,
          email: user.email,
          period: statement.period,
        }),
      });

      if (response.ok) {
        alert(`Statement for ${statement.period} has been sent to ${user.email}`);
      } else {
        const error = await response.json();
        alert(`Failed to email statement: ${error.error}`);
      }
    } catch (error) {
      console.error('Error emailing statement:', error);
      alert('Failed to email statement. Please try again.');
    } finally {
      setEmailingStatement(null);
    }
  };

  const downloadExcel = async (statement: Statement) => {
    setLoadingPdf(statement.id);

    try {
      const primaryAccount = accounts[0];

      if (!primaryAccount) {
        alert('No account found for Excel generation');
        return;
      }

      const response = await fetch('/api/statements/generate-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.$id,
          accountId: primaryAccount.id,
          startDate: statement.startDate,
          endDate: statement.endDate,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `nile-pay-statement-${statement.period.replace(' ', '-').toLowerCase()}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        alert('Excel statement downloaded successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to generate Excel: ${error.error}`);
      }
    } catch (error) {
      console.error('Error downloading Excel:', error);
      alert('Failed to download Excel. Please try again.');
    } finally {
      setLoadingPdf(null);
    }
  };

  const downloadCSV = async (statement: Statement) => {
    setLoadingPdf(statement.id);

    try {
      const primaryAccount = accounts[0];

      if (!primaryAccount) {
        alert('No account found for CSV generation');
        return;
      }

      const response = await fetch('/api/statements/generate-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.$id,
          accountId: primaryAccount.id,
          startDate: statement.startDate,
          endDate: statement.endDate,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `nile-pay-statement-${statement.period.replace(' ', '-').toLowerCase()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        alert('CSV statement downloaded successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to generate CSV: ${error.error}`);
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download CSV. Please try again.');
    } finally {
      setLoadingPdf(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statement Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Statements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Account
              </Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.bank_name} - ****{account.account_number?.slice(-4)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Period
              </Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                  <SelectItem value="current-year">Current Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Format
              </Label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={() => {
                  // Filters are applied automatically via useMemo
                  alert(`Filters applied: ${selectedAccount === 'all' ? 'All Accounts' : 'Selected Account'}, ${selectedPeriod}, ${selectedFormat.toUpperCase()}`);
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Custom Date Range */}
          {selectedPeriod === 'custom' && (
            <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </Label>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </Label>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Available Statements</h3>

      {filteredStatements.map((statement) => (
        <Card key={statement.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">📄</div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                    {statement.period}
                    {statement.status === 'current' && (
                      <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Current
                      </Badge>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {statement.startDate} to {statement.endDate}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {statement.transactions} transactions
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Inflow</div>
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    +{formatEthiopianBirr(statement.totalInflow)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Outflow</div>
                  <div className="font-semibold text-red-600 dark:text-red-400">
                    -{formatEthiopianBirr(statement.totalOutflow)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Net Balance</div>
                  <div className="font-semibold text-blue-600 dark:text-blue-400">
                    {formatEthiopianBirr(statement.balance)}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generatePDF(statement)}
                  disabled={loadingPdf === statement.id}
                >
                  {loadingPdf === statement.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  View PDF
                </Button>

                {selectedFormat === 'pdf' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadPDF(statement)}
                    disabled={loadingPdf === statement.id}
                  >
                    {loadingPdf === statement.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    PDF
                  </Button>
                )}

                {selectedFormat === 'excel' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadExcel(statement)}
                    disabled={loadingPdf === statement.id}
                  >
                    {loadingPdf === statement.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                    )}
                    Excel
                  </Button>
                )}

                {selectedFormat === 'csv' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadCSV(statement)}
                    disabled={loadingPdf === statement.id}
                  >
                    {loadingPdf === statement.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileDown className="h-4 w-4 mr-2" />
                    )}
                    CSV
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => emailStatement(statement)}
                  disabled={emailingStatement === statement.id}
                >
                  {emailingStatement === statement.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredStatements.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No Statements Available
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Start making transactions to generate your first statement.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatementsClient;
