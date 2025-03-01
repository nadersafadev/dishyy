'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  SelectField,
  SelectFieldProps,
} from '@/components/ui/forms/select-field';

export type { SortOption } from '@/components/ui/forms/select-field';

export type FormSelectFieldProps<T> = Omit<
  SelectFieldProps<T>,
  'value' | 'onChange' | 'className'
> & {
  name: string;
};

export function FormSelectField<T>({
  name,
  label,
  ...props
}: FormSelectFieldProps<T>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">{label}</FormLabel>
          <FormControl>
            <SelectField
              {...props}
              label={undefined} // We use FormLabel instead
              value={field.value}
              onChange={field.onChange}
              className="mt-0"
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
