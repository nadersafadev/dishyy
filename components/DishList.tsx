'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { EditButton } from '@/components/ui/edit-button';
import { DeleteButton } from '@/components/ui/delete-button';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Dish } from '@prisma/client';
import { DeleteDishDialog } from '@/components/dishes/DeleteDishDialog';

interface DishWithCount extends Dish {
  _count: {
    parties: number;
  };
}

interface DishListProps {
  dishes: DishWithCount[];
  view?: 'grid' | 'list';
}

export default function DishList({ dishes, view = 'grid' }: DishListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  if (dishes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No dishes available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg">
          {error}
        </div>
      )}

      <div
        className={cn(
          view === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        )}
      >
        {dishes.map(dish => (
          <div
            key={dish.id}
            className={cn(
              'card p-4 sm:p-6 hover:border-primary hover-transition group relative',
              view === 'list' &&
                'flex flex-col sm:flex-row sm:items-center justify-between gap-4'
            )}
          >
            {/* Position actions absolutely in grid view */}
            {view === 'grid' && (
              <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <EditButton
                  variant="secondary"
                  className="bg-background/80 backdrop-blur-sm"
                  onClick={() => router.push(`/dishes/${dish.id}/edit`)}
                  label={`Edit ${dish.name}`}
                />

                <DeleteDishDialog
                  dishId={dish.id}
                  dishName={dish.name}
                  inMenuCount={dish._count.parties}
                  trigger={
                    <DeleteButton
                      className="bg-background/80 backdrop-blur-sm"
                      label={`Delete ${dish.name}`}
                    />
                  }
                />
              </div>
            )}

            <div className={cn('space-y-2', view === 'list' && 'flex-1')}>
              <div className="flex items-start gap-4">
                {/* Image Section */}
                <div className="relative shrink-0 w-24 h-24 rounded-md overflow-hidden bg-muted">
                  {dish.imageUrl ? (
                    <Image
                      src={dish.imageUrl}
                      alt={dish.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 96px, 96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{dish.name}</h3>
                  {dish.description && (
                    <p
                      className={cn(
                        'text-sm text-muted-foreground',
                        view === 'grid'
                          ? 'line-clamp-2'
                          : 'line-clamp-2 sm:line-clamp-1'
                      )}
                    >
                      {dish.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Used in {dish._count.parties}{' '}
                    {dish._count.parties === 1 ? 'party' : 'parties'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Section - List View Only */}
            {view === 'list' && (
              <div className="flex items-center gap-4 mt-4 sm:mt-0 shrink-0">
                <EditButton
                  onClick={() => router.push(`/dishes/${dish.id}/edit`)}
                  label={`Edit ${dish.name}`}
                />

                <DeleteDishDialog
                  dishId={dish.id}
                  dishName={dish.name}
                  inMenuCount={dish._count.parties}
                  trigger={<DeleteButton label={`Delete ${dish.name}`} />}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
