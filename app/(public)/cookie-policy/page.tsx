import React from 'react';
import HeaderBox from '@/components/HeaderBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CookiePolicy = () => {

  return (
    <section className="flex w-full flex-col gap-8 p-6 max-w-4xl mx-auto">
      <HeaderBox
        title="Cookie Policy"
        subtext="How Nile Pay uses cookies and similar technologies"
      />

      <div className="space-y-6">
        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200">
              What Are Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Cookies are small text files that are stored on your device when you visit our website or use our app. 
              They help us provide you with a better, safer, and more personalized banking experience.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Last Updated:</strong> December 2024 | <strong>Applies to:</strong> Nile Pay Web and Mobile Applications
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>🍪</span>
              Types of Cookies We Use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                <span className="text-green-600">🔒</span>
                Essential Cookies (Required)
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                These cookies are necessary for the website to function and cannot be switched off.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm space-y-1">
                <li>Authentication and login session management</li>
                <li>Security and fraud prevention</li>
                <li>Transaction processing and validation</li>
                <li>Load balancing and system performance</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                <span className="text-blue-600">⚙️</span>
                Functional Cookies (Optional)
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                These cookies enable enhanced functionality and personalization.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm space-y-1">
                <li>Language preferences (Amharic, English, etc.)</li>
                <li>Theme settings (light/dark mode)</li>
                <li>Dashboard layout preferences</li>
                <li>Notification settings</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                <span className="text-purple-600">📊</span>
                Analytics Cookies (Optional)
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                These cookies help us understand how you use our services to improve them.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm space-y-1">
                <li>Page views and user journey tracking</li>
                <li>Feature usage statistics</li>
                <li>Performance monitoring</li>
                <li>Error tracking and debugging</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                <span className="text-orange-600">🔐</span>
                Security Cookies (Required)
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                These cookies protect your account and detect suspicious activity.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm space-y-1">
                <li>Device fingerprinting for fraud detection</li>
                <li>Login attempt monitoring</li>
                <li>Suspicious activity detection</li>
                <li>Two-factor authentication support</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Duration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>⏰</span>
              Cookie Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Session Cookies</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Temporary cookies that are deleted when you close your browser or app. 
                  Used for login sessions and transaction security.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Persistent Cookies</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Stored on your device for a specific period (typically 30 days to 1 year). 
                  Used for preferences and analytics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>🤝</span>
              Third-Party Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We may use trusted third-party services that set their own cookies:
            </p>
            <div className="space-y-3">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h5 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Ethiopian Banks</h5>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  For secure transaction processing and account verification
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h5 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Security Providers</h5>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  For fraud detection and account protection services
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h5 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Analytics Services</h5>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  For service improvement and performance monitoring (anonymized data only)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>⚙️</span>
              Managing Your Cookie Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">In Nile Pay App</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm space-y-1">
                  <li>Go to Settings → Privacy → Cookie Preferences</li>
                  <li>Toggle optional cookies on/off</li>
                  <li>View detailed cookie information</li>
                  <li>Clear stored cookies (except essential ones)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">In Your Browser</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm space-y-1">
                  <li>Chrome: Settings → Privacy and Security → Cookies</li>
                  <li>Firefox: Settings → Privacy & Security → Cookies</li>
                  <li>Safari: Preferences → Privacy → Cookies</li>
                  <li>Edge: Settings → Cookies and Site Permissions</li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>Important:</strong> Disabling essential cookies may prevent you from using certain 
                features of Nile Pay, including logging in and making transactions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ethiopian Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>🇪🇹</span>
              Ethiopian Data Protection Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our cookie practices comply with:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Ethiopian Data Protection and Privacy Proclamation</li>
              <li>National Bank of Ethiopia regulations</li>
              <li>Ethiopian Telecommunications Agency guidelines</li>
              <li>International banking security standards</li>
            </ul>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>🔄</span>
              Policy Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We may update this Cookie Policy to reflect changes in our practices or for legal reasons. 
              We will notify you of significant changes through:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
              <li>In-app notifications</li>
              <li>Email notifications</li>
              <li>Website banner announcements</li>
              <li>SMS alerts for major changes</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>📞</span>
              Questions About Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Contact our Privacy Team for cookie-related questions:
            </p>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p><strong>Email:</strong> privacy@nilepay.et</p>
              <p><strong>Phone:</strong> +251-11-XXX-XXXX</p>
              <p><strong>Live Chat:</strong> Available in the app</p>
              <p><strong>Response Time:</strong> Within 24 hours</p>
            </div>
          </CardContent>
        </Card>

        {/* Ethiopian Flag Footer */}
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🇪🇹</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nile Pay - Secure Ethiopian Digital Banking
          </p>
        </div>
      </div>
    </section>
  );
};

export default CookiePolicy;
