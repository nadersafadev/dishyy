'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/forms/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LeavePartyDialog } from '@/components/leave-party-dialog';

interface PartyActionsProps {
  partyId: string;
  isParticipant: boolean;
  isFull: boolean;
  partyName?: string;
}

export function PartyActions({
  partyId,
  isParticipant,
  isFull,
  partyName = 'this party',
}: PartyActionsProps) {
  const router = useRouter();
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [numGuests, setNumGuests] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/parties/${partyId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numGuests: parseInt(numGuests, 10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join party');
      }

      toast.success('Successfully joined the party!');
      setIsJoinDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to join party'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isParticipant) {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setIsLeaveDialogOpen(true)}
          className="self-start"
        >
          Leave Party
        </Button>

        <LeavePartyDialog
          partyId={partyId}
          partyName={partyName}
          open={isLeaveDialogOpen}
          onOpenChange={setIsLeaveDialogOpen}
        />
      </>
    );
  }

  if (isFull) {
    return (
      <Button disabled className="self-start">
        Party is Full
      </Button>
    );
  }

  return (
    <>
      <Button onClick={() => setIsJoinDialogOpen(true)} className="self-start">
        Join Party
      </Button>

      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Party</DialogTitle>
            <DialogDescription>
              How many additional people are you bringing with you? You are
              already counted as a participant, so only include others who will
              join you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="guests">Number of Additional Guests</Label>
              <Input
                id="guests"
                type="number"
                min="0"
                value={numGuests}
                onChange={e => setNumGuests(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter 0 if you're coming alone. This number does not include
                you.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsJoinDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleJoin} disabled={isLoading}>
              {isLoading ? 'Joining...' : 'Join Party'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
