import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { syncUserRole } from '@/lib/roles';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusIcon, ArrowRight } from 'lucide-react';
import { PartyListWithViewToggle } from '@/components/party-list-with-view-toggle';
import { DishListWithViewToggle } from '@/components/DishListWithViewToggle';
import { Prisma } from '@prisma/client';

// Type for our data fetching function
type DashboardData = {
  parties: Prisma.PartyGetPayload<{
    include: {
      createdBy: true;
      dishes: {
        include: {
          dish: {
            select: {
              name: true;
              unit: true;
            };
          };
        };
      };
      participants: {
        include: {
          user: true;
        };
      };
    };
  }>[];
  dishes:
    | Prisma.DishGetPayload<{
        include: {
          _count: {
            select: {
              parties: true;
            };
          };
        };
      }>[]
    | null;
};

// Separate data fetching logic to avoid duplication
async function fetchDashboardData(isAdmin: boolean): Promise<DashboardData> {
  const [parties, dishes] = await Promise.all([
    prisma.party.findMany({
      take: 5, // Limit to 5 parties
      orderBy: {
        createdAt: 'desc', // Show most recent first
      },
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
    isAdmin
      ? prisma.dish.findMany({
          take: 9, // Limit to 9 dishes
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

  return { parties, dishes };
}

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true },
    });

    // Handle new user flow
    if (!user) {
      // Get Clerk user details for debugging
      const clerkUser = await clerkClient.users.getUser(userId);
      console.log('New user detected:', {
        id: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.emailAddresses[0].emailAddress,
      });

      // Sync user role and get user data
      const userData = await syncUserRole();
      if (!userData || !userData.role) {
        console.error('Failed to sync user role or invalid user data');
        redirect('/error?message=Failed to setup user account');
      }

      // Determine if user is new based on creation date
      const isNewUser =
        Date.now() - new Date(userData.createdAt).getTime() <
        24 * 60 * 60 * 1000;

      // Fetch dashboard data
      const { parties, dishes } = await fetchDashboardData(
        userData.role === 'ADMIN'
      );

      return (
        <DashboardView
          isNewUser={isNewUser}
          isAdmin={userData.role === 'ADMIN'}
          parties={parties}
          dishes={dishes}
        />
      );
    }

    // Regular user flow
    const { parties, dishes } = await fetchDashboardData(user.role === 'ADMIN');

    return (
      <DashboardView
        isNewUser={false}
        isAdmin={user.role === 'ADMIN'}
        parties={parties}
        dishes={dishes}
      />
    );
  } catch (error) {
    console.error('Dashboard error:', error);

    // Handle specific error types
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Database connection issues
      redirect('/error?message=Database connection error');
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      // Invalid data shape
      redirect('/error?message=Invalid data format');
    } else if (error instanceof Error) {
      // Other known errors
      redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }

    // Unknown errors
    redirect('/error?message=Failed to load dashboard');
  }
}

// Separate view component to reduce duplication
function DashboardView({
  isNewUser,
  isAdmin,
  parties,
  dishes,
}: {
  isNewUser: boolean;
  isAdmin: boolean;
  parties: DashboardData['parties'];
  dishes: DashboardData['dishes'];
}) {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          {isNewUser && (
            <p className="text-muted-foreground mt-2">
              Welcome! This is your dashboard where you can manage your parties
              and dishes.
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href="/parties/new">
              <PlusIcon className="w-4 h-4 mr-2" />
              New Party
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent Parties</h2>
              <p className="text-sm text-muted-foreground">
                Your most recently created or joined parties
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/parties" className="flex items-center gap-2">
                Show All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <PartyListWithViewToggle
            parties={parties}
            title="Available Dish Parties"
            description="Join or view upcoming dish parties in your area."
          />
        </div>

        {isAdmin && dishes && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Popular Dishes</h2>
                <p className="text-sm text-muted-foreground">
                  Most frequently used dishes in parties
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dishes" className="flex items-center gap-2">
                  Show All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <DishListWithViewToggle
              dishes={dishes}
              title="Available Dishes"
              description="Manage and organize dishes for your parties."
            />
          </div>
        )}
      </div>
    </div>
  );
}
