import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { UsersIcon, CalendarIcon, MapPinIcon } from 'lucide-react';
import { PartyActions } from '@/components/party-actions';
import { EditPartyDialog } from '@/components/edit-party-dialog';
import { ShareParty } from '@/components/share-party';
import { DishesContent } from './party-content';
import { PartyDishAmounts } from '@/components/party-dishes-amounts';
import {
  Party,
  PartyDish,
  PartyParticipant,
  ParticipantDishContribution,
} from '@prisma/client';
import { DeletePartyDialog } from '@/components/delete-party-dialog';
import { RemoveParticipantButton } from '@/components/remove-participant-button';

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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-card rounded-xl p-6 shadow-sm border">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {party.name}
          </h1>
          <p className="text-muted-foreground">{party.description}</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>
                {new Date(party.date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <span>
                {totalParticipants} participant
                {totalParticipants !== 1 && 's'}
                {hasMaxParticipants && ` / ${party.maxParticipants}`}
              </span>
              {isFull && (
                <Badge variant="destructive" className="ml-2">
                  Full
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              <span>Hosted by {party.createdBy.name}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start mt-4 sm:mt-0">
          <ShareParty partyId={party.id} partyName={party.name} />
          {isAdmin && (
            <>
              <EditPartyDialog party={party} />
              <DeletePartyDialog partyId={party.id} partyName={party.name} />
            </>
          )}
          <PartyActions
            partyId={party.id}
            isParticipant={isParticipant}
            isFull={isFull}
          />
        </div>
      </div>

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
          <div className="card p-6 space-y-4 shadow-sm border">
            <h2 className="text-lg font-medium">Participants</h2>
            <div className="space-y-3">
              {party.participants.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No participants yet. Be the first to join!
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {party.participants.map(participant => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg"
                    >
                      <span className="font-medium">
                        {participant.user.name}
                      </span>
                      <div className="flex items-center gap-2">
                        {participant.numGuests > 0 && (
                          <Badge variant="secondary">
                            +{participant.numGuests} guest
                            {participant.numGuests !== 1 && 's'}
                          </Badge>
                        )}
                        {isAdmin && (
                          <RemoveParticipantButton
                            partyId={party.id}
                            participantId={participant.id}
                            participantName={participant.user.name}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dishes Section - Full Width */}
      <DishesContent
        dishes={dishesWithCategories}
        participants={party.participants}
        isParticipant={isParticipant}
        totalParticipants={totalParticipants}
        isAdmin={isAdmin}
      />
    </div>
  );
}
