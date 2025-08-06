import React from 'react';
import HeaderBox from '@/components/HeaderBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService = () => {

  return (
    <section className="flex w-full flex-col gap-8 p-6 max-w-4xl mx-auto">
      <HeaderBox
        title="Terms of Service"
        subtext="Terms and conditions for using Nile Pay services"
      />

      <div className="space-y-6">
        {/* Agreement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200">
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              By accessing and using Nile Pay services, you agree to be bound by these Terms of Service 
              and all applicable Ethiopian laws and regulations. If you do not agree with any of these terms, 
              you are prohibited from using our services.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-4">
              <p className="text-green-800 dark:text-green-200 text-sm">
                <strong>Effective Date:</strong> December 2024 | <strong>Governing Law:</strong> Federal Democratic Republic of Ethiopia
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>🏦</span>
              Service Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Nile Pay provides digital banking and payment services in Ethiopia, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Ethiopian bank account integration and management</li>
              <li>Money transfers between Ethiopian banks</li>
              <li>Bill payment services for utilities and telecommunications</li>
              <li>Mobile money transfers (M-Birr, HelloCash, etc.)</li>
              <li>QR code payment processing</li>
              <li>Transaction history and account management</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>👤</span>
              User Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Account Security</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Maintain confidentiality of login credentials</li>
                  <li>Use strong passwords and enable two-factor authentication</li>
                  <li>Immediately report unauthorized access or suspicious activity</li>
                  <li>Log out from shared or public devices</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Accurate Information</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Provide accurate and current personal information</li>
                  <li>Update information promptly when changes occur</li>
                  <li>Ensure Ethiopian National ID (FAN) number is valid</li>
                  <li>Verify bank account details before transactions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Lawful Use</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Use services only for lawful purposes</li>
                  <li>Comply with all Ethiopian banking regulations</li>
                  <li>Not engage in fraudulent or illegal activities</li>
                  <li>Respect intellectual property rights</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>💳</span>
              Transaction Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Transaction Limits</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Daily limits as set by your bank and Ethiopian regulations</li>
                  <li>Individual accounts: Up to 50,000 ETB per day</li>
                  <li>Business accounts: Up to 500,000 ETB per day</li>
                  <li>Limits may vary based on verification level</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Fees and Charges</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Transaction fees as disclosed before each transaction</li>
                  <li>Bank charges may apply for certain services</li>
                  <li>Currency conversion fees for foreign transactions</li>
                  <li>No hidden fees - all charges clearly displayed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Processing Times</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Same-bank transfers: Usually instant</li>
                  <li>Cross-bank transfers: 1-2 hours during business hours</li>
                  <li>Bill payments: Instant to 24 hours</li>
                  <li>Mobile money: Usually instant</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prohibited Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>🚫</span>
              Prohibited Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The following activities are strictly prohibited:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Money laundering or terrorist financing</li>
              <li>Fraudulent transactions or identity theft</li>
              <li>Unauthorized access to other users' accounts</li>
              <li>Circumventing security measures or system limitations</li>
              <li>Using the service for illegal gambling or activities</li>
              <li>Violating Ethiopian banking or financial regulations</li>
              <li>Attempting to reverse engineer or hack the platform</li>
            </ul>
          </CardContent>
        </Card>

        {/* Liability and Disclaimers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>⚖️</span>
              Liability and Disclaimers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Service Availability</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  While we strive for 99.9% uptime, services may be temporarily unavailable due to 
                  maintenance, technical issues, or circumstances beyond our control.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Third-Party Services</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We are not responsible for the availability or performance of third-party services 
                  such as banks, mobile money providers, or utility companies.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">User Error</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Users are responsible for verifying transaction details. We are not liable for 
                  losses due to user error, such as incorrect recipient information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>🔚</span>
              Account Termination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We may suspend or terminate your account if:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>You violate these Terms of Service</li>
              <li>You engage in fraudulent or illegal activities</li>
              <li>Your account remains inactive for extended periods</li>
              <li>Required by Ethiopian law or regulatory authorities</li>
            </ul>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>Notice:</strong> We will provide 30 days notice before termination unless 
                immediate action is required for security or legal reasons.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>📞</span>
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              For questions about these Terms of Service:
            </p>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p><strong>Email:</strong> legal@nilepay.et</p>
              <p><strong>Phone:</strong> +251-11-XXX-XXXX</p>
              <p><strong>Address:</strong> Nile Pay Legal Department, Addis Ababa, Ethiopia</p>
            </div>
          </CardContent>
        </Card>

        {/* Ethiopian Flag Footer */}
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🇪🇹</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nile Pay - Regulated by the National Bank of Ethiopia
          </p>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;
