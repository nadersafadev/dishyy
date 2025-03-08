import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface RadioOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

interface FormRadioFieldProps<T extends string> {
  name: string;
  label?: string;
  options: RadioOption<T>[];
  className?: string;
  optional?: boolean;
  disabled?: boolean;
}

export function FormRadioField<T extends string>({
  name,
  label,
  options,
  className,
  optional = false,
  disabled = false,
}: FormRadioFieldProps<T>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
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
            <RadioGroup
              disabled={disabled}
              value={field.value}
              onValueChange={field.onChange}
              className="flex flex-col space-y-2"
            >
              {options.map(option => (
                <Label
                  key={option.value}
                  htmlFor={`${name}-${option.value}`}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer group"
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`${name}-${option.value}`}
                    className="mt-0"
                  />
                  <div className="flex items-center gap-3">
                    {option.icon && (
                      <option.icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent-foreground" />
                    )}
                    <div className="flex flex-col gap-1">
                      <span className="font-medium group-hover:text-accent-foreground">
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="text-xs text-muted-foreground group-hover:text-accent-foreground/70">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
