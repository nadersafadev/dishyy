import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import {
  Menu,
  User,
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  UserCircle,
  ListTree,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NavItem } from './NavItem';

// Define navigation items
type NavItemType = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
};

const navItems: NavItemType[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/parties',
    label: 'All Parties',
    icon: Users,
  },
  {
    href: '/profile',
    label: 'My Profile',
    icon: UserCircle,
  },
  {
    href: '/dishes',
    label: 'Manage Dishes',
    icon: UtensilsCrossed,
    adminOnly: true,
  },
  {
    href: '/categories',
    label: 'Categories',
    icon: ListTree,
    adminOnly: true,
  },
];

export default async function Header() {
  const { userId } = await auth();
  const user = userId
    ? await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { role: true },
      })
    : null;
  const clerkUser = await currentUser();
  const isAdmin = user?.role === 'ADMIN';

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

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
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="flex flex-col gap-8">
                  {/* User Identity Section */}
                  {userId && (
                    <div className="flex flex-col items-center gap-4 py-6 border-b border-border/40">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={clerkUser?.imageUrl} alt="Profile" />
                        <AvatarFallback>
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <p className="font-medium">
                          {clerkUser?.firstName} {clerkUser?.lastName}
                        </p>
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
                          icon={item.icon}
                          isMobile
                        />
                      </SheetClose>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8 hover:opacity-80 transition-opacity',
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
