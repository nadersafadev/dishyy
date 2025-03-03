'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface FormTextAreaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  rows?: number;
  maxLength?: number;
  optional?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function FormTextAreaField({
  name,
  label,
  placeholder,
  className,
  rows = 4,
  maxLength,
  optional = false,
  disabled = false,
  onChange,
}: FormTextAreaFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">
            {label}
            {optional && (
              <span className="text-sm text-muted-foreground"> (Optional)</span>
            )}
          </FormLabel>
          <FormControl>
            <Textarea
              {...field}
              rows={rows}
              maxLength={maxLength}
              disabled={disabled}
              placeholder={placeholder}
              className={className}
              onChange={e => {
                // Call custom onChange if provided
                if (onChange) {
                  onChange(e);
                }
                // Use default field onChange
                field.onChange(e);
              }}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
