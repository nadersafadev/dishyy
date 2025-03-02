'use client';

import { Badge } from '@/components/ui/badge';
import { DeleteDishContributionDialog } from '@/components/delete-dish-contribution-dialog';
import { ParticipantDishContribution } from '@prisma/client';

interface ContributionsListProps {
  contributions: (ParticipantDishContribution & {
    dish: {
      name: string;
      unit: string;
    };
    participant?: {
      userId: string;
      user: {
        name: string;
      };
    };
  })[];
  isParticipant: boolean;
  currentUserId: string | null;
  remainingNeeded: number;
  dishName: string;
  unit: string;
  partyId: string;
}

export function ContributionsList({
  contributions,
  isParticipant,
  currentUserId,
  remainingNeeded,
  dishName,
  unit,
  partyId,
}: ContributionsListProps) {
  if (!isParticipant) {
    return (
      <div className="text-sm text-muted-foreground py-2">
        Join the party to see individual contributions
      </div>
    );
  }

  return (
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
            const isCurrentUserContribution =
              contribution.participant?.userId === currentUserId;

            return (
              <div
                key={contribution.id}
                className={`flex items-center justify-between text-sm bg-background/80 p-2.5 rounded-md ${
                  isCurrentUserContribution ? 'border border-primary' : ''
                }`}
              >
                <span className="font-medium">
                  {contribution.participant?.user.name}
                  {isCurrentUserContribution && ' (You)'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {unit === 'QUANTITY'
                      ? `${Math.ceil(contribution.amount)}`
                      : `${contribution.amount.toFixed(1)} ${unit.toLowerCase()}`}
                  </span>
                  {isCurrentUserContribution && (
                    <DeleteDishContributionDialog
                      contributionId={contribution.id}
                      partyId={partyId}
                      dishName={dishName}
                      amount={contribution.amount}
                      unit={unit}
                    />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-muted-foreground py-1">
            No contributions yet
          </div>
        )}
      </div>

      {remainingNeeded > 0 && (
        <div className="text-sm font-medium flex items-center gap-2">
          <span className="text-muted-foreground">Still needed:</span>
          <Badge variant="outline" className="font-normal">
            {unit === 'QUANTITY'
              ? `${Math.ceil(remainingNeeded)}`
              : `${remainingNeeded.toFixed(1)} ${unit.toLowerCase()}`}
          </Badge>
        </div>
      )}
    </>
  );
}
