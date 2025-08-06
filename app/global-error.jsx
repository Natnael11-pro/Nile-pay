"use client";

import Error from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
          <div className="text-center max-w-md mx-auto p-8">
            {/* Ethiopian Flag Pattern */}
            <div className="mb-6 relative">
              <div className="text-6xl mb-4">🇪🇹</div>
              <div className="absolute top-0 right-0 text-2xl opacity-30">🏦</div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              <span className="text-red-600">Oops!</span> Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We're sorry, but Nile Pay encountered an unexpected issue.
              Our Ethiopian banking system is working to resolve this quickly.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">🔄</span>
                Try Again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-6 py-3 bg-white border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300"
              >
                <span className="mr-2">🏠</span>
                Return to Nile Pay Home
              </button>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              <p>🇪🇹 Ethiopian Digital Payment Gateway</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
