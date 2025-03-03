import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface FormCheckboxFieldProps {
  name: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function FormCheckboxField({
  name,
  children,
  disabled = false,
}: FormCheckboxFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <>
          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className="mt-0.5"
              />
            </FormControl>
            <div className="space-y-1">{children}</div>
          </FormItem>
          <FormMessage />
        </>
      )}
    />
  );
}
