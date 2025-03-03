'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface RemoveParticipantButtonProps {
  partyId: string;
  participantId: string;
  participantName: string;
}

export function RemoveParticipantButton({
  partyId,
  participantId,
  participantName,
}: RemoveParticipantButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      const response = await fetch(
        `/api/parties/${partyId}/participants/${participantId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove participant');
      }

      toast({
        title: 'Success',
        description: `${participantName} has been removed from the party`,
      });
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error('Error removing participant:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove participant',
        variant: 'destructive',
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-destructive"
          disabled={isRemoving}
        >
          <UserX className="h-4 w-4" />
          <span className="sr-only">Remove participant</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Participant</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove {participantName} from this party?
            Their contributions will also be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? 'Removing...' : 'Remove Participant'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </ScrollArea>
      </AlertDialogContent>
    </AlertDialog>
  );
}
