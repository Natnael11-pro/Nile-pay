'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import ModernTransactionsView from './ModernTransactionsView'
import { Pagination } from './Pagination'
import { ChevronRight, TrendingUp, ChevronLeft, Building2 } from 'lucide-react'

const RecentTransactions = ({
  accounts,
  transactions = [],
  appwriteItemId,
  page = 1,
}: RecentTransactionsProps) => {
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const rowsPerPage = 10;

  // Filter transactions by selected account
  const currentAccount = accounts[currentAccountIndex] || accounts[0];
  const accountTransactions = transactions.filter((transaction: any) => {
    // Match by account ID or account number
    const accountId = currentAccount?.id || currentAccount?.appwriteItemId;
    const accountNumber = currentAccount?.account_number || currentAccount?.mask;

    return transaction.accountId === accountId ||
           transaction.account_id === accountId ||
           transaction.account_number === accountNumber ||
           transaction.account === accountId;
  });

  const totalPages = Math.ceil(accountTransactions.length / rowsPerPage);
  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = accountTransactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )

  // Find the current account index based on appwriteItemId
  useEffect(() => {
    const index = accounts.findIndex((account: any) =>
      (account.id || account.appwriteItemId) === appwriteItemId
    );
    if (index !== -1) {
      setCurrentAccountIndex(index);
    }
  }, [appwriteItemId, accounts]);

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentAccountIndex < accounts.length - 1) {
      setCurrentAccountIndex(currentAccountIndex + 1);
    }
    if (isRightSwipe && currentAccountIndex > 0) {
      setCurrentAccountIndex(currentAccountIndex - 1);
    }
  };

  return (
    <section className="recent-transactions bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-100/50 dark:shadow-gray-900/50 overflow-hidden">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 border-b border-gray-100 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Recent Activity</h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Your latest transactions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/transaction-history/?id=${currentAccount?.id || currentAccount?.appwriteItemId || appwriteItemId}`}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>
      </div>

      {accounts.length > 0 ? (
        <div className="p-4 sm:p-6">
          {/* Mobile: Swipeable Account Cards */}
          <div className="block lg:hidden">
            {/* Account Navigation */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Account {currentAccountIndex + 1} of {accounts.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentAccountIndex(Math.max(0, currentAccountIndex - 1))}
                  disabled={currentAccountIndex === 0}
                  aria-label="Previous account"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentAccountIndex(Math.min(accounts.length - 1, currentAccountIndex + 1))}
                  disabled={currentAccountIndex === accounts.length - 1}
                  aria-label="Next account"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Swipeable Container */}
            <div
              ref={containerRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="space-y-6"
            >
              {/* Account Dots Indicator */}
              <div className="flex justify-center gap-2 py-2">
                {accounts.map((_: any, index: number) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setCurrentAccountIndex(index)}
                    aria-label={`Go to account ${index + 1}`}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentAccountIndex
                        ? 'bg-green-600 w-6'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Transactions */}
              <ModernTransactionsView transactions={currentTransactions} />

              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination totalPages={totalPages} page={page} />
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Improved Account Selection */}
          <div className="hidden lg:block">
            {/* Clear Account Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Select Account</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {accounts.map((account: any, index: number) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => setCurrentAccountIndex(index)}
                    className={`w-full p-4 border rounded-xl transition-all duration-200 hover:shadow-md text-left ${
                      index === currentAccountIndex
                        ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                          {account.bank_name || account.name || account.officialName}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          •••• {(account.account_number || account.mask || '****').slice(-4)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Transactions */}
            <ModernTransactionsView transactions={currentTransactions} />

            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination totalPages={totalPages} page={page} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-12">
          <div className="max-w-md mx-auto text-center">
            {/* Modern Empty State */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-3xl flex items-center justify-center shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-sm">🇪🇹</span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Ready to Start Banking?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-8 leading-relaxed">
              Connect your Ethiopian bank account to view transactions, send money, and access all Nile Pay features.
            </p>

            <div className="space-y-3">
              <a
                href="/my-banks"
                className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🏦</span>
                </div>
                <span>Connect Ethiopian Bank</span>
              </a>

              <a
                href="/payment-gateway"
                className="w-full inline-flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-sm">💳</span>
                </div>
                <span>Explore Payment Gateway</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default RecentTransactions