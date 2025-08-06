'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { 
  FileText, 
  Calendar, 
  Filter, 
  Download, 
  Mail, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  DollarSign,
  CreditCard,
  Building,
  Clock,
  X
} from 'lucide-react';

interface CustomReportsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: any[];
  user: any;
}

const CustomReportsDialog = ({ isOpen, onClose, accounts, user }: CustomReportsDialogProps) => {
  const [reportType, setReportType] = useState<string>('');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<string>('');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [reportFormat, setReportFormat] = useState<string>('pdf');
  const [includeCharts, setIncludeCharts] = useState<boolean>(true);
  const [includeSummary, setIncludeSummary] = useState<boolean>(true);
  const [includeTransactions, setIncludeTransactions] = useState<boolean>(true);
  const [emailReport, setEmailReport] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const reportTypes = [
    {
      id: 'comprehensive',
      title: 'Comprehensive Financial Report',
      description: 'Complete overview of all accounts and transactions',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'spending-analysis',
      title: 'Spending Analysis Report',
      description: 'Detailed breakdown of expenses by category',
      icon: <PieChart className="h-5 w-5" />,
      color: 'bg-purple-500'
    },
    {
      id: 'income-tracking',
      title: 'Income Tracking Report',
      description: 'Analysis of all incoming transactions',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-green-500'
    },
    {
      id: 'account-comparison',
      title: 'Account Comparison Report',
      description: 'Compare performance across multiple accounts',
      icon: <Building className="h-5 w-5" />,
      color: 'bg-orange-500'
    },
    {
      id: 'monthly-summary',
      title: 'Monthly Summary Report',
      description: 'Month-by-month financial overview',
      icon: <Calendar className="h-5 w-5" />,
      color: 'bg-indigo-500'
    },
    {
      id: 'tax-preparation',
      title: 'Tax Preparation Report',
      description: 'Ethiopian tax-compliant financial summary',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-red-500'
    }
  ];

  const dateRanges = [
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-3-months', label: 'Last 3 Months' },
    { value: 'last-6-months', label: 'Last 6 Months' },
    { value: 'last-12-months', label: 'Last 12 Months' },
    { value: 'current-year', label: 'Current Year' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Date Range' }
  ];

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleGenerateReport = async () => {
    if (!reportType) {
      alert('Please select a report type');
      return;
    }

    if (selectedAccounts.length === 0) {
      alert('Please select at least one account');
      return;
    }

    if (!dateRange) {
      alert('Please select a date range');
      return;
    }

    if (dateRange === 'custom' && (!customStartDate || !customEndDate)) {
      alert('Please select custom date range');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/reports/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.$id || user.id,
          reportType,
          accounts: selectedAccounts,
          dateRange,
          customStartDate,
          customEndDate,
          format: reportFormat,
          includeCharts,
          includeSummary,
          includeTransactions,
          emailReport
        }),
      });

      if (response.ok) {
        if (reportFormat === 'pdf') {
          const data = await response.json();

          // Create a new window with the HTML content for PDF generation
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(data.reportContent);
            printWindow.document.close();

            // Wait for content to load then trigger print
            printWindow.onload = () => {
              setTimeout(() => {
                printWindow.print();
              }, 500);
            };
          }
        } else if (reportFormat === 'excel' || reportFormat === 'csv') {
          // Handle file download
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.download = `nile-pay-${reportType}-report.${reportFormat === 'excel' ? 'xls' : 'csv'}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }

        const reportTitle = reportTypes.find(r => r.id === reportType)?.title;
        if (emailReport) {
          alert(`${reportTitle} has been generated and sent to ${user.email}!`);
        } else {
          alert(`${reportTitle} has been generated successfully!`);
        }

        onClose();
      } else {
        const error = await response.json();
        alert(`Failed to generate report: ${error.error}`);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Generate Custom Report
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Create detailed financial reports tailored to your needs
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Type Selection */}
          <div>
            <Label className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 block">
              Select Report Type
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reportTypes.map((type) => (
                <Card 
                  key={type.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    reportType === type.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setReportType(type.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 ${type.color} rounded-lg text-white`}>
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                          {type.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {type.description}
                        </p>
                      </div>
                      {reportType === type.id && (
                        <Badge className="bg-blue-500 text-white">Selected</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Account Selection */}
          <div>
            <Label className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 block">
              Select Accounts
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {accounts.map((account) => (
                <div 
                  key={account.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Checkbox
                    id={account.id}
                    checked={selectedAccounts.includes(account.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleAccountToggle(account.id);
                      } else {
                        handleAccountToggle(account.id);
                      }
                    }}
                  />
                  <div className="flex-1">
                    <label htmlFor={account.id} className="cursor-pointer">
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {account.account_name || account.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {account.bank_name} • ****{account.account_number?.slice(-4)}
                      </p>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 block">
                Date Range
              </Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 block">
                Report Format
              </Label>
              <Select value={reportFormat} onValueChange={setReportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom Date Range */}
          {dateRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Start Date
                </Label>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  End Date
                </Label>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Report Options */}
          <div>
            <Label className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 block">
              Report Options
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="include-charts"
                    checked={includeCharts}
                    onCheckedChange={(checked) => setIncludeCharts(checked === true)}
                  />
                  <label htmlFor="include-charts" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    Include Charts & Graphs
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="include-summary"
                    checked={includeSummary}
                    onCheckedChange={(checked) => setIncludeSummary(checked === true)}
                  />
                  <label htmlFor="include-summary" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    Include Executive Summary
                  </label>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="include-transactions"
                    checked={includeTransactions}
                    onCheckedChange={(checked) => setIncludeTransactions(checked === true)}
                  />
                  <label htmlFor="include-transactions" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    Include Transaction Details
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="email-report"
                    checked={emailReport}
                    onCheckedChange={(checked) => setEmailReport(checked === true)}
                  />
                  <label htmlFor="email-report" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    Email Report to {user.email}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isGenerating}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleGenerateReport}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  {emailReport ? <Mail className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomReportsDialog;
