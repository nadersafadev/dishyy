'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FilterPanel } from '@/components/ui/filter-panel';
import type { FilterOption } from '@/components/ui/FilterDropdown';

interface DishesFiltersProps {
  search?: string;
  categoryId?: string;
  hasImage?: string;
  sortBy?: string;
  sortOrder?: string;
  categories?: Array<{
    id: string;
    name: string;
    parent?: { id: string; name: string } | null;
  }>;
}

export function DishesFilters({
  search = '',
  categoryId = '',
  hasImage = 'all',
  sortBy = 'name',
  sortOrder = 'asc',
  categories = [],
}: DishesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Convert categories to filter options with hierarchy
  const categoryOptions: FilterOption[] = [
    { id: 'all', label: 'All categories', value: 'all' },
    // Get child categories and organize them under their parents
    ...categories
      .filter(category => category.parent)
      .sort((a, b) => {
        if (a.parent && b.parent) {
          const parentCompare = a.parent.name.localeCompare(b.parent.name);
          return parentCompare !== 0
            ? parentCompare
            : a.name.localeCompare(b.name);
        }
        return 0;
      })
      .map(category => ({
        id: category.id,
        label: category.name,
        value: category.id,
        group: category.parent?.name,
        groupId: category.parent?.id,
      })),
    // Add parent categories as hidden options (only for group headers)
    ...categories
      .filter(category => !category.parent)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(category => ({
        id: category.id,
        label: category.name,
        value: category.id,
        isParent: true,
        hidden: true, // Add this flag to hide from regular listings
      })),
  ];

  const hasImageOptions: FilterOption[] = [
    { id: 'all', label: 'All dishes', value: 'all' },
    { id: 'true', label: 'With image', value: 'true' },
    { id: 'false', label: 'Without image', value: 'false' },
  ];

  const sortOptions = [
    { id: 'name', label: 'Name', value: 'name' },
    { id: 'createdAt', label: 'Date Created', value: 'createdAt' },
    { id: 'updatedAt', label: 'Date Updated', value: 'updatedAt' },
    { id: 'usageCount', label: 'Usage Count', value: 'usageCount' },
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
    router.push(`/dishes?${params.toString()}`);
  };

  return (
    <FilterPanel
      title="Dishes Filters"
      searchPlaceholder="Search dishes..."
      showSearch={true}
      searchValue={search}
      onSearchChange={handleSearchChange}
      filters={[
        {
          id: 'categoryId',
          label: 'Category',
          options: categoryOptions,
          defaultValue: categoryId || 'all',
          placeholder: 'Select a category',
        },
        {
          id: 'hasImage',
          label: 'Image Status',
          options: hasImageOptions,
          defaultValue: hasImage,
        },
      ]}
      sortOptions={sortOptions}
      defaultSortId={sortBy}
      defaultSortOrder={sortOrder as 'asc' | 'desc'}
    />
  );
}
