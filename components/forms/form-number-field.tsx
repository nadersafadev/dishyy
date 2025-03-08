import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/forms/input';

interface FormNumberFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: string;
  optional?: boolean;
  disabled?: boolean;
  onChange?: (value: number | undefined) => void;
  description?: string;
}

export function FormNumberField({
  name,
  label,
  placeholder,
  className,
  min,
  max,
  step,
  optional = false,
  disabled = false,
  onChange,
  description,
}: FormNumberFieldProps) {
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
            <Input
              {...field}
              type="number"
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              placeholder={placeholder}
              className={className}
              // Handle number conversion
              value={
                field.value === undefined || field.value === null
                  ? ''
                  : field.value
              }
              onChange={e => {
                const value = e.target.value;

                if (value === '') {
                  field.onChange(undefined);
                  if (onChange) onChange(undefined);
                } else {
                  const numValue = Number(value);
                  if (!isNaN(numValue)) {
                    field.onChange(numValue);
                    if (onChange) onChange(numValue);
                  }
                }
              }}
            />
          </FormControl>
          {description && (
            <FormDescription className="text-xs">{description}</FormDescription>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
