'use client';

import { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  Building,
  CreditCard,
  Smartphone,
  QrCode,
  MoreHorizontal
} from 'lucide-react';
import { formatEthiopianBirr, formatDateTime, getTransactionStatus, removeSpecialCharacters } from '@/lib/utils';
import { transactionCategoryStyles } from '@/constants';

interface ModernTransactionsViewProps {
  transactions: Transaction[];
}

const getTransactionIcon = (category: string, type: string) => {
  if (type === 'credit') {
    return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
  } else {
    return <ArrowUpRight className="w-4 h-4 text-red-500" />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'success':
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'pending':
    case 'processing':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'failed':
    case 'declined':
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'bill payment':
      return <CreditCard className="w-4 h-4" />;
    case 'money transfer':
      return <ArrowUpRight className="w-4 h-4" />;
    case 'mobile money':
      return <Smartphone className="w-4 h-4" />;
    case 'qr payment':
      return <QrCode className="w-4 h-4" />;
    default:
      return <Building className="w-4 h-4" />;
  }
};

const ModernTransactionsView = ({ transactions }: ModernTransactionsViewProps) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Recent Transactions</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Toggle - Mobile First */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Transactions ({transactions.length})
        </h3>
        <div className="hidden sm:flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Cards
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
              viewMode === 'table'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Mobile Card View (Default) */}
      <div className={`${viewMode === 'table' ? 'hidden sm:hidden' : 'block sm:hidden'} space-y-3`}>
        {transactions.map((transaction) => {
          const status = getTransactionStatus(new Date(transaction.date));
          const amount = formatEthiopianBirr(Math.abs(transaction.amount));
          const isDebit = transaction.type === 'debit';
          const dateTime = formatDateTime(new Date(transaction.date));

          return (
            <div
              key={transaction.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDebit 
                      ? 'bg-red-50 dark:bg-red-900/20' 
                      : 'bg-green-50 dark:bg-green-900/20'
                  }`}>
                    {getTransactionIcon(transaction.category, transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                      {removeSpecialCharacters(transaction.name)}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {getCategoryIcon(transaction.category)}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${
                    isDebit ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {isDebit ? '-' : '+'}{amount}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getStatusIcon(status)}
                    <span className="text-xs text-gray-500 dark:text-gray-400">{status}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{dateTime.dateTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  <span>{transaction.paymentChannel || 'Bank'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className={`${viewMode === 'cards' ? 'hidden sm:hidden' : 'hidden sm:block'} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => {
                const status = getTransactionStatus(new Date(transaction.date));
                const amount = formatEthiopianBirr(Math.abs(transaction.amount));
                const isDebit = transaction.type === 'debit';
                const dateTime = formatDateTime(new Date(transaction.date));

                return (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isDebit 
                            ? 'bg-red-50 dark:bg-red-900/20' 
                            : 'bg-green-50 dark:bg-green-900/20'
                        }`}>
                          {getTransactionIcon(transaction.category, transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {removeSpecialCharacters(transaction.name)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.paymentChannel || 'Bank Transfer'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-semibold ${
                        isDebit ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                        {isDebit ? '-' : '+'}{amount}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="text-sm text-gray-700 dark:text-gray-300">{status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {dateTime.dateTime}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(transaction.category)}
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {transaction.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button 
                        type="button"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Default Card View for Desktop when cards mode is selected */}
      <div className={`${viewMode === 'table' ? 'hidden' : 'hidden sm:block'} grid gap-3 sm:grid-cols-2 lg:grid-cols-1`}>
        {transactions.map((transaction) => {
          const status = getTransactionStatus(new Date(transaction.date));
          const amount = formatEthiopianBirr(Math.abs(transaction.amount));
          const isDebit = transaction.type === 'debit';
          const dateTime = formatDateTime(new Date(transaction.date));

          return (
            <div
              key={transaction.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDebit 
                      ? 'bg-red-50 dark:bg-red-900/20' 
                      : 'bg-green-50 dark:bg-green-900/20'
                  }`}>
                    {getTransactionIcon(transaction.category, transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                      {removeSpecialCharacters(transaction.name)}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(transaction.category)}
                        <span>{transaction.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{dateTime.dateTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${
                    isDebit ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {isDebit ? '-' : '+'}{amount}
                  </p>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    {getStatusIcon(status)}
                    <span className="text-xs text-gray-500 dark:text-gray-400">{status}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModernTransactionsView;
