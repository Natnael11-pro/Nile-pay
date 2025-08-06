import React from 'react';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { getAccounts } from '@/lib/actions/bank.actions';
import { redirect } from 'next/navigation';
import HeaderBox from '@/components/HeaderBox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EthiopianMoneyTransfer from '@/components/EthiopianMoneyTransfer';
import EthiopianBillPayment from '@/components/EthiopianBillPayment';
import EthiopianMobileMoneyTransfer from '@/components/EthiopianMobileMoneyTransfer';
import QRPayment from '@/components/EthiopianQRPayment';
import UserToUserTransfer from '@/components/UserToUserTransfer';
import MobileLayout from '@/components/MobileLayout';


const PaymentGatewayPage = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) redirect('/sign-in');

  const accounts = await getAccounts(loggedIn.$id);

  return (
    <>
      {/* Desktop Layout */}
      <section className="payment-gateway hidden lg:block">
        <div className="payment-gateway-content">
        {/* Header Section */}
        <div className="mb-8">
          <HeaderBox
            title="Payment Gateway"
            subtext="Send money, pay bills, and manage your Ethiopian payments all in one place"
            user=""
            type="title"
          />
        </div>

        {/* Payment Gateway Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow-lg cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2">Money Transfers</h3>
                <p className="text-2xl sm:text-3xl font-bold">🚀</p>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-xs sm:text-sm">Instant</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">24/7</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2">Bill Payments</h3>
                <p className="text-2xl sm:text-3xl font-bold">💳</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-xs sm:text-sm">All Providers</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">8+</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2">Mobile Money</h3>
                <p className="text-2xl sm:text-3xl font-bold">📱</p>
              </div>
              <div className="text-right">
                <p className="text-purple-100 text-xs sm:text-sm">Available</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">5+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Services Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-6 sm:mb-8 overflow-hidden">
          <Tabs defaultValue="transfer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 p-1 sm:p-2 rounded-none border-b border-gray-100 dark:border-gray-700">
              <TabsTrigger
                value="user-transfer"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg lg:rounded-xl transition-all duration-300 py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2">
                  <span className="text-lg sm:text-xl">👥</span>
                  <span className="text-xs sm:text-sm lg:text-sm whitespace-nowrap">Send to User</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="transfer"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg lg:rounded-xl transition-all duration-300 py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2">
                  <span className="text-lg sm:text-xl">🚀</span>
                  <span className="text-xs sm:text-sm lg:text-sm whitespace-nowrap">Bank Transfer</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="bills"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg lg:rounded-xl transition-all duration-300 py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2">
                  <span className="text-lg sm:text-xl">💳</span>
                  <span className="text-xs sm:text-sm lg:text-sm whitespace-nowrap">Bill Payment</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="mobile"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg lg:rounded-xl transition-all duration-300 py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2">
                  <span className="text-lg sm:text-xl">📱</span>
                  <span className="text-xs sm:text-sm lg:text-sm whitespace-nowrap">Mobile Money</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="qr"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg lg:rounded-xl transition-all duration-300 py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2">
                  <span className="text-lg sm:text-xl">📱</span>
                  <span className="text-xs sm:text-sm lg:text-sm whitespace-nowrap">QR Payment</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content with proper spacing and visibility */}
            <div className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-[500px] sm:min-h-[600px]">
              <TabsContent value="user-transfer" className="mt-0 space-y-0">
                <div className="w-full">
                  <UserToUserTransfer
                    user={loggedIn}
                    accounts={accounts || []}
                  />
                </div>
              </TabsContent>

              <TabsContent value="transfer" className="mt-0 space-y-0">
                <div className="w-full">
                  <EthiopianMoneyTransfer
                    user={loggedIn}
                    accounts={accounts || []}
                  />
                </div>
              </TabsContent>

              <TabsContent value="bills" className="mt-0 space-y-0">
                <div className="w-full">
                  <EthiopianBillPayment
                    user={loggedIn}
                    accounts={accounts || []}
                  />
                </div>
              </TabsContent>

              <TabsContent value="mobile" className="mt-0 space-y-0">
                <div className="w-full">
                  <EthiopianMobileMoneyTransfer
                    user={loggedIn}
                    accounts={accounts || []}
                  />
                </div>
              </TabsContent>

              <TabsContent value="qr" className="mt-0 space-y-0">
                <div className="w-full">
                  <QRPayment
                    user={loggedIn}
                    accounts={accounts || []}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Ethiopian Banking Network Info */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🇪🇹</span>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Ethiopian Banking Network</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Nile Pay is connected to all major Ethiopian banks and financial institutions, 
                providing you with comprehensive payment solutions across the country.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-1">🏦</div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">15+ Banks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Instant Transfer</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🔒</div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bank Security</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">📱</div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">24/7 Service</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Mobile Layout */}
    <div className="lg:hidden">
      <MobileLayout
        title="Payment Gateway"
        subtitle="Ethiopian payment services at your fingertips"
      >
        {/* Mobile Quick Stats */}
        <div className="mobile-grid">
          <div className="mobile-card bg-gradient-to-br from-green-600 to-emerald-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold mb-1">Money Transfers</h3>
                <p className="text-2xl font-bold">🚀</p>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-xs">Instant</p>
                <p className="text-lg font-bold">24/7</p>
              </div>
            </div>
          </div>

          <div className="mobile-card bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold mb-1">Bill Payments</h3>
                <p className="text-2xl font-bold">💳</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-xs">All Providers</p>
                <p className="text-lg font-bold">8+</p>
              </div>
            </div>
          </div>

          <div className="mobile-card bg-gradient-to-br from-purple-600 to-pink-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold mb-1">Mobile Money</h3>
                <p className="text-2xl font-bold">📱</p>
              </div>
              <div className="text-right">
                <p className="text-purple-100 text-xs">Available</p>
                <p className="text-lg font-bold">5+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Payment Forms */}
        <div className="mobile-card">
          <Tabs defaultValue="user-transfer" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-4">
              <TabsTrigger value="user-transfer" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md text-xs text-gray-700 dark:text-gray-300">
                <span>👥 User</span>
              </TabsTrigger>
              <TabsTrigger value="transfer" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md text-xs text-gray-700 dark:text-gray-300">
                <span>🚀 Bank</span>
              </TabsTrigger>
              <TabsTrigger value="bills" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md text-xs text-gray-700 dark:text-gray-300">
                <span>💳 Bills</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md text-xs text-gray-700 dark:text-gray-300">
                <span>📱 Mobile</span>
              </TabsTrigger>
              <TabsTrigger value="qr" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-md text-xs text-gray-700 dark:text-gray-300">
                <span>📱 QR</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user-transfer" className="mt-0">
              <UserToUserTransfer
                user={loggedIn}
                accounts={accounts || []}
              />
            </TabsContent>

            <TabsContent value="transfer" className="mt-0">
              <EthiopianMoneyTransfer
                user={loggedIn}
                accounts={accounts || []}
              />
            </TabsContent>

            <TabsContent value="bills" className="mt-0">
              <EthiopianBillPayment
                user={loggedIn}
                accounts={accounts || []}
              />
            </TabsContent>

            <TabsContent value="mobile" className="mt-0">
              <EthiopianMobileMoneyTransfer
                user={loggedIn}
                accounts={accounts || []}
              />
            </TabsContent>

            <TabsContent value="qr" className="mt-0">
              <QRPayment
                user={loggedIn}
                accounts={accounts || []}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Ethiopian Banking Info */}
        <div className="mobile-card bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🇪🇹</span>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Ethiopian Banking Network</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                Connected to all major Ethiopian banks for comprehensive payment solutions.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-xl mb-1">🏦</div>
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">15+ Banks</div>
                </div>
                <div className="text-center">
                  <div className="text-xl mb-1">⚡</div>
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">Instant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MobileLayout>
    </div>
  </>
  );
};

export default PaymentGatewayPage;
