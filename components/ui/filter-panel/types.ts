import type { FilterOption } from '../FilterDropdown';

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
