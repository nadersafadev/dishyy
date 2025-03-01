'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircleIcon } from 'lucide-react';
import type { Category } from '@/lib/types';

export default function DeleteCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dishesCount, setDishesCount] = useState(0);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await fetch(`/api/categories/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch category');
        }
        const data = await response.json();
        setCategory(data);
        setDishesCount(data._count?.dishes || 0);
      } catch (error) {
        console.error('Error fetching category:', error);
        setError('Failed to load category');
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError(null);

      const response = await fetch(`/api/categories/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete category');
      }

      router.push('/categories');
      router.refresh();
    } catch (error) {
      console.error('Error deleting category:', error);
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">Category not found</p>
          <Button asChild>
            <Link href="/categories">Return to Categories</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <Card className="border-destructive/30">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircleIcon className="h-5 w-5" /> Delete Category
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-4">
            Are you sure you want to delete <strong>{category.name}</strong>?
          </p>

          {dishesCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
              <p className="text-amber-800 font-medium">Warning</p>
              <p className="text-amber-700 text-sm mt-1">
                This category has {dishesCount}{' '}
                {dishesCount === 1 ? 'dish' : 'dishes'} associated with it.
                Deleting this category will remove the connection to these
                dishes.
              </p>
            </div>
          )}

          {category.parentId === null && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <p className="text-blue-800 font-medium">Note</p>
              <p className="text-blue-700 text-sm mt-1">
                This is a parent category. Any child categories will be
                disconnected from this parent.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/categories')}
            className="flex-1"
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex-1"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Category'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
