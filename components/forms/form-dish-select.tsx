'use client';

import { useState, useEffect } from 'react';
import { Dish, Unit, unitLabels } from '@/lib/types';
import {
  FormSelectField,
  SortOption,
} from '@/components/forms/form-select-field';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/forms/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/forms/select';
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';

// Dish-specific sort options
const DISH_SORT_OPTIONS: SortOption[] = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'least-popular', label: 'Least Popular' },
];

// Schema for dish creation
const createDishSchema = z.object({
  name: z.string().min(1, 'Dish name is required'),
  description: z.string().optional(),
  unit: z.nativeEnum(Unit),
});

export interface FormDishSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  selectedDishes: Dish[];
  onSelectDish: (dish: Dish) => void;

  // Make these features optional with defaults set to true
  showSearch?: boolean;
  showSort?: boolean;
  showCreateOption?: boolean;
}

export function FormDishSelect({
  name,
  label,
  placeholder = 'Select dishes...',
  selectedDishes,
  onSelectDish,

  // Set defaults to ensure these features are enabled unless explicitly disabled
  showSearch = true,
  showSort = true,
  showCreateOption = true,
}: FormDishSelectProps) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the new dish form
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    unit: Unit.QUANTITY,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setIsLoading(true);

        // Fetch dishes from API
        const response = await fetch('/api/dishes');
        if (!response.ok) {
          throw new Error('Failed to fetch dishes');
        }

        const data = await response.json();

        // Check if the response contains a dishes array or is an array itself
        const dishesArray = data.dishes || data;

        // Make sure we always set an array, even if the API returns something unexpected
        setDishes(Array.isArray(dishesArray) ? dishesArray : []);
      } catch (error) {
        console.error('Error fetching dishes:', error);
        setError('Failed to load dishes');
        // Make sure dishes is initialized as an empty array on error
        setDishes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDishes();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewDish(prev => ({ ...prev, [name]: value }));
  };

  // Handle unit selection
  const handleUnitChange = (value: string) => {
    setNewDish(prev => ({ ...prev, unit: value as Unit }));
  };

  // Handle dish creation
  const handleCreateDish = async () => {
    try {
      setFormError(null);
      setIsCreating(true);

      // Validate form data
      const validationResult = createDishSchema.safeParse(newDish);
      if (!validationResult.success) {
        setFormError(
          validationResult.error.errors[0]?.message || 'Invalid form data'
        );
        return;
      }

      // Create the dish via API
      const response = await fetch('/api/dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDish),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create dish');
      }

      // Get the created dish and add it to the list
      const createdDish = await response.json();
      setDishes(prev => [...prev, createdDish]);

      // Select the newly created dish
      onSelectDish(createdDish);

      // Reset the form
      setNewDish({
        name: '',
        description: '',
        unit: Unit.QUANTITY,
      });

      return true; // Return true to close the dialog
    } catch (error: any) {
      console.error('Error creating dish:', error);
      setFormError(error.message || 'Failed to create dish');
      return false; // Keep the dialog open
    } finally {
      setIsCreating(false);
    }
  };

  // Create the dialog content component
  const createDishDialogContent = (
    <>
      <DialogHeader>
        <DialogTitle>Create New Dish</DialogTitle>
      </DialogHeader>

      {formError && (
        <div className="p-3 my-2 text-sm text-destructive bg-destructive/10 rounded-md">
          {formError}
        </div>
      )}

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Dish Name</Label>
          <Input
            id="name"
            name="name"
            value={newDish.name}
            onChange={handleInputChange}
            placeholder="Enter dish name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            name="description"
            value={newDish.description}
            onChange={handleInputChange}
            placeholder="Enter dish description"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select value={newDish.unit} onValueChange={handleUnitChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a unit" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(unitLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            // Reset form on cancel
            setNewDish({
              name: '',
              description: '',
              unit: Unit.QUANTITY,
            });
            setFormError(null);
            return true; // Close the dialog
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleCreateDish} disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create Dish'}
        </Button>
      </DialogFooter>
    </>
  );

  // Custom renderer for dish items
  const renderDishItem = (dish: Dish) => {
    return (
      <div className="flex items-center justify-between w-full">
        <div>
          <span>{dish.name}</span>
          {dish.description && (
            <span className="ml-2 text-muted-foreground">
              - {dish.description}
            </span>
          )}
          <Badge variant="outline" className="ml-2">
            {unitLabels[dish.unit]}
          </Badge>
        </div>
        {dish._count && dish._count.parties > 0 && (
          <Badge variant="secondary" className="ml-2">
            Used in {dish._count.parties}{' '}
            {dish._count.parties === 1 ? 'party' : 'parties'}
          </Badge>
        )}
      </div>
    );
  };

  // For debugging
  console.log('FormDishSelect props:', {
    showSort,
    showSearch,
    showCreateOption,
  });
  console.log('Dishes loaded:', dishes.length);

  return (
    <>
      {error && (
        <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      <FormSelectField
        name={name}
        label={label}
        placeholder={placeholder}
        items={dishes}
        selectedItems={selectedDishes}
        getItemId={dish => dish.id}
        getItemLabel={dish => dish.name}
        getItemDescription={dish => dish.description || undefined}
        onSelectItem={onSelectDish}
        // Explicitly pass these props
        showSearch={showSearch}
        searchPlaceholder="Search dishes..."
        searchKeys={['name', 'description']}
        // Sort options
        showSortOption={showSort}
        sortOptions={DISH_SORT_OPTIONS}
        defaultSortOption="name-asc"
        // Use the new dialog approach for creating dishes
        showCreateOption={showCreateOption}
        dialogContent={showCreateOption ? createDishDialogContent : undefined}
        dialogTriggerButtonLabel="Create New Dish"
        onDialogOpenChange={open => {
          if (!open) {
            // Reset form when dialog closes
            setNewDish({
              name: '',
              description: '',
              unit: Unit.QUANTITY,
            });
            setFormError(null);
          }
        }}
        // Other props
        noItemsFoundText="No dishes found."
        isLoading={isLoading}
        loadingText="Loading dishes..."
        selectionDisplayText={count =>
          `${count} dish${count === 1 ? '' : 'es'} selected`
        }
        renderItem={renderDishItem}
      />
    </>
  );
}
