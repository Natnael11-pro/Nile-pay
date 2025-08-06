import React from 'react';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import HeaderBox from '@/components/HeaderBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Security = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    redirect('/sign-in');
  }

  return (
    <section className="flex w-full flex-col gap-8 p-6 max-w-4xl mx-auto">
      <HeaderBox
        title="Security Settings"
        subtext="Manage your account security and authentication preferences"
      />

      {/* Security Overview */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <span>🛡️</span>
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🔒</div>
              <div className="font-semibold text-green-700 dark:text-green-300">Strong</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Password Security</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📱</div>
              <div className="font-semibold text-blue-700 dark:text-blue-300">Enabled</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Two-Factor Auth</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-semibold text-green-700 dark:text-green-300">Verified</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Account Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Password & Authentication */}
        <div className="space-y-6">
          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span>🔐</span>
                Password & Login
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Password</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Last changed 30 days ago</div>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Login History</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">View recent login activity</div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Active Sessions</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">3 devices currently logged in</div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span>📱</span>
                Two-Factor Authentication
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Enabled
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">SMS Authentication</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">+251-9XX-XXX-XXX</div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Authenticator App</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Google Authenticator</div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-gray-600 border-gray-600">Not Set</Badge>
                  <Button variant="outline" size="sm">
                    Setup
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Backup Codes</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Emergency access codes</div>
                </div>
                <Button variant="outline" size="sm">
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Security */}
        <div className="space-y-6">
          {/* Account Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span>✅</span>
                Account Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Email Verification</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{loggedIn.email}</div>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Verified
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Phone Verification</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">+251-9XX-XXX-XXX</div>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Verified
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Identity Verification (KYC)</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Ethiopian National ID</div>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Verified
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Bank Account Verification</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">2 accounts verified</div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span>🚨</span>
                Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Login from new device</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Get notified when someone logs in from an unrecognized device</div>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Suspicious activity</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Alert me about unusual account activity</div>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Large transactions</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Notify for transactions over 10,000 ETB</div>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded" />
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Security tips</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Receive periodic security recommendations</div>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <span>🔒</span>
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Data Sharing</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Share usage analytics</span>
                  <input type="checkbox" className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Marketing communications</span>
                  <input type="checkbox" className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Third-party integrations</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Account Visibility</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show online status</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Allow contact by phone</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show transaction history</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <span>📊</span>
            Recent Security Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-green-600">✅</span>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Successful login</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Mobile app • Addis Ababa • 2 hours ago</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-blue-600">🔐</span>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Two-factor authentication used</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Web browser • Addis Ababa • 1 day ago</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-yellow-600">⚠️</span>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Failed login attempt</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Unknown device • Dire Dawa • 3 days ago</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Review
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              View Full Security Log
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Actions */}
      <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-lg text-red-700 dark:text-red-300 flex items-center gap-2">
            <span>🚨</span>
            Emergency Security Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <span className="mr-2">🔒</span>
              Lock Account Immediately
            </Button>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <span className="mr-2">📱</span>
              Revoke All Sessions
            </Button>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <span className="mr-2">🔄</span>
              Reset All Passwords
            </Button>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <span className="mr-2">📞</span>
              Contact Security Team
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      <div className="flex justify-end">
        <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
          <span className="mr-2">💾</span>
          Save Security Settings
        </Button>
      </div>

      {/* Ethiopian Flag Footer */}
      <div className="text-center py-6">
        <div className="text-4xl mb-2">🇪🇹</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nile Pay - Bank-grade security for Ethiopian digital banking
        </p>
      </div>
    </section>
  );
};

export default Security;
