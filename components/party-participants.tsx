'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { RemoveParticipantButton } from '@/components/remove-participant-button';
import { PartyParticipant } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { PencilIcon, SaveIcon, XIcon } from 'lucide-react';
import { Input } from '@/components/forms/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface PartyParticipantsProps {
  participants: (PartyParticipant & {
    user: {
      name: string;
    };
  })[];
  isAdmin: boolean;
  partyId: string;
  currentUserId?: string;
}

export function PartyParticipants({
  participants,
  isAdmin,
  partyId,
  currentUserId,
}: PartyParticipantsProps) {
  const router = useRouter();
  const [editingGuests, setEditingGuests] = useState(false);
  const [numGuests, setNumGuests] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Find current user's participant information
  const currentUserParticipant = participants.find(
    p => p.userId === currentUserId
  );

  // Initialize numGuests with the current number if the user is a participant
  if (currentUserParticipant && numGuests === null) {
    setNumGuests(currentUserParticipant.numGuests);
  }

  // Sort participants to put current user at the top
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.userId === currentUserId) return -1;
    if (b.userId === currentUserId) return 1;
    return a.user.name.localeCompare(b.user.name);
  });

  const handleUpdateGuests = async () => {
    if (!currentUserParticipant || numGuests === null) return;

    try {
      setIsUpdating(true);
      const response = await fetch(
        `/api/parties/${partyId}/participants/${currentUserParticipant.id}/guests`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            numGuests: numGuests,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update guests');
      }

      toast.success('Successfully updated number of guests');
      setEditingGuests(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update guests'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingGuests(false);
    if (currentUserParticipant) {
      setNumGuests(currentUserParticipant.numGuests);
    }
  };

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
            {sortedParticipants.map(participant => {
              const isCurrentUser = participant.userId === currentUserId;
              return (
                <div
                  key={participant.id}
                  className={`flex items-center justify-between gap-4 rounded-lg ${
                    isCurrentUser
                      ? 'bg-primary/10 border border-primary/20 p-4'
                      : 'bg-muted/50 py-2 px-3'
                  }`}
                >
                  <span
                    className={`font-medium ${isCurrentUser ? 'text-base' : 'text-sm'}`}
                  >
                    {isCurrentUser ? 'You' : participant.user.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {isCurrentUser && editingGuests ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={numGuests?.toString() || '0'}
                          onChange={e =>
                            setNumGuests(parseInt(e.target.value, 10) || 0)
                          }
                          className="w-16 h-8"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleUpdateGuests}
                          disabled={isUpdating}
                          title="Save"
                        >
                          <SaveIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          title="Cancel"
                          className="hover:bg-destructive hover:text-white transition-colors"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        {participant.numGuests > 0 && (
                          <Badge
                            variant="secondary"
                            className={isCurrentUser ? '' : 'text-xs'}
                          >
                            +{participant.numGuests} guest
                            {participant.numGuests !== 1 && 's'}
                          </Badge>
                        )}
                        {isCurrentUser && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditingGuests(true)}
                            title="Edit guests"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                    {isAdmin && !isCurrentUser && (
                      <RemoveParticipantButton
                        partyId={partyId}
                        participantId={participant.id}
                        participantName={participant.user.name}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
