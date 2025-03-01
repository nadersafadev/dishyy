interface Dish {
  id: string;
  name: string;
  unit: string;
}

interface DishesGridProps {
  dishes: Dish[];
}

export function DishesGrid({ dishes }: DishesGridProps) {
  if (dishes.length === 0) {
    return (
      <p className="text-muted-foreground">
        No dishes associated with this category.
      </p>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
      {dishes.map(dish => (
        <div
          key={dish.id}
          className="border rounded-md p-3 hover:bg-muted/50 transition-colors"
        >
          <div className="font-medium">{dish.name}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Unit: {dish.unit}
          </div>
        </div>
      ))}
    </div>
  );
}
