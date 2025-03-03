'use client';

import { DeleteDishContributionDialog } from '@/components/delete-dish-contribution-dialog';
import { ParticipantDishContribution } from '@prisma/client';

interface ContributionItemProps {
  contribution: ParticipantDishContribution & {
    dish: {
      name: string;
      unit: string;
    };
    participant?: {
      userId: string;
      user: {
        name: string | null;
      };
    } | null;
  };
  currentUserId: string | null;
  partyId: string;
  dishName: string;
  unit: string;
}

export function ContributionItem({
  contribution,
  currentUserId,
  partyId,
  dishName,
  unit,
}: ContributionItemProps) {
  const isCurrentUserContribution = Boolean(
    currentUserId && contribution.participant?.userId === currentUserId
  );

  const participantName = contribution.participant?.user.name || 'Anonymous';
  const amount = contribution.amount || 0;

  return (
    <div
      className={`flex items-center justify-between text-sm bg-background/80 p-2.5 rounded-md ${
        isCurrentUserContribution ? 'border border-primary' : ''
      }`}
    >
      <span className="font-medium">
        {participantName}
        {isCurrentUserContribution && ' (You)'}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">
          {unit.toUpperCase() === 'QUANTITY'
            ? `${Math.ceil(amount)}`
            : `${amount.toFixed(1)} ${unit.toLowerCase()}`}
        </span>
        {isCurrentUserContribution && (
          <DeleteDishContributionDialog
            contributionId={contribution.id}
            partyId={partyId}
            dishName={dishName}
            amount={amount}
            unit={unit}
          />
        )}
      </div>
    </div>
  );
}
