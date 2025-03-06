import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/forms/calendar';
import { Input } from '@/components/forms/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FormDateTimeFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  optional?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  description?: string;
}

export function FormDateTimeField({
  name,
  label,
  placeholder = 'Pick a date and time',
  className,
  optional = false,
  disabled = false,
  min,
  max,
  description,
}: FormDateTimeFieldProps) {
  const form = useFormContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && selectedTime) {
      const [hours, minutes] = selectedTime.split(':');
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours, 10));
      newDate.setMinutes(parseInt(minutes, 10));
      form.setValue(name, newDate.toISOString());
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (selectedDate && time) {
      const [hours, minutes] = time.split(':');
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hours, 10));
      newDate.setMinutes(parseInt(minutes, 10));
      form.setValue(name, newDate.toISOString());
    }
  };

  const value = form.watch(name);
  const dateValue = value ? new Date(value) : undefined;

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
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      'w-full pl-3 text-left font-normal border-input bg-background hover:bg-background hover:text-foreground focus-visible:ring-0',
                      !field.value && 'text-muted-foreground',
                      className
                    )}
                  >
                    {field.value ? (
                      format(dateValue!, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-input" align="start">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={handleDateSelect}
                  disabled={date =>
                    date < new Date() || date < new Date('1900-01-01')
                  }
                  initialFocus
                  className="bg-background rounded-lg"
                />
              </PopoverContent>
            </Popover>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={selectedTime}
                onChange={e => handleTimeChange(e.target.value)}
                className="pl-9"
                disabled={disabled}
                min={
                  min
                    ? new Date(min).toLocaleTimeString('en-US', {
                        hour12: false,
                      })
                    : undefined
                }
                max={
                  max
                    ? new Date(max).toLocaleTimeString('en-US', {
                        hour12: false,
                      })
                    : undefined
                }
              />
            </div>
          </div>
          {description && (
            <FormDescription className="text-xs">{description}</FormDescription>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
