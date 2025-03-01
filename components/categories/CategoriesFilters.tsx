'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/forms/select';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface CategoriesFiltersProps {
  search?: string;
  hasParent?: string;
  hasDishes?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function CategoriesFilters({
  search = '',
  hasParent = '',
  hasDishes = '',
  sortBy = 'name',
  sortOrder = 'asc',
}: CategoriesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(search);
  const [hasParentValue, setHasParentValue] = useState(hasParent);
  const [hasDishesValue, setHasDishesValue] = useState(hasDishes);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortOrderValue, setSortOrderValue] = useState(sortOrder);

  // Debounce the search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue !== search) {
        applyFilters({ search: searchValue });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  // Apply all the filters when submitting the form
  const applyFilters = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update params with new values
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    params.set('page', '1');

    // Navigate to the new URL
    router.push(`/categories?${params.toString()}`);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchValue('');
    setHasParentValue('');
    setHasDishesValue('');
    setSortByValue('name');
    setSortOrderValue('asc');
    router.push('/categories');
  };

  // Check if there are any active filters
  const hasActiveFilters =
    search ||
    hasParent ||
    hasDishes ||
    sortBy !== 'name' ||
    sortOrder !== 'asc';

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <CardTitle className="text-base text-center sm:text-left">
            Filters and Sorting
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
                className="w-full md:w-64 pl-8"
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchValue(e.target.value)
                }
              />
            </div>
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

      {isOpen && (
        <CardContent className="p-4 pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="hasParent" className="text-sm font-medium">
                Parent Status
              </label>
              <Select
                value={hasParentValue}
                onValueChange={(value: string) => {
                  setHasParentValue(value);
                  applyFilters({ hasParent: value || undefined });
                }}
              >
                <SelectTrigger id="hasParent">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="true">Has parent</SelectItem>
                  <SelectItem value="false">No parent (Top level)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="hasDishes" className="text-sm font-medium">
                Dishes Status
              </label>
              <Select
                value={hasDishesValue}
                onValueChange={(value: string) => {
                  setHasDishesValue(value);
                  applyFilters({ hasDishes: value || undefined });
                }}
              >
                <SelectTrigger id="hasDishes">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="true">Has dishes</SelectItem>
                  <SelectItem value="false">No dishes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="sortBy" className="text-sm font-medium">
                Sort By
              </label>
              <Select
                value={sortByValue}
                onValueChange={(value: string) => {
                  setSortByValue(value);
                  applyFilters({ sortBy: value });
                }}
              >
                <SelectTrigger id="sortBy">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="updatedAt">Date Updated</SelectItem>
                  <SelectItem value="dishCount">Dishes Count</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="sortOrder" className="text-sm font-medium">
                Sort Order
              </label>
              <Select
                value={sortOrderValue}
                onValueChange={(value: string) => {
                  setSortOrderValue(value);
                  applyFilters({ sortOrder: value });
                }}
              >
                <SelectTrigger id="sortOrder">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending (A-Z, 0-9)</SelectItem>
                  <SelectItem value="desc">Descending (Z-A, 9-0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
