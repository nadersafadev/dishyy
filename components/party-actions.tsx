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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface PartyActionsProps {
  partyId: string;
  isParticipant: boolean;
  isFull: boolean;
}

export function PartyActions({
  partyId,
  isParticipant,
  isFull,
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

  const handleLeave = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/parties/${partyId}/leave`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to leave party');
      }

      toast.success('Successfully left the party');
      setIsLeaveDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to leave party'
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

        <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Leave Party</DialogTitle>
              <DialogDescription>
                Are you sure you want to leave this party? You can always join
                again later if there&apos;s still space.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsLeaveDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleLeave}
                disabled={isLoading}
              >
                {isLoading ? 'Leaving...' : 'Leave Party'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              Enter the number of additional guests you&apos;ll be bringing (not
              including yourself).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="guests">Number of Guests</Label>
              <Input
                id="guests"
                type="number"
                min="0"
                value={numGuests}
                onChange={e => setNumGuests(e.target.value)}
              />
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
