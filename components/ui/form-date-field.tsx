import { useFormContext } from 'react-hook-form'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

interface FormDateFieldProps {
  name: string
  label: string
  placeholder?: string
  className?: string
  optional?: boolean
}

export function FormDateField({
  name,
  label,
  placeholder = 'Pick a date',
  className,
  optional = false,
}: FormDateFieldProps) {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-sm font-medium'>
            {label}
            {optional && (
              <span className='text-sm text-muted-foreground'> (Optional)</span>
            )}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  className={cn(
                    'w-full pl-3 text-left font-normal border-input bg-background hover:bg-background hover:text-foreground focus-visible:ring-0',
                    !field.value && 'text-muted-foreground',
                    className
                  )}
                >
                  {field.value ? (
                    format(field.value, 'PPP')
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0 border-input' align='start'>
              <Calendar
                mode='single'
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date < new Date() || date < new Date('1900-01-01')
                }
                initialFocus
                className='bg-background rounded-lg'
              />
            </PopoverContent>
          </Popover>
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  )
}
