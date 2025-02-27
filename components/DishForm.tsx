'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Dish } from '@/lib/types';
import { Unit, unitLabels } from '@/lib/types';

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
import { ImageUpload } from '@/components/ui/image-upload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(1, 'Dish name is required'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  unit: z.nativeEnum(Unit),
});

type FormData = z.infer<typeof formSchema>;

interface DishFormProps {
  dish?: Dish;
}

export function DishForm({ dish }: DishFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: dish?.name || '',
      description: dish?.description || '',
      imageUrl: dish?.imageUrl || '',
      unit: dish?.unit || Unit.QUANTITY,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      setSuccess(false);

      const response = await fetch(
        dish ? `/api/dishes/${dish.id}` : '/api/dishes',
        {
          method: dish ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        setSuccess(true);
        if (!dish) {
          form.reset();
        }
        router.refresh();
      } else {
        setError(responseData.error || 'Failed to save dish');
      }
    } catch (error) {
      console.error('Error saving dish:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 text-sm text-primary bg-primary/10 rounded-lg">
          {dish ? 'Dish updated successfully!' : 'Dish created successfully!'}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dish Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter dish name"
                    {...field}
                    className="border-input bg-background focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter dish description"
                    {...field}
                    className="border-input bg-background focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    onRemove={() => field.onChange('')}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(unitLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? dish
                  ? 'Updating...'
                  : 'Creating...'
                : dish
                  ? 'Update Dish'
                  : 'Create Dish'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
