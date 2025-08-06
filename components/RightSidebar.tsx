import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BankCard from './BankCard'
import { countTransactionCategories } from '@/lib/utils'
import Category from './Category'

const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
  const categories: CategoryCount[] = countTransactionCategories(transactions);

  return (
    <aside className="right-sidebar bg-gradient-to-b from-white via-green-50/30 to-yellow-50/30 border-l border-green-100">
      <div className="right-sidebar-content">
        <section className="flex flex-col pb-8">
        {/* Ethiopian Profile Banner */}
        <div className="h-24 bg-gradient-to-r from-green-600 via-yellow-400 to-red-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-2 right-2 text-2xl">🇪🇹</div>
          <div className="absolute bottom-2 left-2 text-white text-xs font-semibold">Ethiopian Banking</div>
        </div>

        <div className="profile relative -mt-8">
          <div className="profile-img bg-gradient-to-br from-green-600 to-emerald-600 border-4 border-white shadow-xl">
            <span className="text-3xl font-bold text-white">{user.firstName?.[0] || 'U'}</span>
          </div>

          <div className="profile-details mt-4">
            <h1 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
              <span className="text-lg">👤</span>
              {user.firstName || 'User'} {user.lastName || ''}
            </h1>
            <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
              <span className="text-sm">📧</span>
              {user.email}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span className="text-green-500">🏦</span>
              <span>Ethiopian Banking Customer</span>
            </div>
          </div>
        </div>
      </section>

      <section className="banks">
        <div className="flex w-full justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏦</span>
            <h2 className="text-lg font-bold text-gray-900">Ethiopian Banks</h2>
          </div>
          <Link href="/" className="flex items-center gap-2 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors duration-200 group">
            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <span className="text-white text-xs font-bold">+</span>
            </div>
            <span className="text-sm font-semibold text-green-700">
              Add Bank
            </span>
          </Link>
        </div>

        {banks?.length > 0 ? (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className='relative z-10 w-full'>
              <BankCard
                key={banks[0].id || banks[0].$id}
                account={banks[0]}
                userName={`${user.firstName || 'User'} ${user.lastName || ''}`}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <BankCard
                  key={banks[1].id || banks[1].$id}
                  account={banks[1]}
                  userName={`${user.firstName || 'User'} ${user.lastName || ''}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-50 to-yellow-50 border-2 border-dashed border-green-200 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">🏦</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Banks Connected</h3>
            <p className="text-gray-500 text-sm mb-4">Connect your Ethiopian bank account to start using Nile Pay</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
              <span>🇪🇹</span>
              <span>Connect Bank</span>
            </Link>
          </div>
        )}

        <div className="mt-10 flex flex-1 flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="text-lg font-bold text-gray-900">Transaction Categories</h2>
          </div>

          <div className='space-y-4'>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <Category key={category.name} category={category} />
              ))
            ) : (
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 border border-green-100 rounded-lg p-6 text-center">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">No Transactions Yet</h3>
                <p className="text-xs text-gray-500">Start making transactions to see your spending categories</p>
              </div>
            )}
          </div>
        </div>
      </section>
      </div>
    </aside>
  )
}

export default RightSidebar