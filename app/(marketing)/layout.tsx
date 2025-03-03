import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MarketingHeader } from '@/components/layout/MarketingHeader';

const marketingLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold">Dishyy</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Making food parties simple and delightful.
              </p>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/features"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
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
                    href="/blog"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
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
