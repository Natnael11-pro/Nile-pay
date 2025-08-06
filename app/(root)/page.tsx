import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import MobileLayout from '@/components/MobileLayout';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { getTransactionsByUserId } from '@/lib/actions/transaction.actions';
import { redirect } from 'next/navigation';

const Home = async ({ searchParams }: SearchParamProps) => {
  const { id, page } = await searchParams;
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    redirect('/sign-in');
  }

  const accounts = await getAccounts(loggedIn.id);
  const selectedAccountId = (id as string) || accounts[0]?.id;
  const account = selectedAccountId ? await getAccount(selectedAccountId) : null;

  // Fetch recent transactions for the user
  const transactions = await getTransactionsByUserId({ userId: loggedIn.$id || loggedIn.id });

  return (
    <>
      {/* Desktop Layout */}
      <section className="home hidden lg:block">
        <div className="home-content">
          <header className="home-header">
            <HeaderBox
              type="greeting"
              title="Welcome"
              user={loggedIn?.firstName || 'Guest'}
              subtext="Access and manage your account and transactions efficiently."
            />

            <TotalBalanceBox
              accounts={accounts}
              totalBanks={accounts.length}
              totalCurrentBalance={accounts.reduce((total, acc) => total + acc.balance, 0)}
            />
          </header>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <a href="/payment-gateway" className="bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🚀</span>
                <h3 className="font-semibold text-base">Send Money</h3>
                <p className="text-xs text-green-100 mt-1">Instant Transfer</p>
              </div>
            </a>

            <a href="/payment-gateway?tab=bills" className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">💳</span>
                <h3 className="font-semibold text-base">Pay Bills</h3>
                <p className="text-xs text-blue-100 mt-1">All Providers</p>
              </div>
            </a>

            <a href="/payment-gateway?tab=mobile" className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📱</span>
                <h3 className="font-semibold text-base">Mobile Money</h3>
                <p className="text-xs text-purple-100 mt-1">5+ Providers</p>
              </div>
            </a>

            <a href="/payment-gateway?tab=qr" className="bg-gradient-to-br from-orange-600 to-yellow-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📱</span>
                <h3 className="font-semibold text-base">QR Payment</h3>
                <p className="text-xs text-orange-100 mt-1">Scan & Pay</p>
              </div>
            </a>
          </div>

          <RecentTransactions
            accounts={accounts}
            transactions={transactions}
            appwriteItemId={selectedAccountId}
            page={currentPage}
          />
        </div>

      </section>

      {/* Mobile Layout */}
      <section className="home lg:hidden">
        <div className="home-content px-4 py-6 space-y-6">
          <header className="home-header">
            <HeaderBox
              type="greeting"
              title="Welcome"
              user={loggedIn?.firstName || 'Guest'}
              subtext="Access and manage your account and transactions efficiently."
            />

            <TotalBalanceBox
              accounts={accounts}
              totalBanks={accounts.length}
              totalCurrentBalance={accounts.reduce((total, acc) => total + acc.balance, 0)}
            />
          </header>

          {/* Quick Actions - Mobile Grid */}
          <div className="grid grid-cols-2 gap-3">
            <a href="/payment-gateway" className="bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🚀</span>
                <h3 className="font-semibold text-sm">Send Money</h3>
                <p className="text-xs text-green-100 mt-1">Instant Transfer</p>
              </div>
            </a>

            <a href="/payment-gateway?tab=bills" className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">💳</span>
                <h3 className="font-semibold text-sm">Pay Bills</h3>
                <p className="text-xs text-blue-100 mt-1">All Providers</p>
              </div>
            </a>

            <a href="/payment-gateway?tab=mobile" className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">📱</span>
                <h3 className="font-semibold text-sm">Mobile Money</h3>
                <p className="text-xs text-purple-100 mt-1">5+ Providers</p>
              </div>
            </a>

            <a href="/payment-gateway?tab=qr" className="bg-gradient-to-br from-orange-600 to-yellow-600 text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">📱</span>
                <h3 className="font-semibold text-sm">QR Payment</h3>
                <p className="text-xs text-orange-100 mt-1">Scan & Pay</p>
              </div>
            </a>
          </div>

          <RecentTransactions
            accounts={accounts}
            transactions={transactions}
            appwriteItemId={selectedAccountId}
            page={currentPage}
          />
        </div>
      </section>
    </>
  )
}

export default Home