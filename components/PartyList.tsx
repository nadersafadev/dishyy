import type React from 'react';
import type { Party, PartyDish, PartyParticipant } from '@prisma/client';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { UsersIcon } from 'lucide-react';
import Link from 'next/link';

interface PartyWithDetails extends Party {
  participants: PartyParticipant[];
  dishes: (PartyDish & {
    dish: {
      name: string;
      unit: string;
    };
  })[];
}

interface PartyListProps {
  parties: PartyWithDetails[];
  view?: 'grid' | 'list';
}

const PartyList: React.FC<PartyListProps> = ({ parties, view = 'grid' }) => {
  if (parties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No dish parties available yet.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        view === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      )}
    >
      {parties.map(party => {
        const totalParticipants = party.participants.reduce(
          (sum, p) => sum + 1 + p.numGuests,
          0
        );
        const hasMaxParticipants = party.maxParticipants !== null;
        const isFull =
          hasMaxParticipants && totalParticipants >= party.maxParticipants;

        return (
          <Link
            key={party.id}
            href={`/parties/${party.id}`}
            className="block group"
          >
            <div
              className={cn(
                'card p-4 sm:p-6 hover:border-primary hover-transition',
                view === 'list' &&
                  'flex flex-col sm:flex-row sm:items-center justify-between gap-4'
              )}
            >
              <div className={cn('space-y-3', view === 'list' && 'flex-1')}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {party.name}
                    </h3>
                    <Badge variant={isFull ? 'destructive' : 'secondary'}>
                      <UsersIcon className="w-3 h-3 mr-1" />
                      {totalParticipants}
                      {hasMaxParticipants && ` / ${party.maxParticipants}`}
                    </Badge>
                  </div>
                  <p
                    className={cn(
                      'text-muted-foreground',
                      view === 'grid'
                        ? 'line-clamp-2'
                        : 'line-clamp-2 sm:line-clamp-1'
                    )}
                  >
                    {party.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {party.dishes.map(partyDish => (
                    <Badge
                      key={partyDish.dishId}
                      variant="outline"
                      className="text-xs"
                    >
                      {partyDish.dish.name}
                      <span className="ml-1 text-muted-foreground">
                        ({partyDish.amountPerPerson} {partyDish.dish.unit})
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>

              <div
                className={cn(
                  'flex items-center gap-4',
                  view === 'grid'
                    ? 'mt-4 justify-between'
                    : 'mt-4 sm:mt-0 justify-between sm:justify-end sm:gap-6 shrink-0'
                )}
              >
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(party.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <span className="text-sm text-primary group-hover:text-primary/80 hover-transition font-medium whitespace-nowrap">
                  View Details →
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PartyList;
