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
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface DeletePartyDialogProps {
  partyId: string;
  partyName: string;
}

export function DeletePartyDialog({
  partyId,
  partyName,
}: DeletePartyDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/parties/${partyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete party');
      }

      toast.success('Party deleted successfully');
      router.push('/parties');
    } catch (error) {
      console.error('Error deleting party:', error);
      toast.error('Failed to delete party');
      setIsOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="h-9 w-9"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete party</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Party</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{partyName}&quot;? This action
            cannot be undone and will remove all associated data including
            participants and contributions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Party'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </ScrollArea>
      </AlertDialogContent>
    </AlertDialog>
  );
}
