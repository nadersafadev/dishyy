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
import { useToast } from '@/hooks/use-toast';
import { LeavePartyDialog } from '@/components/leave-party-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserPlus, Users, UserCheck, ArrowRight, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [bringingGuests, setBringingGuests] = useState<'yes' | 'no'>('no');
  const [numGuests, setNumGuests] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    try {
      setIsLoading(true);
      const guestsToSend =
        bringingGuests === 'yes' ? parseInt(numGuests, 10) : 0;

      const response = await fetch(`/api/parties/${partyId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numGuests: guestsToSend,
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

          <div className="space-y-6 py-5">
            <div className="space-y-3">
              <Label htmlFor="bring-guests" className="text-base font-medium">
                Will you bring additional guests?
              </Label>

              <RadioGroup
                id="bring-guests"
                value={bringingGuests}
                onValueChange={value => {
                  setBringingGuests(value as 'yes' | 'no');
                  if (value === 'yes' && numGuests === '0') {
                    setNumGuests('1');
                  }
                }}
                className="flex flex-col gap-3 mt-2"
              >
                <div
                  className={cn(
                    'flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors',
                    bringingGuests === 'no'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-muted-foreground/30'
                  )}
                  onClick={() => setBringingGuests('no')}
                >
                  <RadioGroupItem value="no" id="no-guests" className="mr-3" />
                  <Label
                    htmlFor="no-guests"
                    className="cursor-pointer flex items-center gap-2 font-medium"
                  >
                    <User
                      className={cn(
                        'h-4 w-4',
                        bringingGuests === 'no'
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      )}
                    />
                    No, just me
                  </Label>
                </div>

                <div
                  className={cn(
                    'flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors',
                    bringingGuests === 'yes'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-muted-foreground/30'
                  )}
                  onClick={() => setBringingGuests('yes')}
                >
                  <RadioGroupItem
                    value="yes"
                    id="yes-guests"
                    className="mr-3"
                  />
                  <Label
                    htmlFor="yes-guests"
                    className="cursor-pointer flex items-center gap-2 font-medium"
                  >
                    <Users
                      className={cn(
                        'h-4 w-4',
                        bringingGuests === 'yes'
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      )}
                    />
                    Yes, I'll bring additional people
                  </Label>
                </div>
              </RadioGroup>

              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5" />
                <strong>Note:</strong> You are the participant and not counted
                as a guest.
              </p>
            </div>

            {bringingGuests === 'yes' && (
              <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-5 duration-300">
                <Label htmlFor="guests" className="text-base font-medium">
                  How many additional guests?
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    value={numGuests}
                    onChange={e =>
                      setNumGuests(
                        e.target.value === '0' ? '1' : e.target.value
                      )
                    }
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  This number is only for additional people coming with you.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsJoinDialogOpen(false)}
              disabled={isLoading}
              className="gap-1.5"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleJoin}
              disabled={isLoading}
              className="gap-1.5 min-w-[120px]"
            >
              {isLoading ? (
                'Joining...'
              ) : (
                <>
                  Join Party
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
