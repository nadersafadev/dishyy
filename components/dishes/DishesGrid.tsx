'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DishCard } from './DishCard';
import { Unit, DishWithRelations, PaginationMeta } from '@/lib/types';
import { BaseEntityGridProps } from '@/lib/types/entity';
import { EntityGrid } from '@/components/ui/entity-grid';

export function DishesGrid({
  data,
  pagination,
  sortBy,
  sortOrder,
  baseUrl = '',
}: BaseEntityGridProps<DishWithRelations>) {
  if (data.length === 0) {
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
    <EntityGrid
      data={data}
      pagination={pagination}
      sortBy={sortBy}
      sortOrder={sortOrder}
      baseUrl={baseUrl}
      renderCard={dish => <DishCard key={dish.id} dish={dish} />}
    />
  );
}
