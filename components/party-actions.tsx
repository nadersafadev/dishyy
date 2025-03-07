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
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { LeavePartyDialog } from '@/components/leave-party-dialog';
import { UserPlus, UserCheck, Clock } from 'lucide-react';
import { GuestSelection } from '@/components/forms/guest-selection';
import { usePartyPrivacyStore } from '@/store/partyPrivacyStore';
import { JoinRequestStatus } from '@prisma/client';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PartyActionsProps {
  partyId: string;
  isParticipant: boolean;
  isFull: boolean;
  partyName?: string;
  isAdmin?: boolean;
  maxParticipants?: number | null;
  currentParticipants?: number;
}

export function PartyActions({
  partyId,
  isParticipant,
  isFull,
  partyName = 'this party',
  isAdmin = false,
  maxParticipants,
  currentParticipants = 0,
}: PartyActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [numGuests, setNumGuests] = useState(0);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { getPartyAccess, addJoinRequest, getPartyJoinRequests } =
    usePartyPrivacyStore();
  const access = getPartyAccess(partyId);
  const joinRequests = getPartyJoinRequests(partyId);
  const hasPendingRequest = joinRequests.some(
    request => request.status === JoinRequestStatus.PENDING
  );

  const handleJoin = async () => {
    try {
      setIsLoading(true);

      // If user is admin, they can join directly regardless of privacy settings
      if (isAdmin) {
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
        return;
      }

      if (!access.canJoinDirectly) {
        // Submit join request to API
        const response = await fetch(`/api/parties/${partyId}/join-request`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message.trim() || undefined,
            numGuests,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to submit join request');
        }

        // Add to local store after successful API call
        addJoinRequest(data.data);

        toast({
          title: 'Success',
          description:
            data.message ||
            'Your request to join has been submitted to the host.',
        });
        setIsJoinDialogOpen(false);
        setMessage('');
        setNumGuests(0);
        return;
      }

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

  if (hasPendingRequest) {
    return (
      <Button disabled className="self-start gap-2">
        <Clock className="h-4 w-4" />
        Request Pending
      </Button>
    );
  }

  const joinButtonText =
    isAdmin || access.canJoinDirectly ? 'Join Party' : 'Request to Join';
  const JoinIcon = isAdmin || access.canJoinDirectly ? UserPlus : Clock;

  return (
    <>
      <Button
        onClick={() => setIsJoinDialogOpen(true)}
        className="self-start px-4 gap-2"
      >
        <JoinIcon className="h-4 w-4" />
        {joinButtonText}
      </Button>

      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <UserCheck className="h-5 w-5 text-primary" />
              {isAdmin || access.canJoinDirectly
                ? `Join ${partyName}`
                : `Request to Join ${partyName}`}
            </DialogTitle>
            <DialogDescription className="pt-1.5">
              {isAdmin || access.canJoinDirectly
                ? "You'll be registered as a participant. Please specify if you're bringing additional guests."
                : 'Your request will be sent to the host for approval.'}
            </DialogDescription>
          </DialogHeader>

          {isAdmin || access.canJoinDirectly ? (
            <GuestSelection
              value={numGuests}
              onChange={setNumGuests}
              maxGuests={maxParticipants ?? undefined}
              currentGuests={currentParticipants}
            />
          ) : (
            <div className="grid gap-4 py-4">
              <GuestSelection
                value={numGuests}
                onChange={setNumGuests}
                maxGuests={maxParticipants ?? undefined}
                currentGuests={currentParticipants}
              />
              <div className="grid gap-2">
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a message to your join request..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsJoinDialogOpen(false);
                setMessage('');
              }}
              disabled={isLoading}
              className="gap-1.5"
            >
              Cancel
            </Button>
            <Button onClick={handleJoin} disabled={isLoading}>
              {isLoading
                ? 'Processing...'
                : isAdmin || access.canJoinDirectly
                  ? 'Join Party'
                  : 'Submit Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
