'use client';

import Link from 'next/link';
import { DataPagination } from '@/components/ui/DataPagination';
import { Button } from '@/components/ui/button';
import { DishCard } from './DishCard';

interface DishWithRelations {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  unit: string;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  _count: {
    parties: number;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface DishesGridProps {
  dishes: DishWithRelations[];
  pagination: PaginationMeta;
  sortBy: string;
  sortOrder: string;
}

export function DishesGrid({
  dishes,
  pagination,
  sortBy,
  sortOrder,
}: DishesGridProps) {
  const createPageURL = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    return `?${params.toString()}`;
  };

  if (dishes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No dishes available.</p>
        <Button asChild className="mt-4">
          <Link href="/dishes/new">Create Your First Dish</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dishes.map(dish => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>

      <DataPagination
        pagination={pagination}
        itemName="dishes"
        baseUrl=""
        onPageChange={page => {
          const url = createPageURL(page);
          window.location.href = url;
        }}
      />
    </div>
  );
}
