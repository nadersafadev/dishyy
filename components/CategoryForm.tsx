'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import * as z from 'zod';
import type { Category } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { FormTextField } from '@/components/forms/form-text-field';
import {
  FormSelectField,
  SortOption,
} from '@/components/forms/form-select-field';

const formSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  parentId: z
    .string()
    .optional()
    .nullable()
    .transform(val => (val === 'none' ? null : val)),
});

type FormData = z.infer<typeof formSchema>;

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          // Filter out the current category (if editing) and its children to prevent circular references
          const filteredData = category
            ? data.filter(
                (c: Category) =>
                  c.id !== category.id && c.parentId !== category.id
              )
            : data;
          setCategories(filteredData);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [category]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      parentId: category?.parentId || 'none',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch(
        category ? `/api/categories/${category.id}` : '/api/categories',
        {
          method: category ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        setSuccess(true);
        if (!category) {
          form.reset();
        }
        router.refresh();
        // Redirect after successful creation or update
        setTimeout(() => {
          router.push('/categories');
        }, 1500);
      } else {
        setError(responseData.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
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
          {category
            ? 'Category updated successfully!'
            : 'Category created successfully!'}
        </div>
      )}

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormTextField
            name="name"
            label="Category Name"
            placeholder="Enter category name"
            disabled={form.formState.isSubmitting}
          />

          <FormTextField
            name="description"
            label="Description"
            placeholder="Enter category description"
            optional
            disabled={form.formState.isSubmitting}
          />

          <div className="space-y-2">
            <label htmlFor="parentId" className="text-sm font-medium">
              Parent Category{' '}
              <span className="text-sm text-muted-foreground">(Optional)</span>
            </label>
            <select
              id="parentId"
              {...form.register('parentId')}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled={form.formState.isSubmitting}
            >
              <option value="none">No parent category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {form.formState.errors.parentId && (
              <p className="text-xs text-destructive">
                {form.formState.errors.parentId.message}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/categories')}
              className="flex-1"
              disabled={form.formState.isSubmitting || loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={form.formState.isSubmitting || loading}
            >
              {form.formState.isSubmitting || loading
                ? category
                  ? 'Updating...'
                  : 'Creating...'
                : category
                  ? 'Update Category'
                  : 'Create Category'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
