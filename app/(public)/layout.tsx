import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "../globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif'
})

export const metadata: Metadata = {
  title: "Nile Pay - Ethiopian Digital Banking Platform",
  description: "Ethiopia's premier digital payment gateway connecting all major Ethiopian banks.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          {/* Public Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link href="/" className="flex items-center gap-3">
                  <div className="text-2xl">🇪🇹</div>
                  <div>
                    <h1 className="text-xl font-bold text-green-600">Nile Pay</h1>
                    <p className="text-xs text-gray-500">Ethiopian Banking</p>
                  </div>
                </Link>
                
                <nav className="hidden md:flex items-center gap-6">
                  <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="text-gray-600 hover:text-green-600 transition-colors">
                    Contact
                  </Link>
                  <Link href="/sign-in" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/sign-up" className="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
                    Sign Up
                  </Link>
                </nav>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <Link href="/sign-in" className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Public Footer */}
          <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🇪🇹</span>
                    <span className="font-bold text-green-600">Nile Pay</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ethiopia's premier digital payment gateway connecting all major Ethiopian banks.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Company</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/about" className="text-gray-600 hover:text-green-600">About Us</Link></li>
                    <li><Link href="/contact" className="text-gray-600 hover:text-green-600">Contact</Link></li>
                    <li><Link href="/help" className="text-gray-600 hover:text-green-600">Help Center</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Legal</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/privacy-policy" className="text-gray-600 hover:text-green-600">Privacy Policy</Link></li>
                    <li><Link href="/terms-of-service" className="text-gray-600 hover:text-green-600">Terms of Service</Link></li>
                    <li><Link href="/cookie-policy" className="text-gray-600 hover:text-green-600">Cookie Policy</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Get Started</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/sign-up" className="text-gray-600 hover:text-green-600">Create Account</Link></li>
                    <li><Link href="/sign-in" className="text-gray-600 hover:text-green-600">Sign In</Link></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} Nile Pay. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
