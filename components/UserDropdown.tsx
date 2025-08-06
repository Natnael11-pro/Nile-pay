'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatEthiopianBirr } from '@/lib/utils';
import BankCard from './BankCard';

interface UserDropdownProps {
  user: any;
  banks: any[];
}

const UserDropdown = ({ user, banks }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {user?.firstName?.[0] || user?.first_name?.[0] || 'U'}
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
          {user?.firstName || user?.first_name || 'User'}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[80vh] overflow-y-auto">
            {/* User Profile Section */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user?.firstName?.[0] || user?.first_name?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {user?.firstName || user?.first_name} {user?.lastName || user?.last_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Banks Section */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Your Banks</h4>
                <Link 
                  href="/my-banks" 
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Manage
                </Link>
              </div>
              
              {banks?.length > 0 ? (
                <div className="space-y-2">
                  {banks.slice(0, 3).map((bank) => (
                    <Link
                      key={bank.id || bank.$id}
                      href={`/transaction-history/?id=${bank.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                        <span className="text-sm font-bold">🏦</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {bank.account_name || bank.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {bank.bank_name} • {formatEthiopianBirr(bank.balance || bank.currentBalance)}
                        </p>
                      </div>
                      <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}

                  {banks.length > 3 && (
                    <Link
                      href="/my-banks"
                      className="flex items-center justify-center gap-2 p-3 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <span>View all {banks.length} accounts</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-2xl mb-2">🏦</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">No banks connected</p>
                  <Link 
                    href="/my-banks"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Connect Bank
                  </Link>
                </div>
              )}
            </div>



            {/* Quick Actions */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Link
                  href="/my-banks"
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">🏦</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Banks</span>
                </Link>
                <Link
                  href="/transaction-history"
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">📊</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">History</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">👤</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile</span>
                </Link>
                <Link
                  href="/help"
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">❓</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Help</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <Link
                  href="/statements"
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">📄</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Statements</span>
                </Link>
                <Link
                  href="/security"
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">🔒</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Security</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/notifications"
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">🔔</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</span>
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">📞</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDropdown;
