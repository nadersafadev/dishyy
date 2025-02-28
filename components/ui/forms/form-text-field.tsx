import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/forms/input';

// Use standard HTML input types
type InputType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'color';

interface FormTextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: InputType;
  className?: string;
  min?: number;
  max?: number;
  maxLength?: number;
  step?: string;
  optional?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormTextField({
  name,
  label,
  placeholder,
  type = 'text',
  className,
  min,
  max,
  maxLength,
  step,
  optional = false,
  disabled = false,
  autoComplete,
  onChange,
}: FormTextFieldProps) {
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
              type={type}
              min={min}
              max={max}
              maxLength={maxLength}
              step={step}
              disabled={disabled}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className={className}
              value={
                field.value === undefined || field.value === null
                  ? ''
                  : field.value
              }
              onChange={e => {
                const value = e.target.value;

                // Handle the onChange
                if (onChange) {
                  onChange(e);
                }

                // Type conversions
                if (type === 'number') {
                  // Handle numeric conversions properly
                  if (value === '') {
                    field.onChange(undefined);
                  } else {
                    const numValue = Number(value);
                    // Only update if it's a valid number
                    if (!isNaN(numValue)) {
                      field.onChange(numValue);
                    }
                  }
                } else {
                  field.onChange(value);
                }
              }}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
