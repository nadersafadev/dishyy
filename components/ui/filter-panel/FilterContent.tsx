import { FilterDropdown } from '../FilterDropdown';
import { DateInput } from './DateInput';
import type { FilterConfig, SortOption } from './types';

interface FilterContentProps {
  filters: FilterConfig[];
  filterValues: Record<string, string>;
  onFilterChange: (newFilters: Record<string, string>) => void;
  sortOptions: SortOption[];
  sortId: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortId: string, sortOrder: 'asc' | 'desc') => void;
}

export function FilterContent({
  filters,
  filterValues,
  onFilterChange,
  sortOptions,
  sortId,
  sortOrder,
  onSortChange,
}: FilterContentProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {/* Render filter dropdowns */}
      {filters.map(filter =>
        filter.type === 'date' ? (
          <DateInput
            key={filter.id}
            id={filter.id}
            label={filter.label}
            value={filterValues[filter.id] || ''}
            onChange={value => onFilterChange({ [filter.id]: value })}
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
              onFilterChange({ [filter.id]: value });
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
            onSortChange(value, sortOrder);
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
            onSortChange(sortId, value as 'asc' | 'desc');
          }}
        />
      )}
    </div>
  );
}
