import { MarketingFooter } from '@/components/layout/MarketingFooter';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { Metadata } from 'next';

interface MarketingLayoutProps {
  children: React.ReactNode;
  params: { segment: string[] };
}

export const metadata: Metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#ffffff',
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
};

export default function MarketingLayout({
  children,
  params,
}: MarketingLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <MarketingHeader />

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-16 overflow-x-hidden">
        <div className="flex-1 w-full">{children}</div>
      </main>

      <MarketingFooter />
    </div>
  );
}
