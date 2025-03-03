import { MarketingFooter } from '@/components/layout/MarketingFooter';
import { MarketingHeader } from '@/components/layout/MarketingHeader';

interface MarketingLayoutProps {
  children: React.ReactNode;
  params: { segment: string[] };
}

export default function MarketingLayout({
  children,
  params,
}: MarketingLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <MarketingHeader />

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-16">{children}</main>

      <MarketingFooter />
    </div>
  );
}
