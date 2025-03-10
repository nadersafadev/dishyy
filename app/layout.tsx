import type React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, Cairo } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';

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
  applicationName: 'Dishyy',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Dishyy',
    startupImage: [
      {
        url: '/splash-640x1136-light.png',
        media:
          '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/splash-828x1792-light.png',
        media:
          '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/splash-light.png',
        media:
          '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/splash-1290x2796-light.png',
        media:
          '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)',
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
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
        url: '/apple-touch-icon-180x180.png',
        sizes: '180x180',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  viewportFit: 'cover',
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
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta name="apple-mobile-web-app-title" content="Dishyy" />
          <meta name="application-name" content="Dishyy" />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (prefers-color-scheme: light)"
            href="/splash-1290x2796-light.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (prefers-color-scheme: dark)"
            href="/splash-1290x2796-dark.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (prefers-color-scheme: light)"
            href="/splash-light.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (prefers-color-scheme: dark)"
            href="/splash-dark.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: light)"
            href="/splash-828x1792-light.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: dark)"
            href="/splash-828x1792-dark.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: light)"
            href="/splash-640x1136-light.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: dark)"
            href="/splash-640x1136-dark.png"
          />
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <InstallPrompt />
            <ToastProvider />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

import './globals.css';
