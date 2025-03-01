'use client';

import { Badge } from '@/components/ui/badge';
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
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit2Icon,
  ImageIcon,
  Trash2Icon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { DeleteDishDialog } from '@/components/dishes/DeleteDishDialog';

interface DishWithRelations {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  unit: string;
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
}

export function DishesTable({
  dishes,
  pagination,
  sortBy = 'name',
  sortOrder = 'asc',
}: DishesTableProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `/dishes?${params.toString()}`;
  };

  // Check if sortable column is active
  const isSortActive = (column: string) => sortBy === column;

  // Create sort URL for a column
  const createSortURL = (column: string) => {
    const params = new URLSearchParams(searchParams.toString());

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
              <TableRow key={dish.id}>
                <TableCell>
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
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <div>{dish.name}</div>
                    {dish.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {dish.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {dish.category ? (
                    <Link
                      href={`/categories/${dish.category.id}`}
                      className="hover:underline text-primary"
                    >
                      {dish.category.name}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {dish._count.parties}{' '}
                    {dish._count.parties === 1 ? 'party' : 'parties'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dishes/${dish.id}`}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        title="View Dish"
                      >
                        <Edit2Icon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteDishDialog
                      dishId={dish.id}
                      dishName={dish.name}
                      inMenuCount={dish._count.parties}
                      trigger={
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                          title="Delete Dish"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
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
