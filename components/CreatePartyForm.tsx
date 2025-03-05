'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Unit, unitLabels, type Dish } from '@/lib/types';
import { Privacy } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormTextField } from '@/components/forms/form-text-field';
import { FormDateField } from '@/components/forms/form-date-field';
import { FormNumberField } from '@/components/forms/form-number-field';
import { FormDishSelect } from '@/components/forms/form-dish-select';
import { DishAmountField } from '@/components/forms/dish-amount-field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  date: z.date({
    required_error: 'Please select a date',
  }),
  dishIds: z.array(z.string()).min(1, 'At least one dish is required'),
  maxParticipants: z.number().positive().optional(),
  privacy: z.nativeEnum(Privacy).default(Privacy.PUBLIC),
  dishAmounts: z.record(
    z.string(),
    z.number().positive('Amount must be greater than 0')
  ),
});

type FormData = z.infer<typeof formSchema>;

const CreatePartyForm: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState<Dish[]>([]);
  const [dishAmounts, setDishAmounts] = useState<Record<string, number>>({});

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      dishIds: [],
      maxParticipants: undefined,
      privacy: Privacy.PUBLIC,
      dishAmounts: {},
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      setSuccess(false);

      const response = await fetch('/api/parties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          date: data.date.toISOString(),
          maxParticipants: data.maxParticipants
            ? Number(data.maxParticipants)
            : undefined,
          dishes: data.dishIds.map(dishId => ({
            dishId,
            amountPerPerson: data.dishAmounts[dishId],
          })),
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess(true);
        form.reset();
        setSelectedDishes([]);
        setDishAmounts({});
        router.refresh();
      } else {
        setError(responseData.error || 'Failed to create party');
      }
    } catch (error) {
      console.error('Error creating party:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleSelectDish = (dish: Dish) => {
    const currentDishIds = form.getValues('dishIds');
    if (!currentDishIds.includes(dish.id)) {
      form.setValue('dishIds', [...currentDishIds, dish.id]);
      setSelectedDishes([...selectedDishes, dish]);
      // Set default amount of 1 for the new dish
      const currentAmounts = form.getValues('dishAmounts');
      form.setValue('dishAmounts', { ...currentAmounts, [dish.id]: 1 });
      setDishAmounts(prev => ({ ...prev, [dish.id]: 1 }));
    }
  };

  const handleRemoveDish = (dishId: string) => {
    const currentDishIds = form.getValues('dishIds');
    form.setValue(
      'dishIds',
      currentDishIds.filter(id => id !== dishId)
    );
    setSelectedDishes(selectedDishes.filter(dish => dish.id !== dishId));
    // Remove amount for the removed dish
    const currentAmounts = form.getValues('dishAmounts');
    const { [dishId]: _, ...newAmounts } = currentAmounts;
    form.setValue('dishAmounts', newAmounts);
    const { [dishId]: __, ...newDishAmounts } = dishAmounts;
    setDishAmounts(newDishAmounts);
  };

  const handleAmountChange = (dishId: string, amount: string) => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      const currentAmounts = form.getValues('dishAmounts');
      form.setValue('dishAmounts', {
        ...currentAmounts,
        [dishId]: numericAmount,
      });
      setDishAmounts(prev => ({ ...prev, [dishId]: numericAmount }));
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-primary/10 text-primary rounded-lg text-sm">
          Party created successfully!
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormTextField
            name="name"
            label="Party Name"
            placeholder="Enter party name"
          />

          <FormTextField
            name="description"
            label="Description"
            placeholder="Describe your dish party"
            optional
          />

          <FormNumberField
            name="maxParticipants"
            label="Maximum Participants"
            placeholder="Enter maximum number of participants"
            min={1}
            optional
          />

          <FormDateField name="date" label="Date" placeholder="Pick a date" />

          <div className="space-y-2">
            <Label>Privacy</Label>
            <RadioGroup
              defaultValue={Privacy.PUBLIC}
              onValueChange={value =>
                form.setValue('privacy', value as Privacy)
              }
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Privacy.PUBLIC} id="public" />
                <Label htmlFor="public">
                  Public - Anyone can view and join
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Privacy.PRIVATE} id="private" />
                <Label htmlFor="private">
                  Private - Only invited users can join
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Privacy.CLOSED} id="closed" />
                <Label htmlFor="closed">Closed - No one can join</Label>
              </div>
            </RadioGroup>
          </div>

          <FormDishSelect
            name="dishIds"
            label="Dishes"
            selectedDishes={selectedDishes}
            onSelectDish={handleSelectDish}
            showCreateOption={true}
          />

          {selectedDishes.length > 0 && (
            <div className="space-y-4">
              {selectedDishes.map(dish => (
                <DishAmountField
                  key={dish.id}
                  dish={dish}
                  amount={dishAmounts[dish.id] || ''}
                  onAmountChange={handleAmountChange}
                  onRemove={handleRemoveDish}
                />
              ))}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Creating...' : 'Create Party'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreatePartyForm;
