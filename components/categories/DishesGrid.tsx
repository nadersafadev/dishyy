'use client';

import { UtensilsCrossedIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BaseEntityGridProps } from '@/lib/types/entity';
import { EntityGrid } from '@/components/ui/entity-grid';

interface DishInCategory {
  id: string;
  name: string;
  imageUrl: string | null;
}

type CategoryDishesGridProps = Omit<
  BaseEntityGridProps<DishInCategory>,
  'pagination' | 'sortBy' | 'sortOrder' | 'baseUrl' | 'renderCard'
> & {
  renderCard?: (dish: DishInCategory) => React.ReactNode;
};

const defaultRenderCard = (dish: DishInCategory) => (
  <Link
    href={`/dishes/${dish.id}`}
    key={dish.id}
    className="flex flex-col items-center p-3 rounded-md border bg-card hover:bg-accent/10 transition-colors"
  >
    <div className="relative aspect-square w-full rounded-md overflow-hidden bg-muted mb-2">
      {dish.imageUrl ? (
        <Image
          src={dish.imageUrl}
          alt={dish.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <UtensilsCrossedIcon className="h-12 w-12 text-muted-foreground/40" />
        </div>
      )}
    </div>
    <span className="text-sm font-medium text-center truncate w-full">
      {dish.name}
    </span>
  </Link>
);

export function DishesGrid({
  data,
  renderCard = defaultRenderCard,
}: CategoryDishesGridProps) {
  if (data.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No dishes associated with this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {data.map(dish => renderCard(dish))}
    </div>
  );
}
