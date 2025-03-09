'use client';

import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { DishWithRelations, PaginationMeta, Dish } from '@/lib/types';
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
import { DishSelectorCard } from './DishSelectorCard';

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

const DishCardSkeleton = () => (
  <Card>
    <CardContent className="p-4 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/4 mt-1" />
    </CardContent>
  </Card>
);

interface AvailableDishesProps {
  dishes: DishWithRelations[];
  selectedDishIds: string[];
  onSelect: (dish: DishWithRelations) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

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
          placeholder="Search dishes..."
          value={searchQuery}
          onSearchChange={handleSearchChange}
          className="w-full"
        />
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Available Dishes</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {isLoading ? (
              <div className="grid gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <DishCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <SelectorGrid
                data={availableDishes}
                renderCard={dish => (
                  <DishSelectorCard
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
      <CardHeader className="p-4">
        <CardTitle className="text-lg">
          Selected Dishes ({dishes.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <SelectorGrid
          data={dishes}
          renderCard={dish => (
            <DishSelectorCard
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

  const selectedDishIds = useMemo(
    () => selectedDishes.map(dish => dish.id),
    [selectedDishes]
  );

  const handleCreateDialogOpen = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const handleDishCreated = useCallback(
    (dish: Dish) => {
      // Close dialog first
      setIsCreateDialogOpen(false);

      // Prepare dish with relations
      const dishWithRelations: DishWithRelations = {
        ...dish,
        id: dish.id,
        imageId: null,
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
    <div className="space-y-4">
      <Button
        onClick={handleCreateDialogOpen}
        className="w-full sm:w-auto gap-2"
      >
        <Plus className="h-4 w-4 shrink-0" />
        <span>New Dish</span>
      </Button>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <AvailableDishes
          dishes={availableDishes}
          selectedDishIds={selectedDishIds}
          onSelect={onDishSelect}
          onSearch={onSearch}
          isLoading={isLoading}
        />
        <SelectedDishes dishes={selectedDishes} onDeselect={onDishDeselect} />
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-auto max-w-2xl h-[calc(100vh-2rem)] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>Create New Dish</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <DishForm onSuccess={handleDishCreated} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
