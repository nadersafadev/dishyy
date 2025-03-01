'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Edit2Icon,
  Trash2Icon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DeleteCategoryDialog } from '@/components/categories/DeleteCategoryDialog';
import type { Category } from '@/lib/types';

interface CategoryWithRelations {
  id: string;
  name: string;
  description?: string | null;
  parentId: string | null;
  parent?: { id: string; name: string } | null;
  _count?: { dishes: number };
}

interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface CategoriesTableProps {
  categories: CategoryWithRelations[];
  pagination: PaginationMeta;
  sortBy?: string;
  sortOrder?: string;
}

export function CategoriesTable({
  categories,
  pagination,
  sortBy = 'name',
  sortOrder = 'asc',
}: CategoriesTableProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `/categories?${params.toString()}`;
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

    return `/categories?${params.toString()}`;
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

  if (categories.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No categories available.</p>
        <Button asChild className="mt-4">
          <Link href="/categories/new">Create Your First Category</Link>
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
              <TableHead>
                <Link
                  href={createSortURL('name')}
                  className="flex items-center hover:underline"
                >
                  Name
                  {getSortIcon('name')}
                </Link>
              </TableHead>
              <TableHead>Parent Category</TableHead>
              <TableHead>
                <Link
                  href={createSortURL('dishCount')}
                  className="flex items-center hover:underline"
                >
                  Dishes Count
                  {getSortIcon('dishCount')}
                </Link>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  {category.parent ? (
                    <span className="inline-flex items-center gap-1">
                      {category.parent.name}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {category._count?.dishes || 0} dishes
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/categories/${category.id}`}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        title="View Category"
                      >
                        <Edit2Icon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteCategoryDialog
                      categoryId={category.id}
                      categoryName={category.name}
                      dishesCount={category._count?.dishes || 0}
                      isParent={category.parentId === null}
                      trigger={
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                          title="Delete Category"
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
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-medium">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(
                pagination.page * pagination.limit,
                pagination.totalCount
              )}
            </span>{' '}
            of <span className="font-medium">{pagination.totalCount}</span>{' '}
            categories
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPreviousPage}
              asChild={pagination.hasPreviousPage}
            >
              {pagination.hasPreviousPage ? (
                <Link href={createPageURL(1)}>
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">First page</span>
                </Link>
              ) : (
                <span>
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">First page</span>
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPreviousPage}
              asChild={pagination.hasPreviousPage}
            >
              {pagination.hasPreviousPage ? (
                <Link href={createPageURL(pagination.page - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Link>
              ) : (
                <span>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              asChild={pagination.hasNextPage}
            >
              {pagination.hasNextPage ? (
                <Link href={createPageURL(pagination.page + 1)}>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Link>
              ) : (
                <span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              asChild={pagination.hasNextPage}
            >
              {pagination.hasNextPage ? (
                <Link href={createPageURL(pagination.totalPages)}>
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Last page</span>
                </Link>
              ) : (
                <span>
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Last page</span>
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
