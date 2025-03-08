'use client';

import { Button } from '@/components/ui/button';
import { DataPagination } from '@/components/ui/DataPagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { DishTableRow } from './DishTableRow';
import { Unit } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface DishWithRelations {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  unit: Unit;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  _count: { parties: number };
}

interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

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
  const searchParams = useSearchParams();

  // Check if sortable column is active
  const isSortActive = (column: string) => sortBy === column;

  // Create sort URL for a column
  const createSortURL = (column: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');

    // If already sorting by this column, toggle the order
    if (sortBy === column) {
      params.set('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      params.set('sortBy', column);
      params.set('sortOrder', 'asc'); // Default to ascending for new column
    }

    return `/dishes?${params.toString()}`;
  };

  // Get sort icon based on current state
  const getSortIcon = (column: string) => {
    if (!isSortActive(column)) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  if (isLoading) {
    return (
      <div>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-12 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Image</TableHead>
              <TableHead>
                <Link
                  href={createSortURL('name')}
                  className="flex items-center hover:underline"
                >
                  Name
                  {getSortIcon('name')}
                </Link>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <Link
                  href={createSortURL('usageCount')}
                  className="flex items-center hover:underline"
                >
                  Usage Count
                  {getSortIcon('usageCount')}
                </Link>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dishes.map(dish => (
              <DishTableRow
                key={dish.id}
                dish={dish}
                selectable={selectable}
                selected={selectedDishes.includes(dish.id)}
                onSelect={onDishSelect}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination UI */}
      <DataPagination
        pagination={pagination}
        itemName="dishes"
        baseUrl="/dishes"
      />
    </div>
  );
}
