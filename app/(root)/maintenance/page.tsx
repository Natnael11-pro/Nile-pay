import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Ethiopian Flag and Tools */}
        <div className="mb-8 relative">
          <div className="text-8xl mb-4">🇪🇹</div>
          <div className="absolute top-0 right-0 text-4xl opacity-40 animate-pulse">🔧</div>
          <div className="absolute bottom-0 left-0 text-3xl opacity-30 animate-bounce">⚙️</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl opacity-20">🏦</div>
        </div>

        {/* Main Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            System Maintenance
          </h1>
          <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Nile Pay is currently undergoing scheduled maintenance
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We're working hard to improve our Ethiopian banking services. 
            Our system will be back online shortly with enhanced features and better performance.
          </p>
        </div>

        {/* Maintenance Details */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2">
              <span>⏰</span>
              Maintenance Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Start Time</div>
                <div className="text-blue-600 dark:text-blue-300">2:00 AM EAT</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="font-semibold text-green-800 dark:text-green-200 mb-1">Expected End</div>
                <div className="text-green-600 dark:text-green-300">6:00 AM EAT</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Ethiopian Time (UTC+3)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Being Updated */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2">
              <span>🚀</span>
              What We're Improving
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Enhanced security features
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Faster transaction processing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Improved mobile experience
                </li>
              </ul>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  New Ethiopian bank integrations
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Better error handling
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Performance optimizations
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-lg text-red-700 dark:text-red-300 flex items-center justify-center gap-2">
              <span>🚨</span>
              Emergency Banking Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 dark:text-red-400 text-sm mb-4">
              For urgent banking needs during maintenance:
            </p>
            <div className="space-y-3">
              <div className="text-center">
                <div className="font-semibold text-red-700 dark:text-red-300">Emergency Hotline</div>
                <div className="text-red-600 dark:text-red-400">+251-11-XXX-XXXX</div>
                <div className="text-xs text-red-500 dark:text-red-400">Available 24/7</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-red-700 dark:text-red-300">Alternative Banking</div>
                <div className="text-red-600 dark:text-red-400 text-sm">
                  Use your bank's mobile app or visit ATMs for urgent transactions
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Updates */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2">
              <span>📢</span>
              Stay Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Get real-time updates on our maintenance progress:
            </p>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => window.location.reload()}
              >
                <span className="mr-2">🔄</span>
                Refresh Page
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="https://twitter.com/nilepay" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <span>🐦</span>
                  Twitter
                </a>
                <a 
                  href="https://t.me/nilepay" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <span>📱</span>
                  Telegram
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full animate-pulse" style={{width: '65%'}}></div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Maintenance Progress: 65% Complete
          </div>
        </div>

        {/* Thank You Message */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thank you for your patience as we enhance your Ethiopian banking experience.
          </p>
          <div className="text-4xl mb-2">🙏</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🇪🇹 Nile Pay - Ethiopian Digital Banking Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
