import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Ethiopian Flag Pattern */}
        <div className="mb-8 relative">
          <div className="text-8xl mb-4">🇪🇹</div>
          <div className="absolute top-0 right-0 text-3xl opacity-30">🏦</div>
          <div className="absolute bottom-0 left-0 text-2xl opacity-20">💳</div>
        </div>

        {/* 404 Error */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sorry, the page you're looking for doesn't exist in our Ethiopian banking system. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <span className="mr-2">🏠</span>
              Return to Nile Pay Home
            </Button>
          </Link>

          <Link href="/payment-gateway">
            <Button variant="outline" className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 font-semibold py-3 px-6 rounded-xl transition-all duration-300">
              <span className="mr-2">💳</span>
              Go to Payment Gateway
            </Button>
          </Link>

          <Link href="/help">
            <Button variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold py-3 px-6 rounded-xl transition-all duration-300">
              <span className="mr-2">📞</span>
              Get Help & Support
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/my-banks" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              My Banks
            </Link>
            <Link href="/transaction-history" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Transactions
            </Link>
            <Link href="/profile" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Profile
            </Link>
            <Link href="/about" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              About
            </Link>
          </div>
        </div>

        {/* Ethiopian Banking Footer */}
        <div className="mt-8 text-xs text-gray-500 dark:text-gray-400">
          <p>🇪🇹 Ethiopian Digital Payment Gateway</p>
          <p className="mt-1">Secure Ethiopian Banking Platform</p>
        </div>
      </div>
    </div>
  );
}
