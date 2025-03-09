import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DishWithRelations } from '@/lib/types';

interface DishSelectorCardProps {
  dish: DishWithRelations;
  onClick: () => void;
  isSelected?: boolean;
}

export const DishSelectorCard = memo(function DishSelectorCard({
  dish,
  onClick,
  isSelected,
}: DishSelectorCardProps) {
  return (
    <button onClick={onClick} className="w-full text-left">
      <Card
        className={`transition-colors duration-200 ${
          isSelected
            ? 'hover:bg-destructive/10 border-destructive/50'
            : 'hover:bg-accent/10 hover:border-accent-foreground/50'
        }`}
      >
        <CardContent className="p-4">
          <div className="font-medium">{dish.name}</div>
          {dish.description && (
            <div className="text-sm text-muted-foreground line-clamp-1">
              {dish.description}
            </div>
          )}
          {dish.category && (
            <div className="text-sm text-primary mt-1">
              {dish.category.name}
            </div>
          )}
        </CardContent>
      </Card>
    </button>
  );
});
