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
import { useToast } from '@/hooks/use-toast';
import { LeavePartyDialog } from '@/components/leave-party-dialog';
import { UserPlus, UserCheck } from 'lucide-react';
import { GuestSelection } from '@/components/forms/guest-selection';

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
  const { toast } = useToast();
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [numGuests, setNumGuests] = useState(0);
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
          numGuests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join party');
      }

      toast({
        title: 'Success',
        description: 'Successfully joined the party!',
      });
      setIsJoinDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to join party',
        variant: 'destructive',
      });
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
      <Button
        onClick={() => setIsJoinDialogOpen(true)}
        className="self-start px-4 gap-2"
      >
        <UserPlus className="h-4 w-4" />
        Join Party
      </Button>

      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <UserCheck className="h-5 w-5 text-primary" />
              Join {partyName}
            </DialogTitle>
            <DialogDescription className="pt-1.5">
              You'll be registered as a participant. Please specify if you're
              bringing additional guests.
            </DialogDescription>
          </DialogHeader>

          <GuestSelection value={numGuests} onChange={setNumGuests} />

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsJoinDialogOpen(false)}
              disabled={isLoading}
              className="gap-1.5"
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
