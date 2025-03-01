'use client';

import { useState } from 'react';
import { FilterDropdown, FilterOption } from '@/components/ui/FilterDropdown';

export function FilterDropdownExample() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const statusOptions: FilterOption[] = [
    { id: 'all', label: 'All Statuses', value: 'all' },
    { id: 'active', label: 'Active', value: 'active' },
    { id: 'inactive', label: 'Inactive', value: 'inactive' },
    { id: 'pending', label: 'Pending', value: 'pending' },
  ];

  const priorityOptions: FilterOption[] = [
    { id: 'all', label: 'All Priorities', value: 'all' },
    { id: 'high', label: 'High Priority', value: 'high' },
    { id: 'medium', label: 'Medium Priority', value: 'medium' },
    { id: 'low', label: 'Low Priority', value: 'low' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-lg font-medium">
        Standalone Filter Dropdowns Example
      </h2>

      <div className="flex flex-wrap gap-4">
        <FilterDropdown
          id="status"
          label="Status"
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-full sm:w-64"
        />

        <FilterDropdown
          id="priority"
          label="Priority"
          options={priorityOptions}
          value={priorityFilter}
          onChange={setPriorityFilter}
          className="w-full sm:w-64"
        />
      </div>

      <div className="mt-4 p-4 border rounded-md">
        <h3 className="text-sm font-medium">Current Filters:</h3>
        <p>Status: {statusFilter}</p>
        <p>Priority: {priorityFilter}</p>
      </div>

      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            console.log('Applied filters:', {
              status: statusFilter,
              priority: priorityFilter,
            });
          }}
        >
          Apply Filters
        </button>

        <button
          className="px-4 py-2 border rounded hover:bg-gray-100"
          onClick={() => {
            setStatusFilter('all');
            setPriorityFilter('all');
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
