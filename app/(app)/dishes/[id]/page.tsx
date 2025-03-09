import { auth } from '@clerk/nextjs/server';
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
  Share2Icon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DeleteDishDialog } from '@/components/dishes/DeleteDishDialog';
import { Metadata } from 'next';
import { generateMetadata as baseGenerateMetadata } from '@/lib/metadata';

// Generate dynamic metadata for the dish page
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // Fetch dish data for the metadata
  const dish = await prisma.dish.findUnique({
    where: { id: params.id },
    select: { name: true, description: true },
  });

  // If dish not found, use default metadata
  if (!dish) {
    return baseGenerateMetadata(
      'Dish Not Found',
      'The requested dish could not be found'
    );
  }

  // Return customized metadata with the dish name
  return baseGenerateMetadata(
    dish.name,
    dish.description || `Details about ${dish.name}`
  );
}

export default async function DishPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User ID not found');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized access');
  }

  const dish = await prisma.dish.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      parties: {
        include: {
          party: {
            select: {
              id: true,
              name: true,
              date: true,
            },
          },
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
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
      {/* Back button */}
      <div className="mb-6 sm:mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dishes">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Dishes
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
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
                <UtensilsCrossedIcon className="h-16 sm:h-24 w-16 sm:w-24 text-muted-foreground/40" />
              </div>
            )}
          </div>
        </div>

        {/* Right column - Dish details */}
        <div className="md:col-span-2 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{dish.name}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                <Badge variant="outline">{dish.unit}</Badge>
                {dish.category && (
                  <Badge variant="secondary">{dish.category.name}</Badge>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-initial justify-center"
              >
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
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1 sm:flex-initial justify-center"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                }
              />
            </div>
          </div>

          {/* Description */}
          {dish.description && (
            <div className="card p-3 sm:p-4">
              <h2 className="text-base sm:text-lg font-medium mb-2">
                Description
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                {dish.description}
              </p>
            </div>
          )}

          {/* Usage stats */}
          <div className="card p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-medium mb-2">
              Usage Statistics
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              This dish is used in {usageCount}{' '}
              {usageCount === 1 ? 'party' : 'parties'}.
            </p>
          </div>

          {/* Parties using this dish */}
          {partiesUsingDish.length > 0 && (
            <div className="card p-3 sm:p-4">
              <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                Used in{' '}
                {partiesUsingDish.length === 5 ? '5+' : partiesUsingDish.length}{' '}
                Parties
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {partiesUsingDish.map(partyDish => (
                  <Link
                    key={partyDish.id}
                    href={`/parties/${partyDish.party.id}`}
                    className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg hover:bg-muted transition"
                  >
                    <span className="font-medium text-sm sm:text-base">
                      {partyDish.party.name}
                    </span>
                    <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-sm">
                      <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>
                        {new Date(partyDish.party.date).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              {usageCount > 5 && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">
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
