'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EntityTable } from '@/components/ui/entity-table';
import { EntityTableColumn } from '@/lib/types/entity';
import { ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Unit, Category, DishWithRelations, PaginationMeta } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { DishForm } from '@/components/DishForm';

interface DishesTableProps {
  dishes: DishWithRelations[];
  pagination: PaginationMeta;
  sortBy?: string;
  sortOrder?: string;
  isLoading?: boolean;
  selectable?: boolean;
  selectedDishes?: string[];
  onDishSelect?: (dishId: string) => void;
}

export function DishesTable({
  dishes,
  pagination,
  sortBy = 'name',
  sortOrder = 'asc',
  isLoading = false,
  selectable = false,
  selectedDishes = [],
  onDishSelect,
}: DishesTableProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div>
        <div className="rounded-md border overflow-hidden">
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-4">
                <Skeleton className="h-12 w-12" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (dishes.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No dishes available.</p>
        <Button asChild className="mt-4">
          <Link href="/dishes/new">Create Your First Dish</Link>
        </Button>
      </div>
    );
  }

  const handleCategoryClick = (e: React.MouseEvent, categoryId: string) => {
    e.stopPropagation();
    router.push(`/categories/${categoryId}`);
  };

  const columns: EntityTableColumn<DishWithRelations>[] = [
    {
      key: 'image',
      header: 'Image',
      width: '100px',
      render: dish => (
        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
          {dish.imageUrl ? (
            <Image
              src={dish.imageUrl}
              alt={dish.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: dish => (
        <div>
          <div>{dish.name}</div>
          {dish.description && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {dish.description}
            </p>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'category',
      header: 'Category',
      render: dish =>
        dish.category ? (
          <span
            className="text-primary hover:underline cursor-pointer"
            onClick={e => handleCategoryClick(e, dish.category!.id)}
            data-no-row-click="true"
          >
            {dish.category.name}
          </span>
        ) : (
          <span className="text-muted-foreground">None</span>
        ),
    },
    {
      key: 'usageCount',
      header: 'Usage Count',
      render: dish => (
        <Badge variant="outline">
          {dish._count.parties}{' '}
          {dish._count.parties === 1 ? 'party' : 'parties'}
        </Badge>
      ),
      sortable: true,
    },
  ];

  return (
    <EntityTable
      data={dishes}
      columns={columns}
      pagination={pagination}
      sortBy={sortBy}
      sortOrder={sortOrder}
      baseUrl="/dishes"
      editDialog={dish => (
        <DishForm
          dish={{
            ...dish,
            category: dish.category || undefined,
            defaultAmount: null,
          }}
        />
      )}
      onDelete={async id => {
        // The delete functionality is handled by the DeleteEntityDialog component
      }}
      selectable={selectable}
      selectedIds={selectedDishes}
      onRowSelect={onDishSelect}
      onRowClick={dish => router.push(`/dishes/${dish.id}`)}
    />
  );
}
