import Link from 'next/link';
import React from 'react';

// Define footer links
type FooterLink = {
  href: string;
  label: string;
};

const legalLinks: FooterLink[] = [
  {
    href: '/privacy-policy',
    label: 'Privacy Policy',
  },
  {
    href: '/terms-of-use',
    label: 'Terms of Use',
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="py-8 bg-background border-t border-border/40"
      role="contentinfo"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright Info */}
          <section className="order-2 sm:order-1">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              <small>© {currentYear} Dishyy. All rights reserved.</small>
            </p>
          </section>

          {/* Legal Links */}
          <nav className="order-1 sm:order-2" aria-label="Legal links">
            <ul className="flex items-center gap-6">
              {legalLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
