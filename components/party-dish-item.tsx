'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { DishContributionForm } from '@/components/dish-contribution-form';
import {
  PartyDish,
  PartyParticipant,
  ParticipantDishContribution,
} from '@prisma/client';
import { DishHeader } from '@/components/party-dish/dish-header';
import { DishProgressBar } from '@/components/party-dish/dish-progress-bar';
import { DishDescription } from '@/components/party-dish/dish-description';
import { ContributionsList } from '@/components/party-dish/contributions-list';
import { AdminControls } from '@/components/party-dish/admin-controls';
import { Unit } from '@/lib/types';

interface PartyDishItemProps {
  partyDish: PartyDish & {
    dish: {
      name: string;
      unit: Unit;
      description: string | null;
      imageUrl: string | null;
      categoryId: string;
      category?: {
        name: string;
        id: string;
        parentId: string | null;
      };
    };
  };
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
  totalParticipants: number;
  isAdmin: boolean;
  isParticipant: boolean;
  partyId: string;
  currentUserId?: string | null;
}

export function PartyDishItem({
  partyDish,
  participants,
  totalParticipants,
  isAdmin,
  isParticipant,
  partyId,
  currentUserId = null,
}: PartyDishItemProps) {
  const [isOpen, setIsOpen] = useState(false);

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
  // If the user is editing, they can contribute up to their current amount + remaining needed
  const maxEditAmount = userContribution
    ? userContribution.amount + remainingNeeded
    : remainingNeeded;
  const progressPercentage = Math.min(
    (totalContributed / totalNeeded) * 100,
    100
  );

  return (
    <Card className="overflow-hidden group transition-all duration-200 hover:shadow-md">
      <CardContent className="p-0">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex flex-col relative">
            {/* Admin controls */}
            <AdminControls
              isAdmin={isAdmin}
              partyId={partyId}
              dishId={partyDish.dishId}
              dishName={partyDish.dish.name}
              unit={partyDish.dish.unit}
              amountPerPerson={partyDish.amountPerPerson}
            />

            {/* Compact header - always visible */}
            <DishHeader
              name={partyDish.dish.name}
              unit={partyDish.dish.unit}
              imageUrl={partyDish.dish.imageUrl}
              amountPerPerson={partyDish.amountPerPerson}
              totalContributed={totalContributed}
              totalNeeded={totalNeeded}
              isOpen={isOpen}
            />

            {/* Progress bar - visible in both states */}
            <DishProgressBar progressPercentage={progressPercentage} />

            {/* Expanded content */}
            <CollapsibleContent>
              {/* Description if available */}
              <DishDescription description={partyDish.dish.description} />

              {/* Contributions section */}
              <div className="bg-muted/30 p-5 space-y-3 border-t">
                <ContributionsList
                  contributions={contributions}
                  isParticipant={isParticipant}
                  currentUserId={currentUserId}
                  remainingNeeded={remainingNeeded}
                  dishName={partyDish.dish.name}
                  unit={partyDish.dish.unit}
                  partyId={partyId}
                />

                {isParticipant && (
                  <div className="border-t pt-4 mt-2">
                    {userContribution ? (
                      <DishContributionForm
                        partyId={partyId}
                        dishId={partyDish.dishId}
                        dishName={partyDish.dish.name}
                        unit={partyDish.dish.unit}
                        remainingNeeded={maxEditAmount}
                        isEdit={true}
                        contributionId={userContribution.id}
                        initialAmount={userContribution.amount}
                      />
                    ) : (
                      remainingNeeded > 0 && (
                        <DishContributionForm
                          partyId={partyId}
                          dishId={partyDish.dishId}
                          dishName={partyDish.dish.name}
                          unit={partyDish.dish.unit}
                          remainingNeeded={remainingNeeded}
                          isEdit={false}
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
