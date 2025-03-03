'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EditButton } from '@/components/ui/edit-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/forms/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Unit, unitLabels } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface UpdateDishQuantityProps {
  partyId: string;
  dishId: string;
  dishName: string;
  unit: Unit;
  currentAmount: number;
  isAdmin: boolean;
}

export function UpdateDishQuantity({
  partyId,
  dishId,
  dishName,
  unit,
  currentAmount,
  isAdmin,
}: UpdateDishQuantityProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(currentAmount.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAdmin) return null;

  const handleUpdate = async () => {
    setError('');

    // Validate input
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setError(`Please enter a valid positive number for the amount.`);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/parties/${partyId}/dishes/${dishId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amountPerPerson: amountNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update dish quantity');
      }

      toast({
        title: 'Success',
        description: `Updated ${dishName} quantity to ${amountNumber} ${unitLabels[unit].toLowerCase()} per person`,
      });
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
      toast({
        title: 'Error',
        description: error.message || 'Failed to update dish quantity',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <EditButton label={`Edit ${dishName} quantity`} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Dish Quantity</DialogTitle>
          <DialogDescription>
            Adjust the amount of {dishName} needed per person for this party.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount per person ({unitLabels[unit].toLowerCase()})
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder={`Amount in ${unitLabels[unit].toLowerCase()}`}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Quantity'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
