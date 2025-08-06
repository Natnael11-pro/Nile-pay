import React from 'react';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import HeaderBox from '@/components/HeaderBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Notifications = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    redirect('/sign-in');
  }

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'transaction',
      title: 'Payment Successful',
      message: 'Your payment of 2,500 ETB to Ethio Telecom has been processed successfully.',
      time: '2 minutes ago',
      read: false,
      icon: '✅',
      color: 'green'
    },
    {
      id: 2,
      type: 'security',
      title: 'New Device Login',
      message: 'A new device has been used to access your account from Addis Ababa.',
      time: '1 hour ago',
      read: false,
      icon: '🔐',
      color: 'yellow'
    },
    {
      id: 3,
      type: 'system',
      title: 'Maintenance Complete',
      message: 'Scheduled maintenance has been completed. All services are now fully operational.',
      time: '3 hours ago',
      read: true,
      icon: '🔧',
      color: 'blue'
    },
    {
      id: 4,
      type: 'promotion',
      title: 'New Feature Available',
      message: 'QR Code payments are now available! Try the new instant payment method.',
      time: '1 day ago',
      read: true,
      icon: '🎉',
      color: 'purple'
    },
    {
      id: 5,
      type: 'transaction',
      title: 'Money Received',
      message: 'You received 5,000 ETB from Alemayehu Tadesse via bank transfer.',
      time: '2 days ago',
      read: true,
      icon: '💰',
      color: 'green'
    },
    {
      id: 6,
      type: 'security',
      title: 'Password Changed',
      message: 'Your account password was successfully updated for enhanced security.',
      time: '3 days ago',
      read: true,
      icon: '🔒',
      color: 'blue'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <section className="flex w-full flex-col gap-8 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <HeaderBox
          title="Notifications"
          subtext={`You have ${unreadCount} unread notifications`}
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <span className="mr-2">✓</span>
            Mark All Read
          </Button>
          <Button variant="outline" size="sm">
            <span className="mr-2">⚙️</span>
            Settings
          </Button>
        </div>
      </div>

      {/* Notification Categories */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          All ({notifications.length})
        </Badge>
        <Badge variant="outline">
          Transactions (2)
        </Badge>
        <Badge variant="outline">
          Security (2)
        </Badge>
        <Badge variant="outline">
          System (1)
        </Badge>
        <Badge variant="outline">
          Promotions (1)
        </Badge>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`transition-all duration-200 hover:shadow-md ${
              !notification.read 
                ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`text-2xl flex-shrink-0 ${
                  notification.color === 'green' ? 'text-green-600' :
                  notification.color === 'yellow' ? 'text-yellow-600' :
                  notification.color === 'blue' ? 'text-blue-600' :
                  notification.color === 'purple' ? 'text-purple-600' :
                  'text-gray-600'
                }`}>
                  {notification.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-semibold ${
                        !notification.read 
                          ? 'text-gray-900 dark:text-gray-100' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                        )}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        !notification.read 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {notification.time}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          notification.type === 'transaction' ? 'border-green-300 text-green-700 dark:text-green-400' :
                          notification.type === 'security' ? 'border-yellow-300 text-yellow-700 dark:text-yellow-400' :
                          notification.type === 'system' ? 'border-blue-300 text-blue-700 dark:text-blue-400' :
                          notification.type === 'promotion' ? 'border-purple-300 text-purple-700 dark:text-purple-400' :
                          'border-gray-300 text-gray-700 dark:text-gray-400'
                        }`}
                      >
                        {notification.type}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                  {!notification.read && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="text-blue-600">✓</span>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="text-gray-400">×</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (if no notifications) */}
      {notifications.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              No Notifications
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You're all caught up! We'll notify you when something important happens.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <span>⚙️</span>
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Transaction Notifications</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>Payment confirmations</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>Money received</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>Failed transactions</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>Daily transaction summary</span>
                </label>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Security Notifications</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>New device logins</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>Password changes</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>Suspicious activity</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>Security tips</span>
                </label>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Delivery Methods</h4>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>📱 In-app notifications</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>📧 Email notifications</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span>📱 SMS notifications</span>
              </label>
            </div>
          </div>
          <div className="mt-6">
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
              <span className="mr-2">💾</span>
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ethiopian Flag Footer */}
      <div className="text-center py-6">
        <div className="text-4xl mb-2">🇪🇹</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nile Pay - Stay informed about your Ethiopian banking activities
        </p>
      </div>
    </section>
  );
};

export default Notifications;
