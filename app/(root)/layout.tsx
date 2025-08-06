import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import UserDropdown from "@/components/UserDropdown";
// import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccounts } from "@/lib/actions/bank.actions";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser();

  if(!loggedIn) redirect('/sign-in')

  const accounts = await getAccounts(loggedIn.id);

  return (
    // <ThemeProvider>
      <div className="dashboard-layout" suppressHydrationWarning>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen w-full bg-gray-50">
        {/* Fixed Left Sidebar */}
        <div className="sidebar-container">
          <Sidebar user={loggedIn} />
        </div>

        {/* Main Content Area */}
        <div className="main-content-area">
          {/* Fixed Header */}
          <div className="desktop-header">
            <div className="flex items-center gap-3">
              <Image src="/icons/nile-pay-logo.svg" width={32} height={32} alt="Nile Pay logo" />
              <h1 className="text-lg font-bold eth-gradient-text">Nile Pay</h1>
            </div>
            <div className="flex items-center gap-3">
              {/* <ThemeToggle /> */}
              <UserDropdown
                user={loggedIn}
                banks={accounts?.slice(0, 2) || []}
              />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="desktop-content">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="mobile-header flex-shrink-0">
          <div className="flex items-center gap-2">
            <Image src="/icons/nile-pay-logo.svg" width={28} height={28} alt="Nile Pay logo" />
            <div>
              <h1 className="text-base font-bold eth-gradient-text">Nile Pay</h1>
              <span className="text-xs text-gray-500 dark:text-gray-400">Ethiopian Banking</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <ThemeToggle /> */}
            <UserDropdown
              user={loggedIn}
              banks={accounts?.slice(0, 2) || []}
            />
            <MobileNav user={loggedIn} />
          </div>
        </div>

        {/* Mobile Content */}
        <div className="mobile-content flex-1">
          {children}
        </div>
      </div>
    </div>
    // </ThemeProvider>
  );
}
