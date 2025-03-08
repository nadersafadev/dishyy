'use client';

import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { DishWithRelations, PaginationMeta } from '@/lib/types';
import { Plus } from 'lucide-react';
import { DishesGrid } from './DishesGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DishForm } from '@/components/DishForm';
import { SearchInput } from '@/components/forms/search-input';
import { SelectorGrid } from '@/components/ui/entity-grid/selector-grid';

interface DishSelectorProps {
  availableDishes: DishWithRelations[];
  selectedDishes: DishWithRelations[];
  onDishSelect: (dish: DishWithRelations) => void;
  onDishDeselect: (dishId: string) => void;
  onDishCreated?: (dish: DishWithRelations) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const emptyPagination: PaginationMeta = {
  page: 1,
  limit: 1000,
  totalCount: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

// Memoized DishCard component to prevent unnecessary re-renders
const DishCard = memo(
  ({
    dish,
    onClick,
    isSelected,
  }: {
    dish: DishWithRelations;
    onClick: () => void;
    isSelected?: boolean;
  }) => (
    <button onClick={onClick} className="w-full text-left">
      <Card
        className={isSelected ? 'hover:bg-destructive/10' : 'hover:bg-accent'}
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
  )
);
DishCard.displayName = 'DishCard';

interface AvailableDishesProps {
  dishes: DishWithRelations[];
  selectedDishIds: string[];
  onSelect: (dish: DishWithRelations) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const DishCardSkeleton = () => (
  <Card>
    <CardContent className="p-4 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/4 mt-1" />
    </CardContent>
  </Card>
);

// Separate component for available dishes with its own search state
const AvailableDishes = memo(
  ({
    dishes,
    selectedDishIds,
    onSelect,
    onSearch,
    isLoading,
  }: AvailableDishesProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const searchTimeout = useRef<NodeJS.Timeout>();

    // Filter out selected dishes
    const availableDishes = useMemo(() => {
      const selectedSet = new Set(selectedDishIds);
      return dishes.filter(dish => !selectedSet.has(dish.id));
    }, [dishes, selectedDishIds]);

    const handleSearchChange = useCallback(
      (value: string) => {
        setSearchQuery(value);

        // Clear previous timeout
        if (searchTimeout.current) {
          clearTimeout(searchTimeout.current);
        }

        // Only trigger search if there's a value
        if (value.trim()) {
          searchTimeout.current = setTimeout(() => {
            onSearch(value);
          }, 500);
        } else {
          // If empty, search immediately to reset results
          onSearch('');
        }
      },
      [onSearch]
    );

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (searchTimeout.current) {
          clearTimeout(searchTimeout.current);
        }
      };
    }, []);

    return (
      <div className="space-y-4">
        <SearchInput
          placeholder="Search dishes by name, description, or category..."
          value={searchQuery}
          onSearchChange={handleSearchChange}
        />
        <Card>
          <CardHeader>
            <CardTitle>Available Dishes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 grid-cols-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <DishCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <SelectorGrid
                data={availableDishes}
                renderCard={dish => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onClick={() => onSelect(structuredClone(dish))}
                  />
                )}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
);
AvailableDishes.displayName = 'AvailableDishes';

// Separate component for selected dishes
const SelectedDishes = memo(
  ({
    dishes,
    onDeselect,
  }: {
    dishes: DishWithRelations[];
    onDeselect: (id: string) => void;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle>Selected Dishes ({dishes.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <SelectorGrid
          data={dishes}
          renderCard={dish => (
            <DishCard
              key={dish.id}
              dish={dish}
              onClick={() => onDeselect(dish.id)}
              isSelected
            />
          )}
        />
      </CardContent>
    </Card>
  )
);
SelectedDishes.displayName = 'SelectedDishes';

export function DishSelector({
  availableDishes,
  selectedDishes,
  onDishSelect,
  onDishDeselect,
  onDishCreated,
  onSearch,
  isLoading,
}: DishSelectorProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Get just the IDs for filtering available dishes
  const selectedDishIds = useMemo(
    () => selectedDishes.map(dish => dish.id),
    [selectedDishes]
  );

  const handleCreateDialogOpen = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const handleDishCreated = useCallback(
    (dish: DishWithRelations) => {
      // Close dialog first
      setIsCreateDialogOpen(false);

      // Prepare dish with relations
      const dishWithRelations: DishWithRelations = {
        ...dish,
        category: dish.category || null,
        _count: { parties: 0 },
      };

      // Call parent callbacks
      if (onDishCreated) {
        onDishCreated(dishWithRelations);
      }
      onDishSelect(dishWithRelations);
    },
    [onDishCreated, onDishSelect]
  );

  return (
    <>
      <div className="space-y-6">
        <Button onClick={handleCreateDialogOpen} className="gap-2">
          <Plus className="h-4 w-4" />
          New Dish
        </Button>

        <div className="grid gap-6 md:grid-cols-2">
          <AvailableDishes
            dishes={availableDishes}
            selectedDishIds={selectedDishIds}
            onSelect={onDishSelect}
            onSearch={onSearch}
            isLoading={isLoading}
          />
          <SelectedDishes dishes={selectedDishes} onDeselect={onDishDeselect} />
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Dish</DialogTitle>
          </DialogHeader>
          <DishForm
            onSuccess={dish => {
              // Close dialog first
              setIsCreateDialogOpen(false);

              // Prepare dish with relations
              const dishWithRelations: DishWithRelations = {
                ...dish,
                category: dish.category || null,
                _count: { parties: 0 },
              };

              // Call parent callbacks
              if (onDishCreated) {
                onDishCreated(dishWithRelations);
              }
              onDishSelect(dishWithRelations);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
