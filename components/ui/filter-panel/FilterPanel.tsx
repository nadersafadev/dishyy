'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchInput } from './SearchInput';
import { FilterControls } from './FilterControls';
import { FilterContent } from './FilterContent';
import type { FilterConfig, SortOption } from './types';

export type { FilterConfig, SortOption } from './types';

export type FilterPanelProps = {
  title?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: FilterConfig[];
  sortOptions?: SortOption[];
  defaultSortId?: string;
  defaultSortOrder?: 'asc' | 'desc';
  onFiltersChange?: (filters: Record<string, string>) => void;
  onSortChange?: (sortId: string, sortOrder: 'asc' | 'desc') => void;
  onReset?: () => void;
  className?: string;
};

export function FilterPanel({
  title = 'Filters and Sorting',
  searchPlaceholder = 'Search...',
  showSearch = true,
  searchValue = '',
  filters = [],
  sortOptions = [],
  defaultSortId = '',
  defaultSortOrder = 'asc',
  onSearchChange,
  onFiltersChange,
  onSortChange,
  onReset,
  className,
}: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState(searchValue);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sortId, setSortId] = useState(defaultSortId);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder);

  // Initialize filter values from props or URL
  useEffect(() => {
    const initialValues: Record<string, string> = {};

    filters.forEach(filter => {
      const valueFromUrl = searchParams.get(filter.id);
      if (filter.type === 'date') {
        initialValues[filter.id] = valueFromUrl || '';
      } else {
        initialValues[filter.id] =
          valueFromUrl ||
          filter.defaultValue ||
          filter.options?.[0]?.value ||
          '';
      }
    });

    setFilterValues(initialValues);
  }, [filters, searchParams]);

  // Debounce the search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInputValue !== searchValue && onSearchChange) {
        onSearchChange(searchInputValue);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInputValue, searchValue, onSearchChange]);

  // Apply filters
  const applyFilters = (newFilters: Record<string, string>) => {
    setFilterValues(prev => ({ ...prev, ...newFilters }));

    if (onFiltersChange) {
      onFiltersChange({ ...filterValues, ...newFilters });
    } else {
      // Default behavior: update URL
      const params = new URLSearchParams(searchParams.toString());

      // Update params with new values
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Reset to page 1 when filters change
      params.set('page', '1');

      // Navigate to the new URL
      router.push(`?${params.toString()}`);
    }
  };

  // Update sort
  const updateSort = (newSortId: string, newSortOrder: 'asc' | 'desc') => {
    setSortId(newSortId);
    setSortOrder(newSortOrder);

    if (onSortChange) {
      onSortChange(newSortId, newSortOrder);
    } else {
      // Default behavior: update URL
      const params = new URLSearchParams(searchParams.toString());

      if (newSortId) {
        params.set('sortBy', newSortId);
      } else {
        params.delete('sortBy');
      }

      if (newSortOrder) {
        params.set('sortOrder', newSortOrder);
      } else {
        params.delete('sortOrder');
      }

      // Reset to page 1 when sort changes
      params.set('page', '1');

      // Navigate to the new URL
      router.push(`?${params.toString()}`);
    }
  };

  // Reset filters
  const resetFilters = () => {
    const emptyFilters: Record<string, string> = {};
    filters.forEach(filter => {
      emptyFilters[filter.id] = '';
    });
    applyFilters(emptyFilters);
    setSortId(defaultSortId);
    setSortOrder(defaultSortOrder);

    if (onReset) {
      onReset();
    }
  };

  // Check if there are any active filters
  const hasActiveFilters = Object.values(filterValues).some(
    value => value && value !== 'all'
  );

  return (
    <Card className={className}>
      <CardHeader className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <CardTitle className="text-base text-center sm:text-left">
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {showSearch && (
              <SearchInput
                value={searchInputValue}
                onChange={setSearchInputValue}
                placeholder={searchPlaceholder}
              />
            )}
            <FilterControls
              isOpen={isOpen}
              onToggle={() => setIsOpen(!isOpen)}
              hasActiveFilters={hasActiveFilters}
              onReset={resetFilters}
            />
          </div>
        </div>
      </CardHeader>

      {isOpen && filters.length + sortOptions.length > 0 && (
        <CardContent className="p-4 pt-0 space-y-4">
          <FilterContent
            filters={filters}
            filterValues={filterValues}
            onFilterChange={applyFilters}
            sortOptions={sortOptions}
            sortId={sortId}
            sortOrder={sortOrder}
            onSortChange={updateSort}
          />
        </CardContent>
      )}
    </Card>
  );
}
