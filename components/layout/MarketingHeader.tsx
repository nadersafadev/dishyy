'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useAuth, useClerk } from '@clerk/nextjs';

const marketingLinks = [
  { href: '/', label: 'Home' },
  { href: '/ramadan', label: 'Ramadan' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    },
    [mobileMenuOpen]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setScrolled(true);
    }
  }, [isHomePage]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isTransparent = isHomePage && !scrolled;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent ? 'pt-4' : 'border-b'
      }`}
    >
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          isTransparent
            ? 'bg-gradient-to-b from-black/50 via-black/25 to-transparent backdrop-blur-[2px] supports-[backdrop-filter]:backdrop-blur-[6px]'
            : 'bg-background/80 backdrop-blur-sm'
        }`}
      />

      <div className="relative mx-auto w-full max-w-screen-xl px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isTransparent ? 'h-20' : 'h-16'
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center space-x-3"
            aria-label="Go to homepage"
          >
            <div className="transition-transform duration-200 group-hover:scale-110">
              <Image
                src="/favicon.svg"
                alt="Dishyy Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <span
              className={`text-xl font-bold transition-colors duration-300 ${
                isTransparent ? 'text-white' : 'text-foreground'
              }`}
            >
              Dishyy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center justify-center flex-1 px-8"
            aria-label="Main navigation"
          >
            {marketingLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                  isTransparent
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : pathname === link.href
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons and Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              {isSignedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button
                      variant={isTransparent ? 'outline' : 'ghost'}
                      size="sm"
                      className={`gap-2 ${
                        isTransparent
                          ? 'border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30'
                          : ''
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant={isTransparent ? 'outline' : 'ghost'}
                    size="sm"
                    onClick={handleSignOut}
                    className={`gap-2 text-destructive hover:text-destructive ${
                      isTransparent
                        ? 'border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30'
                        : ''
                    }`}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/sign-in">
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
                  <Link href="/sign-up">
                    <Button
                      size="sm"
                      className={
                        isTransparent
                          ? 'bg-white text-black hover:bg-white/90'
                          : ''
                      }
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden ${
                isTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'hover:bg-primary/5'
              }`}
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <div
            className={`border-t ${
              isTransparent ? 'bg-black/80' : 'bg-background'
            }`}
          >
            <nav className="flex flex-col py-4" aria-label="Mobile navigation">
              {marketingLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    isTransparent
                      ? 'text-white/70 hover:text-white hover:bg-white/10'
                      : pathname === link.href
                        ? 'text-primary bg-primary/5'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t mt-4 pt-4 px-6 space-y-3">
                {isSignedIn ? (
                  <>
                    <Link href="/dashboard" className="block">
                      <Button
                        variant={isTransparent ? 'outline' : 'ghost'}
                        size="sm"
                        className={`w-full gap-2 ${
                          isTransparent
                            ? 'border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30'
                            : ''
                        }`}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant={isTransparent ? 'outline' : 'ghost'}
                      size="sm"
                      onClick={handleSignOut}
                      className={`w-full gap-2 text-destructive hover:text-destructive ${
                        isTransparent
                          ? 'border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30'
                          : ''
                      }`}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in" className="block">
                      <Button
                        variant={isTransparent ? 'outline' : 'ghost'}
                        size="sm"
                        className={`w-full ${
                          isTransparent
                            ? 'border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30'
                            : ''
                        }`}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up" className="block">
                      <Button
                        size="sm"
                        className={`w-full ${
                          isTransparent
                            ? 'bg-white text-black hover:bg-white/90'
                            : ''
                        }`}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
