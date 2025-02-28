import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import { DishListWithViewToggle } from '@/components/DishListWithViewToggle';

export default async function DishesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const [user, dishes] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    }),
    prisma.dish.findMany({
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
    }),
  ]);

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Manage Dishes
          </h1>
          <p className="text-muted-foreground">
            Create and manage dishes that can be added to parties.
          </p>
        </div>
        <Link href="/dishes/new" className="self-start sm:self-auto">
          <Button className="gap-2 w-full sm:w-auto">
            <PlusIcon className="h-4 w-4" />
            Add Dish
          </Button>
        </Link>
      </div>

      <div className="card p-6">
        {dishes.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No dishes available.</p>
            <Button asChild className="mt-4">
              <Link href="/dishes/new">Create Your First Dish</Link>
            </Button>
          </div>
        ) : (
          <DishListWithViewToggle
            dishes={dishes}
            title="Available Dishes"
            description="Manage and organize dishes for your parties."
          />
        )}
      </div>
    </div>
  );
}
