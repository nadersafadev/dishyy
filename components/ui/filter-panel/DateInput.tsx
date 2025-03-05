import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/forms/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function DateInput({ id, label, value, onChange }: DateInputProps) {
  const date = value ? new Date(value) : undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'w-full pl-3 text-left font-normal border-input bg-background hover:bg-background hover:text-foreground focus-visible:ring-0',
              !date && 'text-muted-foreground'
            )}
          >
            {date ? format(date, 'PPP') : 'Pick a date'}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-input" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={date => onChange(date?.toISOString() || '')}
            disabled={date =>
              date < new Date() || date < new Date('1900-01-01')
            }
            initialFocus
            className="bg-background rounded-lg"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
