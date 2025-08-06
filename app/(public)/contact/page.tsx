import React from 'react';
import HeaderBox from '@/components/HeaderBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Contact = () => {

  return (
    <section className="flex w-full flex-col gap-8 p-6 max-w-4xl mx-auto">
      <HeaderBox
        title="Contact Nile Pay"
        subtext="Get in touch with our Ethiopian banking support team"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Methods */}
        <div className="space-y-6">
          {/* Phone Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span>📞</span>
                Phone Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Customer Service</div>
                  <div className="text-blue-600 dark:text-blue-400 font-mono">+251-11-XXX-XXXX</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Mon-Fri: 8:00 AM - 6:00 PM EAT</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Emergency Hotline</div>
                  <div className="text-red-600 dark:text-red-400 font-mono">+251-11-XXX-XXXX</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Available 24/7</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Technical Support</div>
                  <div className="text-green-600 dark:text-green-400 font-mono">+251-11-XXX-XXXX</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Mon-Sat: 9:00 AM - 5:00 PM EAT</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span>📧</span>
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">General Inquiries</div>
                  <div className="text-blue-600 dark:text-blue-400">support@nilepay.et</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Response within 24 hours</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Technical Issues</div>
                  <div className="text-blue-600 dark:text-blue-400">tech@nilepay.et</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Response within 4 hours</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Business Partnerships</div>
                  <div className="text-blue-600 dark:text-blue-400">business@nilepay.et</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Response within 48 hours</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Chat */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span>💬</span>
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Chat with our support team in real-time
              </p>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <span className="mr-2">💬</span>
                Start Live Chat
              </Button>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Available: Mon-Fri, 9:00 AM - 5:00 PM EAT
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Office Locations & Additional Info */}
        <div className="space-y-6">
          {/* Office Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span>🏢</span>
                Office Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Addis Ababa (Headquarters)</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    Bole Road, Atlas Building<br />
                    Floor 5, Office 501<br />
                    Addis Ababa, Ethiopia
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Mon-Fri: 8:30 AM - 5:30 PM EAT
                  </div>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4">
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Dire Dawa Branch</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    Ras Mekonnen Avenue<br />
                    Commercial Bank Building<br />
                    Dire Dawa, Ethiopia
                  </div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                    Mon-Fri: 9:00 AM - 5:00 PM EAT
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Mekelle Branch</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    Enda Selassie Area<br />
                    Tigray Financial Center<br />
                    Mekelle, Ethiopia
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                    Mon-Fri: 9:00 AM - 5:00 PM EAT
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span>📱</span>
                Follow Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="https://twitter.com/nilepay" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <span>🐦</span>
                  <span className="text-sm">Twitter</span>
                </a>
                <a 
                  href="https://facebook.com/nilepay" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <span>📘</span>
                  <span className="text-sm">Facebook</span>
                </a>
                <a 
                  href="https://t.me/nilepay" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <span>📱</span>
                  <span className="text-sm">Telegram</span>
                </a>
                <a 
                  href="https://linkedin.com/company/nilepay" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <span>💼</span>
                  <span className="text-sm">LinkedIn</span>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span>⚡</span>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/help">
                    <span className="mr-2">❓</span>
                    Browse FAQ & Help Center
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/transaction-history">
                    <span className="mr-2">📊</span>
                    Check Transaction Status
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/profile">
                    <span className="mr-2">👤</span>
                    Update Profile Information
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Emergency Information */}
      <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-lg text-red-700 dark:text-red-300 flex items-center gap-2">
            <span>🚨</span>
            Emergency Banking Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="font-semibold text-red-700 dark:text-red-300 mb-1">Fraud Alert</div>
              <div className="text-red-600 dark:text-red-400 font-mono">+251-11-XXX-XXXX</div>
              <div className="text-xs text-red-500 dark:text-red-400">24/7 Immediate Response</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-700 dark:text-red-300 mb-1">Account Lockout</div>
              <div className="text-red-600 dark:text-red-400 font-mono">+251-11-XXX-XXXX</div>
              <div className="text-xs text-red-500 dark:text-red-400">24/7 Account Recovery</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-700 dark:text-red-300 mb-1">Technical Emergency</div>
              <div className="text-red-600 dark:text-red-400 font-mono">+251-11-XXX-XXXX</div>
              <div className="text-xs text-red-500 dark:text-red-400">24/7 System Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ethiopian Flag Footer */}
      <div className="text-center py-6">
        <div className="text-4xl mb-2">🇪🇹</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nile Pay - Ethiopian Digital Banking Platform
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Regulated by the National Bank of Ethiopia
        </p>
      </div>
    </section>
  );
};

export default Contact;
