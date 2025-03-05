'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  CalendarIcon,
} from 'lucide-react';
import { FilterDropdown, FilterOption } from './FilterDropdown';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/forms/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export type { FilterOption } from './FilterDropdown';

export type SortOption = {
  id: string;
  label: string;
  value: string;
};

export type FilterConfig = {
  id: string;
  label: string;
  placeholder?: string;
  options?: FilterOption[];
  defaultValue?: string;
  type?: 'select' | 'date';
};

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

function DateInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const date = value ? new Date(value) : undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'w-full pl-3 text-left font-normal border-input bg-background hover:bg-background hover:text-foreground focus-visible:ring-0',
              !date && 'text-muted-foreground'
            )}
          >
            {date ? format(date, 'PPP') : 'Pick a date'}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-input" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={date => onChange(date?.toISOString() || '')}
            disabled={date =>
              date < new Date() || date < new Date('1900-01-01')
            }
            initialFocus
            className="bg-background rounded-lg"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

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
  const updateSort = (newSortId: string, newSortOrder?: 'asc' | 'desc') => {
    setSortId(newSortId);
    if (newSortOrder) {
      setSortOrder(newSortOrder);
    }

    if (onSortChange) {
      onSortChange(newSortId, newSortOrder || sortOrder);
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
      }

      // Reset to page 1 when sort changes
      params.set('page', '1');

      // Navigate to the new URL
      router.push(`?${params.toString()}`);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchInputValue('');
    setFilterValues({});
    setSortId(defaultSortId);
    setSortOrder(defaultSortOrder);

    if (onReset) {
      onReset();
    } else {
      // Default behavior: clear URL params except for page number
      const params = new URLSearchParams();
      params.set('page', '1');
      router.push(`?${params.toString()}`);
    }
  };

  // Check if there are any active filters
  const hasActiveFilters =
    searchInputValue ||
    Object.values(filterValues).some(value => value && value !== 'all') ||
    sortId !== defaultSortId ||
    sortOrder !== defaultSortOrder;

  return (
    <Card className={className}>
      <CardHeader className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <CardTitle className="text-base text-center sm:text-left">
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={searchPlaceholder}
                  className="w-full md:w-64 pl-8"
                  value={searchInputValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchInputValue(e.target.value)
                  }
                />
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              title="Advanced filters and sorting"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Advanced filters</span>
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                title="Reset all filters"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Reset filters</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {isOpen && filters.length + sortOptions.length > 0 && (
        <CardContent className="p-4 pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Render filter dropdowns */}
            {filters.map(filter =>
              filter.type === 'date' ? (
                <DateInput
                  key={filter.id}
                  id={filter.id}
                  label={filter.label}
                  value={filterValues[filter.id] || ''}
                  onChange={value => applyFilters({ [filter.id]: value })}
                />
              ) : (
                <FilterDropdown
                  key={filter.id}
                  id={filter.id}
                  label={filter.label}
                  placeholder={filter.placeholder}
                  options={filter.options || []}
                  value={filterValues[filter.id] || 'all'}
                  onChange={(value: string) => {
                    applyFilters({ [filter.id]: value });
                  }}
                />
              )
            )}

            {/* Sort By dropdown */}
            {sortOptions.length > 0 && (
              <FilterDropdown
                id="sortBy"
                label="Sort By"
                options={sortOptions}
                value={sortId}
                onChange={(value: string) => {
                  updateSort(value);
                }}
              />
            )}

            {/* Sort Order dropdown */}
            {sortOptions.length > 0 && (
              <FilterDropdown
                id="sortOrder"
                label="Sort Order"
                options={[
                  { id: 'asc', label: 'Ascending (A-Z, 0-9)', value: 'asc' },
                  { id: 'desc', label: 'Descending (Z-A, 9-0)', value: 'desc' },
                ]}
                value={sortOrder}
                onChange={(value: string) => {
                  setSortOrder(value as 'asc' | 'desc');
                  updateSort(sortId, value as 'asc' | 'desc');
                }}
              />
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
