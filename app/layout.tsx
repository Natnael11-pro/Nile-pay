export const dynamic = 'force-dynamic'

import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif'
})

export const metadata: Metadata = {
  title: {
    default: "Nile Pay - Ethiopian Digital Banking Platform",
    template: "%s | Nile Pay"
  },
  description: "Ethiopia's premier digital payment gateway connecting all major Ethiopian banks. Secure money transfers, bill payments, mobile money, and QR code payments. Licensed by the National Bank of Ethiopia.",
  keywords: [
    "Ethiopian banking",
    "digital payments Ethiopia",
    "money transfer Ethiopia",
    "Ethiopian banks",
    "Nile Pay",
    "Ethiopian fintech",
    "mobile money Ethiopia",
    "QR payments Ethiopia",
    "bill payments Ethiopia",
    "Ethiopian payment gateway",
    "Addis Ababa banking",
    "Ethiopian birr",
    "NBE licensed",
    "Commercial Bank Ethiopia",
    "Dashen Bank",
    "Bank of Abyssinia",
    "Awash Bank"
  ],
  authors: [{ name: "Nile Pay Team" }],
  creator: "Nile Pay",
  publisher: "Nile Pay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nilepay.et'),
  alternates: {
    canonical: '/',
    languages: {
      'en-ET': '/en',
      'am-ET': '/am',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_ET',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://nilepay.et',
    siteName: 'Nile Pay',
    title: 'Nile Pay - Ethiopian Digital Banking Platform',
    description: 'Ethiopia\'s premier digital payment gateway connecting all major Ethiopian banks. Secure, fast, and reliable financial services.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nile Pay - Ethiopian Digital Banking Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nile Pay - Ethiopian Digital Banking Platform',
    description: 'Ethiopia\'s premier digital payment gateway. Secure banking for all Ethiopians.',
    images: ['/twitter-image.png'],
    creator: '@nilepay',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/nile-pay-logo.svg' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#16a34a' },
    ],
  },
  manifest: '/manifest.json',
  category: 'finance',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'theme-color': '#16a34a',
    'msapplication-TileColor': '#16a34a',
    'application-name': 'Nile Pay',
    'apple-mobile-web-app-title': 'Nile Pay',
    'geo.region': 'ET',
    'geo.country': 'Ethiopia',
    'geo.placename': 'Addis Ababa',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${ibmPlexSerif.variable} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
