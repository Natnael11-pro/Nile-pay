import React from 'react';
import HeaderBox from '@/components/HeaderBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {

  return (
    <section className="flex w-full flex-col gap-8 p-6 max-w-4xl mx-auto">
      <HeaderBox
        title="Privacy Policy"
        subtext="How Nile Pay protects and handles your personal information"
      />

      <div className="space-y-6">
        {/* Last Updated */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200">
              Last Updated: December 2024
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              This Privacy Policy explains how Nile Pay ("we," "our," or "us") collects, uses, 
              and protects your personal information when you use our Ethiopian digital banking services.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>📋</span>
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Personal Information</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                <li>Full name and Ethiopian National ID (FAN number)</li>
                <li>Phone number and email address</li>
                <li>Residential address and region</li>
                <li>Date of birth and nationality</li>
                <li>Employment information</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Financial Information</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                <li>Bank account details and transaction history</li>
                <li>Payment preferences and methods</li>
                <li>Credit and debit information</li>
                <li>Transaction patterns and behavior</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Technical Information</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                <li>Device information and IP address</li>
                <li>Browser type and operating system</li>
                <li>App usage patterns and preferences</li>
                <li>Location data (with your consent)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>🎯</span>
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Process payments and financial transactions</li>
              <li>Verify your identity and prevent fraud</li>
              <li>Comply with Ethiopian banking regulations</li>
              <li>Provide customer support and assistance</li>
              <li>Improve our services and user experience</li>
              <li>Send important account notifications</li>
              <li>Conduct risk assessment and management</li>
            </ul>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>🤝</span>
              Information Sharing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li><strong>Ethiopian Banks:</strong> To process transactions and verify accounts</li>
              <li><strong>Regulatory Authorities:</strong> National Bank of Ethiopia and other regulators</li>
              <li><strong>Service Providers:</strong> Trusted partners who help operate our services</li>
              <li><strong>Legal Requirements:</strong> When required by Ethiopian law or court orders</li>
            </ul>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Note:</strong> We never sell your personal information to third parties for marketing purposes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>🔒</span>
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Bank-grade encryption for all data transmission</li>
              <li>Secure servers with 24/7 monitoring</li>
              <li>Multi-factor authentication protection</li>
              <li>Regular security audits and updates</li>
              <li>Compliance with Ethiopian data protection standards</li>
              <li>Limited access to authorized personnel only</li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>⚖️</span>
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Under Ethiopian law, you have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Withdraw consent for certain data processing</li>
              <li>File complaints with regulatory authorities</li>
              <li>Receive information in Amharic or other Ethiopian languages</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>📞</span>
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              For privacy-related questions or concerns, contact us:
            </p>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p><strong>Email:</strong> privacy@nilepay.et</p>
              <p><strong>Phone:</strong> +251-11-XXX-XXXX</p>
              <p><strong>Address:</strong> Nile Pay Privacy Office, Addis Ababa, Ethiopia</p>
              <p><strong>Response Time:</strong> Within 30 days as required by Ethiopian law</p>
            </div>
          </CardContent>
        </Card>

        {/* Ethiopian Flag Footer */}
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🇪🇹</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nile Pay - Ethiopian Digital Banking Platform
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
