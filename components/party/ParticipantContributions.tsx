'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DeleteDishContributionDialog } from '@/components/delete-dish-contribution-dialog';
import { ParticipantWithContributions } from '@/lib/services/dish';

interface ParticipantContributionsProps {
  participants: ParticipantWithContributions[];
  isParticipant: boolean;
  currentUserId?: string;
  partyId: string;
}

export function ParticipantContributions({
  participants,
  isParticipant,
  currentUserId,
  partyId,
}: ParticipantContributionsProps) {
  // Get current user's contributions
  const currentUser = participants.find(p => p.userId === currentUserId);
  const contributions =
    currentUser?.contributions.map(contribution => ({
      id: contribution.id,
      dishName: contribution.dish.name,
      amount: contribution.amount,
      unit: contribution.dish.unit,
    })) || [];

  const handleContributeClick = () => {
    // Scroll to dishes section
    const dishesSection = document.querySelector('[data-dishes-section]');
    if (dishesSection) {
      dishesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium">Your Contributions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            See what you're bringing to the party
          </p>
        </div>
        {isParticipant && (
          <Button onClick={handleContributeClick}>Contribute</Button>
        )}
      </div>

      <div className="space-y-4">
        {contributions.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Your dishes</h3>
              <Badge variant="secondary" className="text-xs">
                {contributions.length} contribution
                {contributions.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="space-y-2">
              {contributions.map(contribution => (
                <div
                  key={contribution.id}
                  className="text-sm flex items-center justify-between bg-muted/50 px-3 py-2 rounded-md"
                >
                  <span className="text-muted-foreground">
                    {contribution.dishName}
                  </span>
                  <div className="flex items-center gap-3">
                    <span>
                      {contribution.unit === 'QUANTITY'
                        ? Math.ceil(contribution.amount)
                        : contribution.amount.toFixed(1)}{' '}
                      {contribution.unit.toLowerCase()}
                    </span>
                    <DeleteDishContributionDialog
                      contributionId={contribution.id}
                      partyId={partyId}
                      dishName={contribution.dishName}
                      amount={contribution.amount}
                      unit={contribution.unit}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">You haven't contributed yet</p>
            {isParticipant && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleContributeClick}
              >
                Start Contributing
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
