import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ArrowLeftIcon,
  UtensilsCrossedIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DeleteDishDialog } from '@/components/dishes/DeleteDishDialog';

export default async function DishPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get current user for role check
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    redirect('/sign-in');
  }

  // Only admin users can access this page
  if (user.role !== 'ADMIN') {
    redirect('/dishes');
  }

  // Fetch the dish with its category
  const dish = await prisma.dish.findUnique({
    where: { id: params.id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!dish) {
    notFound();
  }

  // Count how many parties use this dish
  const usageCount = await prisma.partyDish.count({
    where: { dishId: dish.id },
  });

  // Get parties that use this dish (limited to 5 most recent)
  const partiesUsingDish = await prisma.partyDish.findMany({
    where: { dishId: dish.id },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      party: {
        select: {
          id: true,
          name: true,
          date: true,
        },
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Back button */}
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dishes">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Dishes
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Image */}
        <div className="md:col-span-1">
          <div className="aspect-square relative rounded-lg overflow-hidden border bg-muted">
            {dish.imageUrl ? (
              <Image
                src={dish.imageUrl}
                alt={dish.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <UtensilsCrossedIcon className="h-24 w-24 text-muted-foreground/40" />
              </div>
            )}
          </div>
        </div>

        {/* Right column - Dish details */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{dish.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline">{dish.unit}</Badge>
                {dish.category && (
                  <Badge variant="secondary">{dish.category.name}</Badge>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/dishes/${dish.id}/edit`}>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <DeleteDishDialog
                dishId={dish.id}
                dishName={dish.name}
                inMenuCount={usageCount}
                trigger={
                  <Button size="sm" variant="destructive">
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                }
              />
            </div>
          </div>

          {/* Description */}
          {dish.description && (
            <div className="card p-4">
              <h2 className="text-lg font-medium mb-2">Description</h2>
              <p className="text-muted-foreground">{dish.description}</p>
            </div>
          )}

          {/* Usage stats */}
          <div className="card p-4">
            <h2 className="text-lg font-medium mb-2">Usage Statistics</h2>
            <p className="text-muted-foreground">
              This dish is used in {usageCount}{' '}
              {usageCount === 1 ? 'party' : 'parties'}.
            </p>
          </div>

          {/* Parties using this dish */}
          {partiesUsingDish.length > 0 && (
            <div className="card p-4">
              <h2 className="text-lg font-medium mb-4">
                Used in{' '}
                {partiesUsingDish.length === 5 ? '5+' : partiesUsingDish.length}{' '}
                Parties
              </h2>
              <div className="space-y-3">
                {partiesUsingDish.map(partyDish => (
                  <Link
                    key={partyDish.id}
                    href={`/parties/${partyDish.party.id}`}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition"
                  >
                    <span className="font-medium">{partyDish.party.name}</span>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {new Date(partyDish.party.date).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              {usageCount > 5 && (
                <p className="text-sm text-muted-foreground mt-3">
                  And {usageCount - 5} more{' '}
                  {usageCount - 5 === 1 ? 'party' : 'parties'}...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
