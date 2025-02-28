import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/forms/input';

interface FormTextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'number';
  className?: string;
  min?: number;
  step?: string;
  optional?: boolean;
}

export function FormTextField({
  name,
  label,
  placeholder,
  type = 'text',
  className,
  min,
  step,
  optional = false,
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
              step={step}
              placeholder={placeholder}
              className={`border-input bg-background focus-visible:ring-0 ${className}`}
              value={
                field.value === undefined || field.value === null
                  ? ''
                  : field.value
              }
              onChange={e => {
                const value = e.target.value;
                if (type === 'number') {
                  field.onChange(value === '' ? undefined : Number(value));
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
