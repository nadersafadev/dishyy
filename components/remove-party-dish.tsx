'use client';

import { useState } from 'react';
import { DeleteButton } from '@/components/ui/delete-button';
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
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface RemovePartyDishProps {
  partyId: string;
  dishId: string;
  dishName: string;
  isAdmin: boolean;
}

export function RemovePartyDish({
  partyId,
  dishId,
  dishName,
  isAdmin,
}: RemovePartyDishProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdmin) return null;

  const handleRemoveDish = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/parties/${partyId}/dishes/${dishId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove dish');
      }

      toast.success(`${dishName} removed from the party`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DeleteButton label={`Remove ${dishName}`} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Dish</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove {dishName} from this party? This
            will also remove all contributions related to this dish.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemoveDish}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Removing...' : 'Remove Dish'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
