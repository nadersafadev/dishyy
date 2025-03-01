'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FilterPanel, FilterOption } from '@/components/ui/FilterPanel';

interface DishesFiltersProps {
  search?: string;
  categoryId?: string;
  hasCategory?: string;
  hasImage?: string;
  sortBy?: string;
  sortOrder?: string;
  categories?: Array<{ id: string; name: string }>;
}

export function DishesFilters({
  search = '',
  categoryId = '',
  hasCategory = 'all',
  hasImage = 'all',
  sortBy = 'name',
  sortOrder = 'asc',
  categories = [],
}: DishesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Convert categories to filter options
  const categoryOptions: FilterOption[] = [
    { id: 'all', label: 'All categories', value: 'all' },
    ...categories.map(category => ({
      id: category.id,
      label: category.name,
      value: category.id,
    })),
  ];

  // Define filter options
  const hasCategoryOptions: FilterOption[] = [
    { id: 'all', label: 'All dishes', value: 'all' },
    { id: 'true', label: 'With category', value: 'true' },
    { id: 'false', label: 'Without category', value: 'false' },
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
    const params = new URLSearchParams(searchParams.toString());

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
          id: 'hasCategory',
          label: 'Category Status',
          options: hasCategoryOptions,
          defaultValue: hasCategory,
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
