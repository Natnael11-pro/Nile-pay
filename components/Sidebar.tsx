'use client'

import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Footer from './Footer'
import EthiopianBankLink from './EthiopianBankLink'

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();

  return (
    <section className="sidebar">
      <div className="sidebar-nav">
        <Link href="/" className="mb-8 cursor-pointer flex items-center gap-3 group">
          <div className="relative">
            <Image
              src="/icons/nile-pay-logo.svg"
              width={36}
              height={36}
              alt="Nile Pay logo"
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-yellow-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold eth-gradient-text">Nile Pay</h1>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Ethiopian Banking</span>
          </div>
        </Link>

        <nav className="flex flex-col gap-2">

          {sidebarLinks.map((item) => {
            const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)

            return (
              <Link href={item.route} key={item.label}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative',
                  {
                    'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg': isActive,
                    'hover:bg-green-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400': !isActive
                  }
                )}
              >
                <div className="relative size-5">
                  <Image
                    src={item.imgURL}
                    alt={item.label}
                    fill
                    className={cn(
                      'transition-all duration-300',
                      {
                        'brightness-0 invert': isActive,
                        'opacity-60 group-hover:opacity-100 group-hover:scale-110': !isActive
                      }
                    )}
                  />
                </div>
                <p className={cn(
                  "text-sm font-semibold transition-all duration-300",
                  {
                    "text-white": isActive,
                    "group-hover:text-green-700 dark:group-hover:text-green-400": !isActive
                  }
                )}>
                  {item.label}
                </p>
                {isActive && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-yellow-400 rounded-l-full"></div>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 p-3 bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 rounded-xl border border-green-100 dark:border-green-800">
          <div className="text-center mb-3">
            <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Connect your bank</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Add bank account</p>
          </div>
          <div className="w-full">
            <EthiopianBankLink user={user} />
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <Footer user={user} />
      </div>
    </section>
  )
}

export default Sidebar