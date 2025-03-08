import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { HeaderClient } from './HeaderClient';

// Define navigation items
type NavItemType = {
  href: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
};

const navItems: NavItemType[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
  },
  {
    href: '/parties',
    label: 'All Parties',
    icon: 'Users',
  },
  {
    href: '/profile',
    label: 'My Profile',
    icon: 'UserCircle',
  },
  {
    href: '/dishes',
    label: 'Manage Dishes',
    icon: 'UtensilsCrossed',
    adminOnly: true,
  },
  {
    href: '/categories',
    label: 'Categories',
    icon: 'ListTree',
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
    <HeaderClient
      userId={userId}
      userImageUrl={clerkUser?.imageUrl}
      userName={
        clerkUser?.firstName && clerkUser?.lastName
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser?.username
      }
      isAdmin={isAdmin}
      filteredNavItems={filteredNavItems}
    />
  );
}
