import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DishesContent } from './party-content';
import { PartyDishAmounts } from '@/components/party-dishes-amounts';
import {
  Party,
  PartyDish,
  PartyParticipant,
  ParticipantDishContribution,
} from '@prisma/client';
import { generateMetadata as baseGenerateMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { PartyParticipants } from '@/components/party-participants';
import { PartyHeader } from '@/components/party-header';

interface PartyWithDetails extends Party {
  createdBy: {
    name: string;
  };
  dishes: (PartyDish & {
    dish: {
      id: string;
      name: string;
      unit: string;
      description: string | null;
      imageUrl: string | null;
      categoryId: string;
      category?: {
        id: string;
        name: string;
        parentId: string | null;
      };
    };
  })[];
  participants: (PartyParticipant & {
    user: {
      name: string;
    };
    contributions: (ParticipantDishContribution & {
      dish: {
        name: string;
        unit: string;
      };
    })[];
  })[];
}

export default async function PartyPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const [user, party] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true },
    }),
    prisma.party.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
        dishes: {
          include: {
            dish: {
              select: {
                id: true,
                name: true,
                unit: true,
                description: true,
                imageUrl: true,
                categoryId: true,
              },
            },
          },
        },
        participants: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
            contributions: {
              include: {
                dish: {
                  select: {
                    name: true,
                    unit: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  if (!party) {
    redirect('/parties');
  }

  if (!user) {
    redirect('/sign-in');
  }

  const isAdmin = user.role === 'ADMIN';
  const isParticipant = party.participants.some(p => p.userId === user.id);
  const totalParticipants = party.participants.reduce(
    (sum, p) => sum + 1 + p.numGuests,
    0
  );
  const hasMaxParticipants = party.maxParticipants !== null;
  const isFull =
    hasMaxParticipants && totalParticipants >= (party.maxParticipants ?? 0);

  // Get all unique category IDs from dishes
  const categoryIds = [
    ...new Set(party.dishes.map(d => d.dish.categoryId).filter(Boolean)),
  ];

  // Fetch all categories in a single query with parent information
  const categories = categoryIds.length
    ? await prisma.category.findMany({
        where: {
          id: {
            in: categoryIds as string[],
          },
        },
        select: {
          id: true,
          name: true,
          parentId: true,
        },
      })
    : [];

  // Create a map of category ID to category data for easy lookup
  const categoryMap = categories.reduce(
    (map, category) => {
      map[category.id] = category;
      return map;
    },
    {} as Record<string, { id: string; name: string; parentId: string | null }>
  );

  // Enhance dishes with category information
  const dishesWithCategories = party.dishes.map(partyDish => ({
    ...partyDish,
    dish: {
      ...partyDish.dish,
      // Ensure categoryId is always a string by filtering out null values
      // This matches the expected type in the components
      categoryId: partyDish.dish.categoryId || '',
      category:
        partyDish.dish.categoryId && categoryMap[partyDish.dish.categoryId]
          ? {
              id: categoryMap[partyDish.dish.categoryId].id,
              name: categoryMap[partyDish.dish.categoryId].name,
              parentId: categoryMap[partyDish.dish.categoryId].parentId,
            }
          : { id: 'uncategorized', name: 'Uncategorized', parentId: null },
    },
  }));

  return (
    <div className="mx-auto space-y-8 py-6">
      {/* Header */}
      <PartyHeader
        party={party}
        totalParticipants={totalParticipants}
        hasMaxParticipants={hasMaxParticipants}
        isFull={isFull}
        isAdmin={isAdmin}
        isParticipant={isParticipant}
      />

      {/* Two-column layout for content sections */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-8">
        {/* Left column */}
        <div className="md:col-span-5 space-y-8">
          {/* Amount Per Person Section */}
          <PartyDishAmounts dishes={dishesWithCategories} isAdmin={isAdmin} />
        </div>

        {/* Right column */}
        <div className="md:col-span-3 space-y-8">
          {/* Participants Section */}
          <PartyParticipants
            participants={party.participants}
            isAdmin={isAdmin}
            partyId={party.id}
            currentUserId={user.id}
          />
        </div>
      </div>

      {/* Dishes Section - Full Width */}
      <DishesContent
        dishes={dishesWithCategories}
        participants={party.participants}
        isParticipant={isParticipant}
        totalParticipants={totalParticipants}
        isAdmin={isAdmin}
        currentUserId={user.id}
      />
    </div>
  );
}

// Generate dynamic metadata for the party page
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // Fetch party data for the metadata
  const party = await prisma.party.findUnique({
    where: { id: params.id },
    select: { name: true, description: true },
  });

  // If party not found, use default metadata
  if (!party) {
    return baseGenerateMetadata(
      'Party Not Found',
      'The requested party could not be found'
    );
  }

  // Return customized metadata with the party name
  return baseGenerateMetadata(
    party.name,
    party.description || `Details about ${party.name}`
  );
}
