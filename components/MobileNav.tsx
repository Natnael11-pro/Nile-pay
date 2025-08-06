'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Footer from "./Footer"
import ThemeToggle from "./ThemeToggle"

const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname();

  return (
    <section className="w-fulll max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white/95 dark:bg-gray-800/95 backdrop-blur-md overflow-y-auto shadow-2xl">
          <Link href="/" className="cursor-pointer flex items-center gap-2 px-4 py-2">
            <Image
              src="/icons/nile-pay-logo.svg"
              width={34}
              height={34}
              alt="Nile Pay logo"
              className="flex-shrink-0"
            />
            <div>
              <h1 className="text-xl font-bold eth-gradient-text">Nile Pay</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">🇪🇹 Ethiopian Banking</p>
            </div>
          </Link>
          <div className="mobilenav-sheet">
              <nav className="flex h-full flex-col gap-4 pt-8 text-white dark:text-gray-100">
                  {sidebarLinks.map((item) => {
                const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)

                return (
                  <SheetClose asChild key={item.route}>
                    <Link href={item.route}
                      className={cn('mobilenav-sheet_close w-full', { 'bg-bank-gradient': isActive })}
                    >
                        <Image
                          src={item.imgURL}
                          alt={item.label}
                          width={20}
                          height={20}
                          className={cn({
                            'brightness-[3] invert-0': isActive
                          })}
                        />
                      <p className={cn("text-16 font-semibold text-black-2 dark:text-gray-300", { "text-white": isActive })}>
                        {item.label}
                      </p>
                    </Link>
                  </SheetClose>
                )
              })}

              </nav>

              {/* Additional Links */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <nav className="flex flex-col gap-2">
                  <SheetClose asChild>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg">👤</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Profile Settings</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/security"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg">🔒</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Security Settings</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/statements"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg">📄</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Account Statements</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/notifications"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg">🔔</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Notifications</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/help"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg">❓</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Help & Support</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/contact"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg">📞</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Contact Us</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/about"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg">ℹ️</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">About Nile Pay</span>
                    </Link>
                  </SheetClose>
                </nav>

                {/* Legal Links */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 px-3">Legal & Compliance</div>
                  <nav className="flex flex-col gap-1">
                    <SheetClose asChild>
                      <Link
                        href="/privacy-policy"
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-sm">🔒</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Privacy Policy</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/terms-of-service"
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-sm">📋</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Terms of Service</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/cookie-policy"
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-sm">🍪</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Cookie Policy</span>
                      </Link>
                    </SheetClose>
                  </nav>
                </div>
              </div>

            <div className="mt-auto pt-4 px-4 border-t border-gray-200 dark:border-gray-700">
              <Footer user={user} type="mobile" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav