import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export default async function Header() {
  const { userId } = await auth();
  const user = userId
    ? await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { role: true },
      })
    : null;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="bg-background border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <Logo />
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden sm:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/parties"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                All Parties
              </Link>
              {isAdmin && (
                <Link
                  href="/dishes"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Manage Dishes
                </Link>
              )}
            </nav>
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
