'use client';

import { FormNumberField } from '@/components/forms/form-number-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from '@/lib/toast';
import * as z from 'zod';

interface DishContributionFormProps {
  partyId: string;
  dishId: string;
  dishName: string;
  unit: string;
  remainingNeeded: number;
  isEdit?: boolean;
  contributionId?: string;
  initialAmount?: number;
}

export function DishContributionForm({
  partyId,
  dishId,
  dishName,
  unit,
  remainingNeeded,
  isEdit = false,
  contributionId,
  initialAmount = 0,
}: DishContributionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isQuantityUnit = ['QUANTITY', 'PIECES'].includes(unit);
  const maxAmount = isQuantityUnit
    ? Math.ceil(remainingNeeded)
    : remainingNeeded;

  const formSchema = z.object({
    amount: z
      .number()
      .positive('Amount must be positive')
      .max(
        maxAmount,
        isQuantityUnit
          ? `Cannot exceed ${maxAmount}`
          : `Cannot exceed ${remainingNeeded.toFixed(1)} ${unit.toLowerCase()}`
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: isEdit ? initialAmount : undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      let response;

      if (isEdit && contributionId) {
        // Update existing contribution
        response = await fetch(
          `/api/parties/${partyId}/contributions/${contributionId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: values.amount,
            }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update contribution');
        }

        toast.success(
          'Success',
          `Successfully updated contribution to ${
            unit === 'QUANTITY'
              ? `${Math.ceil(values.amount)}`
              : `${values.amount.toFixed(1)} ${unit.toLowerCase()}`
          } of ${dishName}`
        );
      } else {
        // Add new contribution
        response = await fetch(`/api/parties/${partyId}/contributions`, {
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
          'Success',
          `Successfully contributed ${
            unit === 'QUANTITY'
              ? `${Math.ceil(values.amount)}`
              : `${values.amount.toFixed(1)} ${unit.toLowerCase()}`
          } of ${dishName}`
        );
      }

      form.reset();
      router.refresh();
    } catch (error) {
      console.error('Error with contribution:', error);
      toast.error(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to process contribution'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 mt-2">
        <div className="flex-1 min-h-[60px] flex flex-col">
          <FormNumberField
            name="amount"
            label=""
            placeholder={`${
              isQuantityUnit
                ? 'Amount in QTY'
                : `Amount in ${unit.toLowerCase()}`
            } (max: ${
              isQuantityUnit
                ? maxAmount
                : `${remainingNeeded.toFixed(1)} ${unit.toLowerCase()}`
            })`}
            step={isQuantityUnit ? '1' : '0.01'}
            max={maxAmount}
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
            {isSubmitting
              ? isEdit
                ? 'Updating...'
                : 'Contributing...'
              : isEdit
                ? 'Update'
                : 'Contribute'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
