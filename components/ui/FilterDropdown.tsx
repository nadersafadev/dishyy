'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/forms/select';

export type FilterOption = {
  id: string;
  label: string;
  value: string;
  isParent?: boolean;
  group?: string;
  groupId?: string;
  hidden?: boolean;
};

export interface FilterDropdownProps {
  id: string;
  label?: string;
  placeholder?: string;
  options: FilterOption[];
  value?: string;
  defaultValue?: string;
  onChange: (value: string) => void;
  className?: string;
  showLabel?: boolean;
  disabled?: boolean;
}

export function FilterDropdown({
  id,
  label,
  placeholder,
  options,
  value,
  defaultValue = 'all',
  onChange,
  className = '',
  showLabel = true,
  disabled = false,
}: FilterDropdownProps) {
  const [selectedValue, setSelectedValue] = useState<string>(
    value || defaultValue
  );

  // Update local state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  // Handle value change
  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue);
  };

  // Group options by parent
  const groupedOptions = options.reduce(
    (acc, option) => {
      if (!option.group) {
        // Only add to ungrouped if not hidden
        if (!option.hidden) {
          return {
            ...acc,
            ungrouped: [...(acc.ungrouped || []), option],
          };
        }
        return acc;
      }

      return {
        ...acc,
        [option.group]: [...(acc[option.group] || []), option],
      };
    },
    {} as Record<string, FilterOption[]>
  );

  // Find parent categories (they have isParent=true)
  const parentCategories = options.filter(opt => opt.isParent);

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      <Select
        value={selectedValue}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger id={id} className={showLabel ? '' : 'mt-0'}>
          <SelectValue
            placeholder={placeholder || `Select ${label || 'option'}`}
          />
        </SelectTrigger>
        <SelectContent>
          {/* Render ungrouped options first (like "All categories") */}
          {groupedOptions.ungrouped?.map(option => (
            <SelectItem
              key={option.id}
              value={option.value}
              className="text-center font-medium"
            >
              {option.label}
            </SelectItem>
          ))}

          {/* Render grouped options */}
          {Object.entries(groupedOptions)
            .filter(([key]) => key !== 'ungrouped')
            .map(([group, items]) => {
              // Find the parent category for this group
              const parentCategory = parentCategories.find(
                p => p.label === group
              );

              return (
                <SelectGroup key={group}>
                  {/* Make the group label clickable by wrapping it in a SelectItem */}
                  <SelectItem
                    value={parentCategory?.value || ''}
                    className="font-medium hover:bg-accent text-center"
                  >
                    {group}
                  </SelectItem>
                  {items.map(option => (
                    <SelectItem
                      key={option.id}
                      value={option.value}
                      className="pl-8 text-sm text-muted-foreground"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              );
            })}
        </SelectContent>
      </Select>
    </div>
  );
}
