'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const marketingLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Only add scroll listener for home page
    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial scroll position
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isHomePage]);

  // Only transparent on home page and when not scrolled
  const isTransparent = isHomePage && !scrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isTransparent ? 'pt-4' : ''
      }`}
    >
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          isTransparent
            ? 'bg-gradient-to-b from-black/50 via-black/25 to-transparent backdrop-blur-[2px] supports-[backdrop-filter]:backdrop-blur-[6px]'
            : 'bg-white border-b shadow-sm'
        }`}
      />
      <div className="relative mx-auto w-full max-w-screen-xl px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isTransparent ? 'h-20' : 'h-16'
          }`}
        >
          <Link href="/" className="flex items-center space-x-2">
            <span
              className={`text-xl font-bold transition-colors duration-300 ${
                isTransparent ? 'text-white' : 'text-foreground'
              }`}
            >
              Dishyy
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {marketingLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isTransparent
                    ? 'text-white/70 hover:text-white'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button
                variant={isTransparent ? 'outline' : 'ghost'}
                size="sm"
                className={
                  isTransparent
                    ? 'border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30'
                    : ''
                }
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="sm"
                className={
                  isTransparent ? 'bg-white text-black hover:bg-white/90' : ''
                }
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
