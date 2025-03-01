import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { syncUserRole } from '@/lib/roles';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import { PartyListWithViewToggle } from '@/components/party-list-with-view-toggle';
import { DishListWithViewToggle } from '@/components/DishListWithViewToggle';

export default async function Dashboard() {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect('/sign-in');
    }

    // Get Clerk user details for debugging
    const clerkUser = await clerkClient.users.getUser(userId);
    console.log('Clerk User:', {
      id: clerkUser.id,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      email: clerkUser.emailAddresses[0].emailAddress,
    });

    // Check existing database user
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    console.log('Existing DB User:', existingUser);

    // Sync user role and get user data
    const user = await syncUserRole();
    if (!user) {
      redirect('/sign-in');
    }
    console.log('Synced User:', user);

    const [parties, dishes] = await Promise.all([
      prisma.party.findMany({
        include: {
          createdBy: true,
          dishes: {
            include: {
              dish: {
                select: {
                  name: true,
                  unit: true,
                },
              },
            },
          },
          participants: {
            include: {
              user: true,
            },
          },
        },
      }),
      user.role === 'ADMIN'
        ? prisma.dish.findMany({
            orderBy: {
              name: 'asc',
            },
            include: {
              _count: {
                select: {
                  parties: true,
                },
              },
            },
          })
        : null,
    ]);

    const isAdmin = user.role === 'ADMIN';

    return (
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back, {user.name}!
            </h1>
            <p className="text-muted-foreground">
              Manage your dish parties and discover new culinary adventures.
            </p>
          </div>
          {isAdmin && (
            <div className="flex flex-col sm:flex-row gap-4 self-start sm:self-auto">
              <Link href="/parties/new">
                <Button className="gap-2 w-full sm:w-auto">
                  <PlusIcon className="h-4 w-4" />
                  Create Party
                </Button>
              </Link>
              <Link href="/dishes/new">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <PlusIcon className="h-4 w-4" />
                  Add Dish
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Parties Section */}
        <section className="card p-6 space-y-4">
          <PartyListWithViewToggle
            parties={parties}
            title="Available Dish Parties"
            description="Join or view upcoming dish parties in your area."
          />
        </section>

        {/* Dishes Section - Admin Only */}
        {isAdmin && dishes && (
          <section className="card p-6 space-y-4">
            <DishListWithViewToggle
              dishes={dishes}
              title="Available Dishes"
              description="Manage and organize dishes for your parties."
            />
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error('Dashboard Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
