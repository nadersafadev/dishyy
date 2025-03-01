'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface DataPaginationProps {
  pagination: PaginationMeta;
  itemName?: string;
  baseUrl?: string;
  className?: string;
  showSummary?: boolean;
  showControls?: boolean;
  showFirstLast?: boolean;
  onPageChange?: (page: number) => void;
}

export function DataPagination({
  pagination,
  itemName = 'items',
  baseUrl,
  className = '',
  showSummary = true,
  showControls = true,
  showFirstLast = true,
  onPageChange,
}: DataPaginationProps) {
  const searchParams = useSearchParams();

  // Don't render pagination if only one page
  if (pagination.totalPages <= 1) {
    return null;
  }

  // Create URL for page navigation
  const createPageURL = (pageNumber: number) => {
    if (onPageChange) {
      return '#'; // Use # when using callback instead of navigation
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${baseUrl || ''}?${params.toString()}`;
  };

  // Handle page change with callback if provided
  const handlePageClick = (pageNumber: number, event: React.MouseEvent) => {
    if (onPageChange) {
      event.preventDefault();
      onPageChange(pageNumber);
    }
  };

  // Calculate display information
  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(
    pagination.page * pagination.limit,
    pagination.totalCount
  );

  return (
    <div
      className={`flex items-center justify-between space-x-2 py-4 ${className}`}
    >
      {showSummary && (
        <div className="flex-1 text-sm text-muted-foreground">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{pagination.totalCount}</span>{' '}
          {itemName}
        </div>
      )}

      {showControls && (
        <div className="flex items-center space-x-2">
          {showFirstLast && (
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPreviousPage}
              asChild={pagination.hasPreviousPage && !onPageChange}
              onClick={onPageChange ? e => handlePageClick(1, e) : undefined}
            >
              {pagination.hasPreviousPage ? (
                onPageChange ? (
                  <a href="#" onClick={e => handlePageClick(1, e)}>
                    <ChevronsLeft className="h-4 w-4" />
                    <span className="sr-only">First page</span>
                  </a>
                ) : (
                  <Link href={createPageURL(1)}>
                    <ChevronsLeft className="h-4 w-4" />
                    <span className="sr-only">First page</span>
                  </Link>
                )
              ) : (
                <span>
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">First page</span>
                </span>
              )}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasPreviousPage}
            asChild={pagination.hasPreviousPage && !onPageChange}
            onClick={
              onPageChange
                ? e => handlePageClick(pagination.page - 1, e)
                : undefined
            }
          >
            {pagination.hasPreviousPage ? (
              onPageChange ? (
                <a
                  href="#"
                  onClick={e => handlePageClick(pagination.page - 1, e)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </a>
              ) : (
                <Link href={createPageURL(pagination.page - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Link>
              )
            ) : (
              <span>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </span>
            )}
          </Button>

          <span className="text-sm font-medium">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasNextPage}
            asChild={pagination.hasNextPage && !onPageChange}
            onClick={
              onPageChange
                ? e => handlePageClick(pagination.page + 1, e)
                : undefined
            }
          >
            {pagination.hasNextPage ? (
              onPageChange ? (
                <a
                  href="#"
                  onClick={e => handlePageClick(pagination.page + 1, e)}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </a>
              ) : (
                <Link href={createPageURL(pagination.page + 1)}>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Link>
              )
            ) : (
              <span>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </span>
            )}
          </Button>

          {showFirstLast && (
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              asChild={pagination.hasNextPage && !onPageChange}
              onClick={
                onPageChange
                  ? e => handlePageClick(pagination.totalPages, e)
                  : undefined
              }
            >
              {pagination.hasNextPage ? (
                onPageChange ? (
                  <a
                    href="#"
                    onClick={e => handlePageClick(pagination.totalPages, e)}
                  >
                    <ChevronsRight className="h-4 w-4" />
                    <span className="sr-only">Last page</span>
                  </a>
                ) : (
                  <Link href={createPageURL(pagination.totalPages)}>
                    <ChevronsRight className="h-4 w-4" />
                    <span className="sr-only">Last page</span>
                  </Link>
                )
              ) : (
                <span>
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Last page</span>
                </span>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
