'use client';

import { Input } from '@/components/forms/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dish, unitLabels } from '@/lib/types';

export interface DishAmountFieldProps {
  dish: Dish;
  amount: number | string;
  onAmountChange: (dishId: string, amount: string) => void;
  onRemove: (dishId: string) => void;
}

export function DishAmountField({
  dish,
  amount,
  onAmountChange,
  onRemove,
}: DishAmountFieldProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 bg-muted/50 rounded-lg">
      <div className="flex-1 min-w-0 space-y-1 sm:space-y-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium truncate">{dish.name}</span>
          <Badge variant="outline" className="shrink-0">
            {unitLabels[dish.unit]}
          </Badge>
        </div>
        {dish.description && (
          <p className="text-sm text-muted-foreground truncate">
            {dish.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-[200px]">
          <Input
            type="number"
            value={amount || ''}
            onChange={e => onAmountChange(dish.id, e.target.value)}
            className="w-24"
            placeholder="Amount"
            step="0.01"
            min="0.01"
          />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {unitLabels[dish.unit]} per person
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive ml-auto sm:ml-0"
          onClick={() => onRemove(dish.id)}
        >
          ×
        </Button>
      </div>
    </div>
  );
}
