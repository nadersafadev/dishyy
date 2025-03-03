import { useState } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { FormTextField } from '@/components/forms/form-text-field';
import { FormNumberField } from '@/components/forms/form-number-field';
import { useToast } from '@/hooks/use-toast';

interface AddPartyDishDialogProps {
  partyId: string;
}

const formSchema = z.object({
  dishId: z.string().min(1, 'Please select a dish'),
  amountPerPerson: z.number().min(0.01, 'Amount must be greater than 0'),
});

export function AddPartyDishDialog({ partyId }: AddPartyDishDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dishes, setDishes] = useState<{ id: string; name: string }[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [numberOfParticipants, setNumberOfParticipants] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dishId: '',
      amountPerPerson: undefined,
    },
  });

  // Fetch available dishes when dialog opens
  const fetchDishes = async () => {
    try {
      const response = await fetch('/api/dishes?page=1&limit=20');
      if (!response.ok) throw new Error('Failed to fetch dishes');
      const data = await response.json();
      setDishes(data.dishes || []); // Use data.dishes if available, otherwise empty array
    } catch (error) {
      console.error('Error fetching dishes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dishes',
        variant: 'destructive',
      });
      setDishes([]); // Set empty array on error
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/parties/${partyId}/dishes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add dish');
      }

      toast({
        title: 'Success',
        description: 'Dish added to party successfully',
      });
      setIsOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error('Error adding dish:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to add dish',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open);
        if (open) fetchDishes();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Plus className="h-4 w-4 mr-2" />
          Add Dish
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Dish to Party</DialogTitle>
          <DialogDescription>
            Select a dish and specify the amount needed per person.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <select
                {...form.register('dishId')}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select a dish...</option>
                {Array.isArray(dishes) &&
                  dishes.map(dish => (
                    <option key={dish.id} value={dish.id}>
                      {dish.name}
                    </option>
                  ))}
              </select>
              <FormNumberField
                name="amountPerPerson"
                label="Amount per person"
                step="0.01"
                onChange={value => {
                  if (value !== undefined) {
                    const formattedValue = value.toFixed(1);
                    const newTotal =
                      Number(formattedValue) * numberOfParticipants;
                    setTotalAmount(newTotal);
                  } else {
                    setTotalAmount(0);
                  }
                }}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Dish'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
