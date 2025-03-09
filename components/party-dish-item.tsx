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
import { DishProgressBar } from '@/components/party-dish/dish-progress-bar';
import { ContributionsList } from '@/components/party-dish/contributions-list';

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
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate contribution data
  const contributions = participants.flatMap(p =>
    p.contributions
      .filter(c => c.dishId === partyDish.dishId)
      .map(c => ({
        ...c,
        dish: {
          name: partyDish.dish.name,
          unit: partyDish.dish.unit,
        },
        participant: {
          userId: p.userId,
          user: {
            name: p.user.name,
          },
        },
      }))
  );

  const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);
  const totalNeeded = partyDish.amountPerPerson * totalParticipants;
  const remainingNeeded = Math.max(0, totalNeeded - totalContributed);
  const isQuantityUnit =
    partyDish.dish.unit === 'QUANTITY' || partyDish.dish.unit === 'PIECES';
  const displayedTotalContributed = isQuantityUnit
    ? Math.ceil(totalContributed)
    : totalContributed;
  const displayedTotalNeeded = isQuantityUnit
    ? Math.ceil(totalNeeded)
    : totalNeeded;
  const displayedRemainingNeeded = isQuantityUnit
    ? Math.ceil(remainingNeeded)
    : remainingNeeded;
  const progressPercentage = Math.min(
    (totalContributed / totalNeeded) * 100,
    100
  );

  // Calculate user's total contributions
  const userContributions = currentUserId
    ? contributions.filter(c => c.participant.userId === currentUserId)
    : [];
  const userTotalContribution = userContributions.reduce(
    (sum, c) => sum + c.amount,
    0
  );
  const displayedUserTotalContribution = isQuantityUnit
    ? Math.ceil(userTotalContribution)
    : userTotalContribution;

  const handleContributeClick = () => {
    setIsExpanded(true);
    // Use setTimeout to ensure the element exists after expansion
    setTimeout(() => {
      const contributionForm = document.querySelector(
        `[data-dish-contribution-form="${partyDish.dishId}"]`
      );
      contributionForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="p-4 space-y-4">
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
              <div className="flex items-center gap-4 flex-1">
                <span className="text-sm font-medium">
                  {isQuantityUnit
                    ? `${displayedTotalContributed}/${displayedTotalNeeded}`
                    : `${totalContributed.toFixed(1)}/${totalNeeded.toFixed(1)}`}{' '}
                  {partyDish.dish.unit.toLowerCase()}
                </span>
                {isParticipant && userTotalContribution > 0 && (
                  <span className="text-sm text-muted-foreground">
                    Your contribution:{' '}
                    {isQuantityUnit
                      ? displayedUserTotalContribution
                      : userTotalContribution.toFixed(1)}{' '}
                    {partyDish.dish.unit.toLowerCase()}
                  </span>
                )}
              </div>
              {isParticipant &&
                (userTotalContribution > 0 ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleContributeClick}
                  >
                    Contribute
                  </Button>
                ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <DishProgressBar progressPercentage={progressPercentage} />

        {/* Contribution Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-4">
            <ContributionsList
              contributions={contributions}
              isParticipant={isParticipant}
              currentUserId={currentUserId || null}
              remainingNeeded={displayedRemainingNeeded}
              dishName={partyDish.dish.name}
              unit={partyDish.dish.unit}
              partyId={partyId}
            />

            {isParticipant && remainingNeeded > 0 && (
              <div data-dish-contribution-form={partyDish.dishId}>
                <DishContributionForm
                  partyId={partyId}
                  dishId={partyDish.dishId}
                  dishName={partyDish.dish.name}
                  unit={partyDish.dish.unit}
                  remainingNeeded={displayedRemainingNeeded}
                  isEdit={false}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
