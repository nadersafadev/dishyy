'use client';

import { Button } from '@/components/ui/button';
import { Minus, Plus, User, AlertCircle } from 'lucide-react';

interface GuestSelectionProps {
  value: number;
  onChange: (value: number) => void;
  maxGuests?: number;
  currentGuests?: number;
}

export function GuestSelection({
  value,
  onChange,
  maxGuests,
  currentGuests = 0,
}: GuestSelectionProps) {
  const availableSlots = maxGuests ? maxGuests - currentGuests : undefined;
  const isExceeded = availableSlots !== undefined && value > availableSlots;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Additional Guests</label>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          You are not counted as a guest
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="h-8 w-8 shrink-0 hover:bg-accent/10"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="flex-1 text-center">
          <span className="text-2xl font-semibold">{value}</span>
          <span className="text-sm text-muted-foreground ml-2">
            {value === 1 ? 'guest' : 'guests'}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            if (availableSlots === undefined || value < availableSlots) {
              onChange(value + 1);
            }
          }}
          disabled={availableSlots !== undefined && value >= availableSlots}
          className="h-8 w-8 shrink-0 hover:bg-accent/10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-start gap-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">
        <User className="h-3 w-3 mt-0.5 shrink-0" />
        <span className="leading-tight">
          You will be automatically added as a participant
        </span>
      </div>
      {isExceeded && (
        <div className="flex items-start gap-2 text-xs bg-red-50 text-red-700 px-2 py-1 rounded-md border border-red-100">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <span className="leading-tight">
            This exceeds the party's maximum capacity. Please reduce the number
            of guests.
          </span>
        </div>
      )}
      {availableSlots !== undefined && !isExceeded && (
        <div className="text-xs text-muted-foreground text-right">
          {availableSlots - value} spots remaining
        </div>
      )}
    </div>
  );
}
