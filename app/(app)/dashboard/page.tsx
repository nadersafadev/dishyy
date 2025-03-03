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

    // Determine if user is new based on creation date
    // Consider a user "new" if they were created in the last 24 hours
    const isNewUser =
      Date.now() - new Date(user.createdAt).getTime() < 24 * 60 * 60 * 1000;

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
              {isNewUser
                ? `Welcome to Dishyy, ${user.name}!`
                : `Welcome back, ${user.name}!`}
            </h1>
            <p className="text-muted-foreground">
              {isNewUser
                ? "Let's get started with creating or joining dish parties."
                : 'Manage your dish parties and discover new culinary adventures.'}
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

        {/* First Time User Guide - Only shown to new users */}
        {isNewUser && (
          <section className="card p-6 space-y-6 bg-primary-50/20 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">
                🎉 Getting Started with Dishyy
              </h2>
              {/* Dismissible button would go here (requires client component) */}
            </div>

            <div className="space-y-5">
              {/* Step 1: Explore the platform */}
              <div className="border border-primary-200 dark:border-primary-800 rounded-lg p-4 bg-white dark:bg-slate-900">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="font-medium">Explore Available Parties</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse through parties happening in your area and see what
                      dishes others are contributing.
                    </p>
                    <Link href="#parties-section">
                      <Button variant="secondary" size="sm" className="mt-2">
                        Browse Parties
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Step 2: Join a party */}
              <div className="border border-primary-200 dark:border-primary-800 rounded-lg p-4 bg-white dark:bg-slate-900">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="font-medium">Join Your First Party</h3>
                    <p className="text-sm text-muted-foreground">
                      Find a party that interests you and join by selecting
                      dishes you'd like to contribute.
                    </p>
                    {parties.length > 0 ? (
                      <Link href={`/parties/${parties[0].id}`}>
                        <Button variant="secondary" size="sm" className="mt-2">
                          View First Party
                        </Button>
                      </Link>
                    ) : (
                      <p className="text-xs italic mt-2">
                        No parties available yet. Check back soon!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: Create a party (Admin only) */}
              {isAdmin && (
                <div className="border border-primary-200 dark:border-primary-800 rounded-lg p-4 bg-white dark:bg-slate-900">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      3
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="font-medium">Create Your Own Party</h3>
                      <p className="text-sm text-muted-foreground">
                        As an admin, you can create new dish parties and invite
                        others to join.
                      </p>
                      <Link href="/parties/new">
                        <Button className="mt-2 gap-2" size="sm">
                          <PlusIcon className="h-3 w-3" />
                          Create New Party
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3/4: Complete your profile */}
              <div className="border border-primary-200 dark:border-primary-800 rounded-lg p-4 bg-white dark:bg-slate-900">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {isAdmin ? '4' : '3'}
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="font-medium">Complete Your Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Add more details to your profile to help others connect
                      with you at dish parties.
                    </p>
                    <Link href="/profile">
                      <Button variant="outline" size="sm" className="mt-2">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <p className="text-xs text-muted-foreground italic">
                This guide will disappear after 24 hours.
              </p>
            </div>
          </section>
        )}

        {/* Parties Section */}
        <section id="parties-section" className="card p-6 space-y-4">
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
