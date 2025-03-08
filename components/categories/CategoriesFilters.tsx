'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FilterPanel } from '@/components/ui/filter-panel';
import type { FilterOption } from '@/components/ui/FilterDropdown';

interface CategoriesFiltersProps {
  search?: string;
  hasParent?: string;
  hasDishes?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function CategoriesFilters({
  search = '',
  hasParent = 'all',
  hasDishes = 'all',
  sortBy = 'name',
  sortOrder = 'asc',
}: CategoriesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Define filter options
  const parentOptions: FilterOption[] = [
    { id: 'all', label: 'All categories', value: 'all' },
    { id: 'true', label: 'Has parent', value: 'true' },
    { id: 'false', label: 'No parent (Top level)', value: 'false' },
  ];

  const dishOptions: FilterOption[] = [
    { id: 'all', label: 'All categories', value: 'all' },
    { id: 'true', label: 'Has dishes', value: 'true' },
    { id: 'false', label: 'No dishes', value: 'false' },
  ];

  const sortOptions = [
    { id: 'name', label: 'Name', value: 'name' },
    { id: 'createdAt', label: 'Date Created', value: 'createdAt' },
    { id: 'updatedAt', label: 'Date Updated', value: 'updatedAt' },
    { id: 'dishCount', label: 'Dishes Count', value: 'dishCount' },
  ];

  // Handle search change
  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');

    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    params.set('page', '1');
    router.push(`/categories?${params.toString()}`);
  };

  return (
    <FilterPanel
      title="Filters and Sorting"
      searchPlaceholder="Search categories..."
      showSearch={true}
      searchValue={search}
      onSearchChange={handleSearchChange}
      filters={[
        {
          id: 'hasParent',
          label: 'Parent Status',
          options: parentOptions,
          defaultValue: hasParent,
        },
        {
          id: 'hasDishes',
          label: 'Dishes Status',
          options: dishOptions,
          defaultValue: hasDishes,
        },
      ]}
      sortOptions={sortOptions}
      defaultSortId={sortBy}
      defaultSortOrder={sortOrder as 'asc' | 'desc'}
    />
  );
}
