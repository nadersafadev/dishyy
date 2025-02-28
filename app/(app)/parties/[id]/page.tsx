import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { UsersIcon, CalendarIcon, MapPinIcon } from 'lucide-react';
import { PartyActions } from '@/components/party-actions';
import { EditPartyDialog } from '@/components/edit-party-dialog';
import { ShareParty } from '@/components/share-party';
import { DishesContent } from './party-content';
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
      name: string;
      unit: string;
      description: string | null;
      imageUrl: string | null;
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
                name: true,
                unit: true,
                description: true,
                imageUrl: true,
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {party.name}
          </h1>
          <p className="text-muted-foreground">{party.description}</p>
        </div>
        <div className="flex items-center gap-4 self-start">
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

      {/* Party Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-medium">Details</h2>
            <div className="space-y-3">
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
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-medium">Participants</h2>
            <div className="space-y-3">
              {party.participants.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No participants yet. Be the first to join!
                </p>
              ) : (
                party.participants.map(participant => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="font-medium">{participant.user.name}</span>
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Per Person Amounts Card */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-medium">Amount Per Person</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {party.dishes.map(partyDish => (
            <div
              key={partyDish.dishId}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{partyDish.dish.name}</span>
                <Badge variant="outline" className="shrink-0">
                  {partyDish.dish.unit}
                </Badge>
              </div>
              <span className="text-sm">
                {partyDish.amountPerPerson.toFixed(1)}{' '}
                {partyDish.dish.unit.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dishes Section - Full Width */}
      <DishesContent
        dishes={party.dishes}
        participants={party.participants}
        isParticipant={isParticipant}
        totalParticipants={totalParticipants}
        isAdmin={isAdmin}
      />
    </div>
  );
}
