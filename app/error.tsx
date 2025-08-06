'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Ethiopian Flag Pattern */}
        <div className="mb-8 relative">
          <div className="text-8xl mb-4">🇪🇹</div>
          <div className="absolute top-0 right-0 text-3xl opacity-30">🏦</div>
          <div className="absolute bottom-0 left-0 text-2xl opacity-20">💳</div>
        </div>

        {/* Error Message */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">Oops!</h1>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We encountered an unexpected error in your banking session. 
            Don't worry - your account and data are safe. Please try again.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={reset}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span className="mr-2">🔄</span>
            Try Again
          </Button>

          <Link href="/">
            <Button 
              variant="outline" 
              className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              <span className="mr-2">🏠</span>
              Return to Nile Pay Home
            </Button>
          </Link>

          <Link href="/my-banks">
            <Button 
              variant="outline" 
              className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              <span className="mr-2">🏦</span>
              Manage Bank Accounts
            </Button>
          </Link>

          <Link href="/payment-gateway">
            <Button 
              variant="outline" 
              className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              <span className="mr-2">💳</span>
              Make a Payment
            </Button>
          </Link>
        </div>

        {/* Error Details (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-left">
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
              Development Error Details:
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Need help? Try these:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/profile" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Profile
            </Link>
            <Link href="/transaction-history" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Transactions
            </Link>
            <Link href="/help" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Help & Support
            </Link>
            <Link href="/contact" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Ethiopian Banking Footer */}
        <div className="mt-8 text-xs text-gray-500 dark:text-gray-400">
          <p>🇪🇹 Ethiopian Digital Payment Gateway</p>
          <p className="mt-1">Secure Ethiopian Banking Platform</p>
          <p className="mt-1">Your account and data remain secure</p>
        </div>
      </div>
    </div>
  );
}
