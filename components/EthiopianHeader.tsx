'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface EthiopianHeaderProps {
  user?: any;
  type?: 'dashboard' | 'auth' | 'landing';
  showNavigation?: boolean;
}

const EthiopianHeader = ({ user, type = 'dashboard', showNavigation = true }: EthiopianHeaderProps) => {
  return (
    <header className="w-full bg-white border-b border-gray-100 eth-flag-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/icons/logo.svg"
                width={36}
                height={36}
                alt="Nile Pay logo"
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-yellow-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold eth-gradient-text">Nile Pay</h1>
              <span className="text-xs text-gray-500 font-medium">Ethiopian Digital Payments</span>
            </div>
          </Link>

          {/* Navigation */}
          {showNavigation && type === 'dashboard' && (
            <nav className="hidden md:flex items-center gap-8">
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-green-600 font-medium transition-colors duration-200 relative group"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                href="/transfer" 
                className="text-gray-600 hover:text-green-600 font-medium transition-colors duration-200 relative group"
              >
                Send Money
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                href="/transactions" 
                className="text-gray-600 hover:text-green-600 font-medium transition-colors duration-200 relative group"
              >
                Transactions
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                href="/banks" 
                className="text-gray-600 hover:text-green-600 font-medium transition-colors duration-200 relative group"
              >
                Banks
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>
          )}

          {/* Ethiopian Cultural Elements */}
          <div className="flex items-center gap-4">
            {/* Ethiopian Time Display */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
              <span className="text-green-500">🕐</span>
              <span>Ethiopian Time</span>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 text-sm">
              <span className="text-green-600 font-medium">🇪🇹</span>
              <select className="bg-transparent text-gray-600 font-medium focus:outline-none cursor-pointer">
                <option value="en">English</option>
                <option value="am">አማርኛ</option>
                <option value="or">Oromiffa</option>
              </select>
            </div>

            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user.region || 'Ethiopia'}
                  </span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/sign-in"
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up"
                  className="eth-btn-primary px-4 py-2 text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ethiopian Cultural Banner */}
      <div className="bg-gradient-to-r from-green-50 to-yellow-50 border-b border-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <span>🔒</span>
              <span className="font-medium">Secure</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2 text-yellow-600">
              <span>⚡</span>
              <span className="font-medium">Fast</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2 text-red-600">
              <span>🇪🇹</span>
              <span className="font-medium">Ethiopian</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2 text-blue-600">
              <span>💳</span>
              <span className="font-medium">All Banks</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EthiopianHeader;
