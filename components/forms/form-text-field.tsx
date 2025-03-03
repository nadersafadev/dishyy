import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/forms/input';

// Use only text-based HTML input types
type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'search'
  | 'color';

interface FormTextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: InputType;
  className?: string;
  maxLength?: number;
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
  maxLength,
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
          {label && (
            <FormLabel className="text-sm font-medium">
              {label}
              {optional && (
                <span className="text-sm text-muted-foreground">
                  {' '}
                  (Optional)
                </span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <Input
              {...field}
              type={type}
              maxLength={maxLength}
              disabled={disabled}
              placeholder={placeholder}
              autoComplete={autoComplete}
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
