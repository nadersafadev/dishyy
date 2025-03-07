'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UtensilsCrossedIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DishContributionForm } from '@/components/dish-contribution-form';
import { RemovePartyDish } from '@/components/remove-party-dish';
import { UpdateDishQuantity } from '@/components/update-dish-quantity';
import {
  PartyDishWithDetails,
  ParticipantWithContributions,
} from '@/lib/services/dish';

interface PartyDishItemProps {
  partyDish: PartyDishWithDetails;
  participants: ParticipantWithContributions[];
  totalParticipants: number;
  isAdmin: boolean;
  isParticipant: boolean;
  partyId: string;
  currentUserId?: string;
}

export function PartyDishItem({
  partyDish,
  participants,
  totalParticipants,
  isAdmin,
  isParticipant,
  partyId,
  currentUserId,
}: PartyDishItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleEditComplete = () => {
    setIsEditing(false);
  };

  // Calculate contribution data
  const contributions = participants.flatMap(p =>
    p.contributions
      .filter(c => c.dishId === partyDish.dishId)
      .map(c => ({
        ...c,
        participant: {
          userId: p.userId,
          user: {
            name: p.user.name,
          },
        },
      }))
  );

  // Check if current user already has a contribution for this dish
  const userContribution = currentUserId
    ? contributions.find(c => c.participant.userId === currentUserId)
    : null;

  const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);
  const totalNeeded = partyDish.amountPerPerson * totalParticipants;
  const remainingNeeded = Math.max(0, totalNeeded - totalContributed);

  return (
    <Card className="relative group">
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Image Section */}
          <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 bg-muted">
            {partyDish.dish.imageUrl ? (
              <Image
                src={partyDish.dish.imageUrl}
                alt={partyDish.dish.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                <UtensilsCrossedIcon className="h-6 w-6" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/dishes/${partyDish.dishId}`}
                className="font-medium hover:underline truncate"
              >
                {partyDish.dish.name}
              </Link>
              {isAdmin && (
                <div className="flex items-center gap-2 shrink-0">
                  <UpdateDishQuantity
                    partyId={partyId}
                    dishId={partyDish.dishId}
                    dishName={partyDish.dish.name}
                    unit={partyDish.dish.unit}
                    currentAmount={partyDish.amountPerPerson}
                    isAdmin={isAdmin}
                  />
                  <RemovePartyDish
                    partyId={partyId}
                    dishId={partyDish.dishId}
                    dishName={partyDish.dish.name}
                    isAdmin={isAdmin}
                  />
                </div>
              )}
            </div>

            {partyDish.dish.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {partyDish.dish.description}
              </p>
            )}

            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-medium">
                {partyDish.amountPerPerson} {partyDish.dish.unit.toLowerCase()}{' '}
                per person
              </span>
              {isParticipant && (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={handleEditClick}
                >
                  {isEditing ? 'Cancel' : 'Edit Contribution'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Contribution Form */}
        {isEditing && (
          <div className="mt-4 pt-4 border-t">
            <DishContributionForm
              partyId={partyId}
              dishId={partyDish.dishId}
              dishName={partyDish.dish.name}
              unit={partyDish.dish.unit}
              remainingNeeded={remainingNeeded}
              isEdit={!!userContribution}
              contributionId={userContribution?.id}
              initialAmount={userContribution?.amount}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
