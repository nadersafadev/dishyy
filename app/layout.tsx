import type React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/providers/ToastProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'Dishyy',
  description: 'Where Flavors Unite and Friendships Simmer',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/favicon.svg',
        href: '/favicon.svg',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/favicon.svg',
        href: '/favicon.svg',
      },
    ],
    apple: [
      {
        url: '/favicon.svg',
        href: '/favicon.svg',
      },
    ],
    shortcut: '/favicon.svg',
  },
  manifest: '/manifest.json',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dishyy.com',
    siteName: 'Dishyy',
    images: [
      {
        url: '/logo-black.png',
        width: 800,
        height: 600,
        alt: 'Dishyy Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dishyy',
    description: 'Where Flavors Unite and Friendships Simmer',
    images: ['/logo-black.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${cairo.variable}`}>
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ToastProvider />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

import './globals.css';
