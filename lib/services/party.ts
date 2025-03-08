import { prisma } from '@/lib/prisma';
import { Unit } from '@/lib/types';
import {
  Party,
  PartyDish,
  PartyParticipant,
  ParticipantDishContribution,
} from '@prisma/client';

export interface PartyWithDetails extends Party {
  createdBy: {
    name: string;
  };
  dishes: (PartyDish & {
    dish: {
      id: string;
      name: string;
      unit: Unit;
      description: string | null;
      imageUrl: string | null;
      categoryId: string | null;
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
        unit: Unit;
      };
    })[];
  })[];
}

export async function getPartyDetails(partyId: string) {
  const party = await prisma.party.findUnique({
    where: { id: partyId },
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
      joinRequests: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!party) return null;

  // Convert Prisma Unit enum to our Unit type
  return {
    ...party,
    dishes: party.dishes.map(dish => ({
      ...dish,
      dish: {
        ...dish.dish,
        unit: dish.dish.unit as Unit,
      },
    })),
    participants: party.participants.map(participant => ({
      ...participant,
      contributions: participant.contributions.map(contribution => ({
        ...contribution,
        dish: {
          ...contribution.dish,
          unit: contribution.dish.unit as Unit,
        },
      })),
    })),
  };
}

export async function getCategories(categoryIds: (string | null)[]) {
  const validCategoryIds = categoryIds.filter(
    (id): id is string => id !== null
  );
  if (!validCategoryIds.length) return [];

  return prisma.category.findMany({
    where: {
      id: {
        in: validCategoryIds,
      },
    },
    select: {
      id: true,
      name: true,
      parentId: true,
    },
  });
}

export function calculatePartyStats(party: PartyWithDetails) {
  const totalParticipants = party.participants.reduce(
    (sum, p) => sum + 1 + p.numGuests,
    0
  );
  const hasMaxParticipants = party.maxParticipants !== null;
  const isFull =
    hasMaxParticipants && totalParticipants >= (party.maxParticipants ?? 0);

  return {
    totalParticipants,
    hasMaxParticipants,
    isFull,
  };
}

export function enhancePartyWithCategories(
  party: PartyWithDetails,
  categoryMap: Record<
    string,
    { id: string; name: string; parentId: string | null }
  >
) {
  const dishesWithCategories = party.dishes.map(dish => ({
    ...dish,
    dish: {
      ...dish.dish,
      unit: dish.dish.unit as Unit,
      categoryId: dish.dish.categoryId || '',
      category:
        dish.dish.categoryId && categoryMap[dish.dish.categoryId]
          ? {
              id: categoryMap[dish.dish.categoryId].id,
              name: categoryMap[dish.dish.categoryId].name,
              parentId: categoryMap[dish.dish.categoryId].parentId,
            }
          : { id: 'uncategorized', name: 'Uncategorized', parentId: null },
    },
  }));

  const participantsWithContributions = party.participants.map(participant => ({
    ...participant,
    contributions: participant.contributions.map(contribution => ({
      ...contribution,
      dish: {
        ...contribution.dish,
        unit: contribution.dish.unit as Unit,
      },
    })),
  }));

  return {
    dishesWithCategories,
    participantsWithContributions,
  };
}
