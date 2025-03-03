'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface FormSingleSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
  disabled?: boolean;
  className?: string;
}

export function FormSingleSelect({
  name,
  label,
  placeholder,
  options,
  disabled,
  className,
}: FormSingleSelectProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">{label}</FormLabel>
          <Select
            disabled={disabled}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
                  className
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(option => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="focus:bg-accent focus:text-accent-foreground"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
