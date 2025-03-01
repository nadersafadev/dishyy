'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  UtensilsCrossedIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { UpdateDishQuantity } from '@/components/update-dish-quantity';
import { RemovePartyDish } from '@/components/remove-party-dish';
import { DishContributionForm } from '@/components/dish-contribution-form';
import {
  PartyDish,
  PartyParticipant,
  ParticipantDishContribution,
} from '@prisma/client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface PartyDishItemProps {
  partyDish: PartyDish & {
    dish: {
      name: string;
      unit: string;
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
        unit: string;
      };
    })[];
  })[];
  totalParticipants: number;
  isAdmin: boolean;
  isParticipant: boolean;
  partyId: string;
}

export function PartyDishItem({
  partyDish,
  participants,
  totalParticipants,
  isAdmin,
  isParticipant,
  partyId,
}: PartyDishItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate contribution data
  const contributions = participants.flatMap(p =>
    p.contributions.filter(c => c.dishId === partyDish.dishId)
  );

  const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);

  const totalNeeded = partyDish.amountPerPerson * totalParticipants;

  const remainingNeeded = Math.max(0, totalNeeded - totalContributed);

  const progressPercentage = Math.min(
    (totalContributed / totalNeeded) * 100,
    100
  );

  return (
    <Card className="overflow-hidden group transition-all duration-200 hover:shadow-md">
      <CardContent className="p-0">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex flex-col relative">
            {/* Admin controls in a more styled toolbar */}
            {isAdmin && (
              <div className="absolute top-3 right-10 flex items-center gap-2 z-10 bg-background/80 backdrop-blur-sm py-1 px-2 rounded-md shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
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

            {/* Compact header - always visible */}
            <CollapsibleTrigger className="w-full text-left p-5 flex items-start justify-between gap-4 group cursor-pointer">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative w-14 h-14 rounded-md overflow-hidden shrink-0 bg-muted shadow-sm">
                  {partyDish.dish.imageUrl ? (
                    <img
                      src={partyDish.dish.imageUrl}
                      alt={partyDish.dish.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                      <UtensilsCrossedIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-base truncate">
                      {partyDish.dish.name}
                    </span>
                    <Badge variant="outline" className="shrink-0">
                      {partyDish.dish.unit}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <span>{partyDish.amountPerPerson} per person</span>
                    <span className="mx-1">•</span>
                    <span className="font-medium">
                      {totalContributed.toFixed(1)}/{totalNeeded.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-muted-foreground">
                {isOpen ? (
                  <ChevronDownIcon className="h-5 w-5" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5" />
                )}
              </div>
            </CollapsibleTrigger>

            {/* Progress bar - visible in both states */}
            <div className="px-5 pb-3">
              <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-primary transition-all duration-500 ease-in-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Expanded content */}
            <CollapsibleContent>
              {/* Description if available */}
              {partyDish.dish.description && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-muted-foreground">
                    {partyDish.dish.description}
                  </p>
                </div>
              )}

              {/* Contributions section with improved styling */}
              <div className="bg-muted/30 p-5 space-y-3 border-t">
                {isParticipant ? (
                  <>
                    <div className="text-sm font-medium flex justify-between items-center">
                      <span>Contributions</span>
                      {contributions.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {contributions.length} contribution
                          {contributions.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      {contributions.length > 0 ? (
                        contributions.map(contribution => {
                          const participant = participants.find(
                            p => p.id === contribution.participantId
                          );
                          return (
                            <div
                              key={contribution.id}
                              className="flex items-center justify-between text-sm bg-background/80 p-2.5 rounded-md"
                            >
                              <span className="font-medium">
                                {participant?.user.name}
                              </span>
                              <span className="text-muted-foreground">
                                {contribution.amount.toFixed(1)}{' '}
                                {partyDish.dish.unit.toLowerCase()}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-sm text-muted-foreground py-1">
                          No contributions yet
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground py-2">
                    Join the party to see individual contributions
                  </div>
                )}

                {remainingNeeded > 0 && (
                  <div className="text-sm font-medium flex items-center gap-2">
                    <span className="text-muted-foreground">Still needed:</span>
                    <Badge variant="outline" className="font-normal">
                      {remainingNeeded.toFixed(1)}{' '}
                      {partyDish.dish.unit.toLowerCase()}
                    </Badge>
                  </div>
                )}

                {isParticipant && remainingNeeded > 0 && (
                  <div className="border-t pt-4 mt-2">
                    <DishContributionForm
                      partyId={partyId}
                      dishId={partyDish.dishId}
                      dishName={partyDish.dish.name}
                      unit={partyDish.dish.unit}
                      remainingNeeded={remainingNeeded}
                    />
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
