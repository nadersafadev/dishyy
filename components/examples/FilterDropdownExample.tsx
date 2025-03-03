'use client';

import { useState } from 'react';
import { FilterDropdown, FilterOption } from '@/components/ui/FilterDropdown';

export function FilterDropdownExample() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Example with hierarchical categories
  const categoryOptions: FilterOption[] = [
    { id: 'all', label: 'All Categories', value: 'all' },
    // Child categories
    {
      id: 'italian-pasta',
      label: 'Pasta',
      value: 'italian-pasta',
      group: 'Italian Cuisine',
      groupId: 'italian',
    },
    {
      id: 'italian-pizza',
      label: 'Pizza',
      value: 'italian-pizza',
      group: 'Italian Cuisine',
      groupId: 'italian',
    },
    {
      id: 'italian-risotto',
      label: 'Risotto',
      value: 'italian-risotto',
      group: 'Italian Cuisine',
      groupId: 'italian',
    },
    {
      id: 'asian-sushi',
      label: 'Sushi',
      value: 'asian-sushi',
      group: 'Asian Cuisine',
      groupId: 'asian',
    },
    {
      id: 'asian-dimsum',
      label: 'Dim Sum',
      value: 'asian-dimsum',
      group: 'Asian Cuisine',
      groupId: 'asian',
    },
    {
      id: 'asian-noodles',
      label: 'Noodles',
      value: 'asian-noodles',
      group: 'Asian Cuisine',
      groupId: 'asian',
    },
    // Parent categories (only shown as group headers)
    {
      id: 'italian',
      label: 'Italian Cuisine',
      value: 'italian',
      isParent: true,
      hidden: true,
    },
    {
      id: 'asian',
      label: 'Asian Cuisine',
      value: 'asian',
      isParent: true,
      hidden: true,
    },
  ];

  // Simple status options (no hierarchy)
  const statusOptions: FilterOption[] = [
    { id: 'all', label: 'All Statuses', value: 'all' },
    { id: 'active', label: 'Active', value: 'active' },
    { id: 'inactive', label: 'Inactive', value: 'inactive' },
    { id: 'pending', label: 'Pending', value: 'pending' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-lg font-medium">Filter Dropdown Examples</h2>

      <div className="flex flex-wrap gap-4">
        {/* Hierarchical dropdown */}
        <div className="w-full">
          <h3 className="text-sm font-medium mb-2">
            Hierarchical Categories Example:
          </h3>
          <FilterDropdown
            id="category"
            label="Category"
            options={categoryOptions}
            value={categoryFilter}
            onChange={setCategoryFilter}
            className="w-full sm:w-64"
          />
        </div>

        {/* Simple dropdown */}
        <div className="w-full">
          <h3 className="text-sm font-medium mb-2">Simple Dropdown Example:</h3>
          <FilterDropdown
            id="status"
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      <div className="mt-4 p-4 border rounded-md">
        <h3 className="text-sm font-medium">Current Filters:</h3>
        <p>Category: {categoryFilter}</p>
        <p>Status: {statusFilter}</p>
      </div>

      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            console.log('Applied filters:', {
              category: categoryFilter,
              status: statusFilter,
            });
          }}
        >
          Apply Filters
        </button>

        <button
          className="px-4 py-2 border rounded hover:bg-gray-100"
          onClick={() => {
            setCategoryFilter('all');
            setStatusFilter('all');
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
