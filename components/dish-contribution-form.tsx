'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { FormTextField } from '@/components/ui/form-text-field';

interface DishContributionFormProps {
  partyId: string;
  dishId: string;
  dishName: string;
  unit: string;
  remainingNeeded: number;
}

export function DishContributionForm({
  partyId,
  dishId,
  dishName,
  unit,
  remainingNeeded,
}: DishContributionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    amount: z
      .number()
      .positive('Amount must be positive')
      .max(
        remainingNeeded,
        `Cannot exceed ${remainingNeeded.toFixed(1)} ${unit.toLowerCase()}`
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/parties/${partyId}/contributions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dishId,
          amount: values.amount,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add contribution');
      }

      toast.success(
        `Successfully contributed ${values.amount.toFixed(
          1
        )} ${unit.toLowerCase()} of ${dishName}`
      );
      form.reset();
      router.refresh();
    } catch (error) {
      console.error('Error adding contribution:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to add contribution'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 mt-2">
        <div className="flex-1 min-h-[60px] flex flex-col">
          <FormTextField
            name="amount"
            label=""
            type="number"
            placeholder={`Amount in ${unit.toLowerCase()} (max: ${remainingNeeded.toFixed(
              1
            )})`}
            min={0.1}
            step="0.1"
            className="[&_input]:h-10 [&_input]:m-0"
          />
        </div>
        <div className="flex items-start pt-[6px]">
          <Button
            type="submit"
            variant="secondary"
            disabled={isSubmitting}
            size="default"
            className="h-10 px-4"
          >
            {isSubmitting ? 'Contributing...' : 'Contribute'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
