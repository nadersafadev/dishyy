'use client';

import { UserButton, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import * as Icons from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NavItem } from './NavItem';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { LucideIcon, LucideProps } from 'lucide-react';
import { LogOut } from 'lucide-react';

interface HeaderClientProps {
  userId: string | null;
  userImageUrl?: string | null;
  userName?: string | null;
  isAdmin: boolean;
  filteredNavItems: Array<{
    href: string;
    label: string;
    icon: string;
  }>;
}

export function HeaderClient({
  userId,
  userImageUrl,
  userName,
  isAdmin,
  filteredNavItems,
}: HeaderClientProps) {
  const { signOut } = useClerk();
  const getIcon = (iconName: string): LucideIcon => {
    const icon = Icons[iconName as keyof typeof Icons];
    return icon as LucideIcon;
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="bg-background border-b border-border/40" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="flex-shrink-0">
            <Link
              href="/dashboard"
              className="flex items-center hover:opacity-90 transition-opacity"
              aria-label="Go to dashboard"
            >
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="flex-grow flex justify-center">
            <nav
              className="hidden md:flex items-center gap-8"
              aria-label="Main navigation"
            >
              {filteredNavItems.map(item => (
                <NavItem key={item.href} href={item.href} label={item.label} />
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    aria-label="Open menu"
                  >
                    <Icons.Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="flex flex-col gap-8">
                  {/* User Identity Section */}
                  {userId && (
                    <div className="flex flex-col items-center gap-4 py-6 border-b border-border/40">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={userImageUrl || undefined}
                          alt="Profile"
                        />
                        <AvatarFallback>
                          <Icons.User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <p className="font-medium">{userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {isAdmin ? 'Administrator' : 'User'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <nav
                    className="flex flex-col gap-6"
                    aria-label="Mobile navigation"
                  >
                    {filteredNavItems.map(item => (
                      <SheetClose key={item.href} asChild>
                        <NavItem
                          href={item.href}
                          label={item.label}
                          icon={getIcon(item.icon)}
                          isMobile
                        />
                      </SheetClose>
                    ))}
                  </nav>

                  {/* Sign Out Button */}
                  <div className="mt-auto pt-6 border-t border-border/40">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Notifications */}
            <NotificationBell />

            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8 hover:opacity-80 transition-opacity',
                  userButtonPopoverCard: 'shadow-lg border border-border/40',
                  userButtonPopoverActions: 'p-2',
                  userButtonPopoverActionButton: 'text-sm',
                  userButtonPopoverFooter: 'hidden',
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
