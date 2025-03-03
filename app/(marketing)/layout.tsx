import Link from 'next/link';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { NewsletterForm } from '@/components/NewsletterForm';

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

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="mx-auto w-full max-w-screen-xl px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold">Dishyy</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Making food parties simple and delightful.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="space-y-4">
              <NewsletterForm />
            </div>
          </div>

          <div className="mt-16 pt-8 border-t">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Dishyy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
