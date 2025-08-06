import React from 'react';
import HeaderBox from '@/components/HeaderBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Help = () => {
  const faqs = [
    {
      question: "How do I connect my Ethiopian bank account?",
      answer: "To connect your Ethiopian bank account, go to 'My Banks' section and click 'Add Bank Account'. You'll need your account number, bank name, and account type. We support all major Ethiopian banks including CBE, Dashen Bank, Bank of Abyssinia, and more."
    },
    {
      question: "What payment methods are supported?",
      answer: "Nile Pay supports four main payment methods: Ethiopian Money Transfer (bank-to-bank), Bill Payments (utilities, telecom), Mobile Money Transfer (M-Birr, HelloCash, etc.), and QR Code Payments for instant transactions."
    },
    {
      question: "How secure are my transactions?",
      answer: "All transactions are encrypted using bank-grade security. We use multi-factor authentication, secure SSL connections, and comply with Ethiopian banking regulations. Your financial data is never stored in plain text."
    },
    {
      question: "What are the transaction limits?",
      answer: "Daily transaction limits vary by bank and account type. Typically: Individual accounts: 50,000 ETB/day, Business accounts: 500,000 ETB/day. Contact your bank for specific limits."
    },
    {
      question: "How long do transfers take?",
      answer: "Local Ethiopian bank transfers are usually instant during business hours. Cross-bank transfers may take 1-2 hours. Mobile money transfers are typically instant."
    },
    {
      question: "What should I do if a transaction fails?",
      answer: "If a transaction fails, check your account balance and internet connection. The amount will be automatically refunded within 24 hours. Contact support if the issue persists."
    },
    {
      question: "How do I update my profile information?",
      answer: "Go to your Profile Settings to update personal information, phone number, region, and language preferences. Some changes may require verification."
    },
    {
      question: "Can I use Nile Pay outside Ethiopia?",
      answer: "Currently, Nile Pay is designed for Ethiopian banking and payments within Ethiopia. International transfers are not yet supported but may be added in future updates."
    }
  ];

  const supportChannels = [
    {
      title: "📞 Phone Support",
      description: "Call our Ethiopian support line",
      contact: "+251-11-XXX-XXXX",
      hours: "Mon-Fri: 8:00 AM - 6:00 PM EAT"
    },
    {
      title: "📧 Email Support", 
      description: "Send us an email for detailed help",
      contact: "support@nilepay.et",
      hours: "Response within 24 hours"
    },
    {
      title: "💬 Live Chat",
      description: "Chat with our support team",
      contact: "Available in app",
      hours: "Mon-Fri: 9:00 AM - 5:00 PM EAT"
    },
    {
      title: "🏢 Branch Locations",
      description: "Visit our offices in major cities",
      contact: "Addis Ababa, Dire Dawa, Mekelle",
      hours: "Mon-Fri: 8:30 AM - 5:30 PM EAT"
    }
  ];

  return (
    <section className="flex w-full flex-col gap-8 p-6 max-w-6xl mx-auto">
      <HeaderBox
        title="Help & Support"
        subtext="Get help with your Nile Pay account and Ethiopian banking services"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Help */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 border border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span>🚀</span>
                Quick Help
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/transaction-history">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">📊</span>
                  View Transaction History
                </Button>
              </Link>
              <Link href="/my-banks">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">🏦</span>
                  Manage Bank Accounts
                </Button>
              </Link>
              <Link href="/payment-gateway">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">💳</span>
                  Make a Payment
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">👤</span>
                  Update Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-300 flex items-center gap-2">
                <span>🚨</span>
                Emergency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 dark:text-red-400 text-sm mb-3">
                For urgent issues like unauthorized transactions or account security concerns:
              </p>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                <span className="mr-2">📞</span>
                Emergency Hotline
              </Button>
              <p className="text-xs text-red-500 dark:text-red-400 mt-2 text-center">
                Available 24/7
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span>❓</span>
                Frequently Asked Questions
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Find answers to common questions about Nile Pay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-gray-900 dark:text-gray-100">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Support */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>📞</span>
            Contact Support
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Multiple ways to get in touch with our Ethiopian support team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {channel.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {channel.description}
                </p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                  {channel.contact}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {channel.hours}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ethiopian Banking Info */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🇪🇹</span>
            Ethiopian Banking Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">🏦 Supported Banks</h4>
              <p className="text-sm opacity-90">
                All major Ethiopian banks including CBE, Dashen, BOA, Wegagen, United Bank, and more.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">💰 Currency</h4>
              <p className="text-sm opacity-90">
                All transactions in Ethiopian Birr (ETB). Real-time exchange rates for international references.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🔒 Compliance</h4>
              <p className="text-sm opacity-90">
                Fully compliant with National Bank of Ethiopia regulations and Ethiopian banking laws.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Help;
