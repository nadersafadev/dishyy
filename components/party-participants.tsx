'use client';

import { Badge } from '@/components/ui/badge';
import { RemoveParticipantButton } from '@/components/remove-participant-button';
import { PartyParticipant } from '@prisma/client';

interface PartyParticipantsProps {
  participants: (PartyParticipant & {
    user: {
      name: string;
    };
  })[];
  isAdmin: boolean;
  partyId: string;
}

export function PartyParticipants({
  participants,
  isAdmin,
  partyId,
}: PartyParticipantsProps) {
  return (
    <div className="card p-6 space-y-4 shadow-sm border">
      <h2 className="text-lg font-medium">Participants</h2>
      <div className="space-y-3">
        {participants.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No participants yet. Be the first to join!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {participants.map(participant => (
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
                      partyId={partyId}
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
  );
}
