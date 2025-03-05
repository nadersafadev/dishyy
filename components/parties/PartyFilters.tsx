'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FilterPanel } from '@/components/ui/filter-panel';
import type { FilterConfig } from '@/components/ui/filter-panel';
import type { PartyFiltersProps } from './types';

const sortOptions = [
  { id: 'date', label: 'Date', value: 'date' },
  { id: 'name', label: 'Name', value: 'name' },
  { id: 'createdAt', label: 'Created At', value: 'createdAt' },
  {
    id: 'participantsCount',
    label: 'Participants',
    value: 'participantsCount',
  },
];

const filters: FilterConfig[] = [
  {
    id: 'dateFrom',
    label: 'Date From',
    type: 'date',
  },
  {
    id: 'dateTo',
    label: 'Date To',
    type: 'date',
  },
];

export function PartyFilters({
  search = '',
  sortBy = 'date',
  sortOrder = 'desc',
  dateFrom,
  dateTo,
}: PartyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle search change
  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    params.set('page', '1');
    router.push(`/parties?${params.toString()}`);
  };

  // Handle filter changes
  const handleFiltersChange = (filters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.set('page', '1');
    router.push(`/parties?${params.toString()}`);
  };

  // Handle sort changes
  const handleSortChange = (sortId: string, sortOrder: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sortId);
    params.set('sortOrder', sortOrder);
    params.set('page', '1');
    router.push(`/parties?${params.toString()}`);
  };

  return (
    <FilterPanel
      title="Parties Filters"
      searchPlaceholder="Search parties..."
      showSearch={true}
      searchValue={search}
      onSearchChange={handleSearchChange}
      filters={filters}
      sortOptions={sortOptions}
      defaultSortId={sortBy}
      defaultSortOrder={sortOrder as 'asc' | 'desc'}
      onSortChange={handleSortChange}
      onFiltersChange={handleFiltersChange}
    />
  );
}
