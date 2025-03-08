'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Party,
  PartyDish,
  PartyParticipant,
  Dish,
  Privacy,
} from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Globe, Lock, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FormTextField } from '@/components/forms/form-text-field';
import { FormNumberField } from '@/components/forms/form-number-field';
import { FormDateField } from '@/components/forms/form-date-field';
import { FormRadioField } from '@/components/forms/form-radio-field';
import { toast } from '@/lib/toast';

const formSchema = z.object({
  name: z.string().min(1, 'Party name is required'),
  description: z.string().optional(),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date',
  }),
  maxParticipants: z.number().min(1).nullable(),
  privacy: z.nativeEnum(Privacy).default(Privacy.PUBLIC),
});

interface PartyWithDetails extends Party {
  privacy: Privacy;
  dishes: (PartyDish & {
    dish: {
      name: string;
      unit: string;
    };
  })[];
  participants: (PartyParticipant & {
    user: {
      name: string;
    };
  })[];
}

interface EditPartyFormProps {
  party: PartyWithDetails;
  onClose: () => void;
}

export function EditPartyForm({ party, onClose }: EditPartyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDishId, setSelectedDishId] = useState('');
  const [amountPerPerson, setAmountPerPerson] = useState('');
  const [isAddDishDialogOpen, setIsAddDishDialogOpen] = useState(false);
  const [partyDishes, setPartyDishes] = useState<PartyWithDetails['dishes']>(
    party.dishes
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: party.name,
      description: party.description ?? '',
      date: party.date.toISOString().split('T')[0],
      maxParticipants: party.maxParticipants ?? null,
      privacy: party.privacy as Privacy,
    },
  });

  useEffect(() => {
    // Fetch available dishes
    fetch('/api/dishes')
      .then(res => res.json())
      .then(data => setDishes(data.dishes))
      .catch(error => console.error('Error fetching dishes:', error));
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      console.log('Submitting form values:', values);

      const response = await fetch(`/api/parties/${party.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          date: new Date(values.date).toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        throw new Error(errorData.error || 'Failed to update party');
      }

      toast.success('Success', 'Party updated successfully');
      router.refresh();
      onClose();
    } catch (error) {
      console.error('Error updating party:', error);
      toast.error(
        'Error',
        error instanceof Error ? error.message : 'Failed to update party'
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddDish = async () => {
    if (!selectedDishId || !amountPerPerson) {
      toast.error(
        'Error',
        'Please select a dish and specify amount per person'
      );
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/parties/${party.id}/dishes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dishId: selectedDishId,
          amountPerPerson: parseFloat(amountPerPerson),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add dish');
      }

      const newPartyDish = await response.json();
      setPartyDishes(prev => [...prev, newPartyDish]);
      setIsAddDishDialogOpen(false);
      setSelectedDishId('');
      setAmountPerPerson('');
      toast.success('Success', 'Dish added successfully');
      router.refresh();
    } catch (error) {
      console.error('Error adding dish:', error);
      toast.error('Error', 'Failed to add dish');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDish = async (dishId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/parties/${party.id}/dishes/${dishId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove dish');
      }

      setPartyDishes(prev =>
        prev.filter(partyDish => partyDish.dishId !== dishId)
      );
      toast.success('Success', 'Dish removed successfully');
      router.refresh();
    } catch (error) {
      console.error('Error removing dish:', error);
      toast.error('Error', 'Failed to remove dish');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDishAmount = async (dishId: string, newAmount: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/parties/${party.id}/dishes/${dishId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amountPerPerson: parseFloat(newAmount),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update dish amount');
      }

      setPartyDishes(prev =>
        prev.map(partyDish =>
          partyDish.dishId === dishId
            ? { ...partyDish, amountPerPerson: parseFloat(newAmount) }
            : partyDish
        )
      );
      toast.success('Success', 'Dish amount updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating dish amount:', error);
      toast.error('Error', 'Failed to update dish amount');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormTextField
          name="name"
          label="Name"
          placeholder="Enter party name"
        />

        <FormTextField
          name="description"
          label="Description"
          placeholder="Describe your party"
          optional
        />

        <FormNumberField
          name="maxParticipants"
          label="Maximum Participants"
          placeholder="Leave empty for no limit"
          min={1}
          optional
        />

        <FormDateField name="date" label="Date" />

        <FormRadioField
          name="privacy"
          label="Privacy"
          options={[
            {
              value: Privacy.PUBLIC,
              label: 'Public',
              description: 'Anyone can view and join the party',
              icon: Globe,
            },
            {
              value: Privacy.CLOSED,
              label: 'Closed',
              description: 'Anyone can view, but joining requires approval',
              icon: Users,
            },
            {
              value: Privacy.PRIVATE,
              label: 'Private',
              description: 'Limited visibility, invitation only',
              icon: Lock,
            },
          ]}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Dishes</Label>
            <Dialog
              open={isAddDishDialogOpen}
              onOpenChange={setIsAddDishDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Dish
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Dish</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Dish</Label>
                    <select
                      className="w-full input-field"
                      value={selectedDishId}
                      onChange={e => setSelectedDishId(e.target.value)}
                    >
                      <option value="">Select a dish...</option>
                      {dishes
                        .filter(
                          dish =>
                            !partyDishes.some(
                              partyDish => partyDish.dishId === dish.id
                            )
                        )
                        .map(dish => (
                          <option key={dish.id} value={dish.id}>
                            {dish.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount Per Person</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={amountPerPerson}
                      onChange={e => setAmountPerPerson(e.target.value)}
                      placeholder="Enter amount per person"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDishDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAddDish}
                      disabled={isLoading}
                    >
                      Add Dish
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {partyDishes.map(partyDish => (
              <div
                key={partyDish.dishId}
                className="flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">
                      {partyDish.dish.name}
                    </span>
                    <Badge variant="outline" className="shrink-0">
                      {partyDish.dish.unit}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-24"
                    value={partyDish.amountPerPerson}
                    onChange={e =>
                      handleUpdateDishAmount(partyDish.dishId, e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveDish(partyDish.dishId)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
