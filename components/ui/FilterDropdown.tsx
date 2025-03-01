'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/forms/select';

export type FilterOption = {
  id: string;
  label: string;
  value: string;
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
          {options.map(option => (
            <SelectItem key={option.id} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
