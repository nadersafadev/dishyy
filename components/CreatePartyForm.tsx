'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  CalendarIcon,
  ArrowUpDown,
  PlusIcon,
  ChevronDownIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { Unit, unitLabels, type Dish } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/forms/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FormTextField } from '@/components/ui/forms/form-text-field';
import { FormDateField } from '@/components/ui/form-date-field';

type SortOption = 'name-asc' | 'name-desc' | 'popular' | 'least-popular';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  date: z.date({
    required_error: 'Please select a date',
  }),
  dishIds: z.array(z.string()).min(1, 'At least one dish is required'),
  maxParticipants: z.number().positive().optional(),
  dishAmounts: z.record(
    z.string(),
    z.number().positive('Amount must be greater than 0')
  ),
});

type FormData = z.infer<typeof formSchema>;

const dishSchema = z.object({
  name: z.string().min(1, 'Dish name is required'),
  description: z.string().optional(),
  unit: z.nativeEnum(Unit),
});

const CreatePartyForm: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoadingDishes, setIsLoadingDishes] = useState(true);
  const [selectedDishes, setSelectedDishes] = useState<Dish[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingDish, setIsCreatingDish] = useState(false);
  const [isCreatingNewDish, setIsCreatingNewDish] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishDescription, setNewDishDescription] = useState('');
  const [newDishUnit, setNewDishUnit] = useState<Unit>(Unit.QUANTITY);
  const [dishAmounts, setDishAmounts] = useState<Record<string, number>>({});

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      dishIds: [],
      maxParticipants: undefined,
      dishAmounts: {},
    },
  });

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch('/api/dishes');
        if (!response.ok) {
          throw new Error('Failed to fetch dishes');
        }
        const data = await response.json();
        setDishes(data);
      } catch (error) {
        console.error('Error fetching dishes:', error);
        setError('Failed to load dishes');
      } finally {
        setIsLoadingDishes(false);
      }
    };

    fetchDishes();
  }, []);

  const sortedAndFilteredDishes = useMemo(() => {
    let filteredDishes = [...dishes];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredDishes = filteredDishes.filter(
        dish =>
          dish.name.toLowerCase().includes(query) ||
          dish.description?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'name-asc':
        return filteredDishes.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return filteredDishes.sort((a, b) => b.name.localeCompare(a.name));
      case 'popular':
        return filteredDishes.sort(
          (a, b) => (b._count?.parties || 0) - (a._count?.parties || 0)
        );
      case 'least-popular':
        return filteredDishes.sort(
          (a, b) => (a._count?.parties || 0) - (b._count?.parties || 0)
        );
      default:
        return filteredDishes;
    }
  }, [dishes, sortOption, searchQuery]);

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      setSuccess(false);

      const response = await fetch('/api/parties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          date: data.date.toISOString(),
          maxParticipants: data.maxParticipants
            ? Number(data.maxParticipants)
            : undefined,
          dishes: data.dishIds.map(dishId => ({
            dishId,
            amountPerPerson: data.dishAmounts[dishId],
          })),
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess(true);
        form.reset();
        setSelectedDishes([]);
        setDishAmounts({});
        router.refresh();
      } else {
        setError(responseData.error || 'Failed to create party');
      }
    } catch (error) {
      console.error('Error creating party:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleSelectDish = (dish: Dish) => {
    const currentDishIds = form.getValues('dishIds');
    if (!currentDishIds.includes(dish.id)) {
      form.setValue('dishIds', [...currentDishIds, dish.id]);
      setSelectedDishes([...selectedDishes, dish]);
      // Set default amount of 1 for the new dish
      const currentAmounts = form.getValues('dishAmounts');
      form.setValue('dishAmounts', { ...currentAmounts, [dish.id]: 1 });
      setDishAmounts(prev => ({ ...prev, [dish.id]: 1 }));
    }
    setCommandOpen(false);
  };

  const handleRemoveDish = (dishId: string) => {
    const currentDishIds = form.getValues('dishIds');
    form.setValue(
      'dishIds',
      currentDishIds.filter(id => id !== dishId)
    );
    setSelectedDishes(selectedDishes.filter(dish => dish.id !== dishId));
    // Remove amount for the removed dish
    const currentAmounts = form.getValues('dishAmounts');
    const { [dishId]: _, ...newAmounts } = currentAmounts;
    form.setValue('dishAmounts', newAmounts);
    const { [dishId]: __, ...newDishAmounts } = dishAmounts;
    setDishAmounts(newDishAmounts);
  };

  const handleAmountChange = (dishId: string, amount: string) => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      const currentAmounts = form.getValues('dishAmounts');
      form.setValue('dishAmounts', {
        ...currentAmounts,
        [dishId]: numericAmount,
      });
      setDishAmounts(prev => ({ ...prev, [dishId]: numericAmount }));
    }
  };

  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDishName.trim()) return;

    try {
      setIsCreatingNewDish(true);
      setError(null);

      const response = await fetch('/api/dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newDishName.trim(),
          description: newDishDescription.trim() || undefined,
          unit: newDishUnit,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add the new dish to the list and select it
        setDishes(prev => [...prev, data]);
        handleSelectDish(data);

        // Reset the form
        setNewDishName('');
        setNewDishDescription('');
        setNewDishUnit(Unit.QUANTITY);
        setIsCreatingDish(false);
      } else {
        setError(data.error || 'Failed to create dish');
      }
    } catch (error) {
      console.error('Error creating dish:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsCreatingNewDish(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-primary/10 text-primary rounded-lg text-sm">
          Party created successfully!
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormTextField
            name="name"
            label="Party Name"
            placeholder="Enter party name"
          />

          <FormTextField
            name="description"
            label="Description"
            placeholder="Describe your dish party"
            optional
          />

          <FormTextField
            name="maxParticipants"
            label="Maximum Participants"
            type="number"
            placeholder="Enter maximum number of participants"
            min={1}
            optional
          />

          <FormDateField name="date" label="Date" placeholder="Pick a date" />

          <FormField
            control={form.control}
            name="dishIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Dishes</FormLabel>
                <div className="space-y-4">
                  <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between border-input bg-background text-sm font-normal"
                        >
                          {selectedDishes.length > 0
                            ? `${selectedDishes.length} dish${
                                selectedDishes.length === 1 ? '' : 'es'
                              } selected`
                            : 'Select dishes...'}
                          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <div className="flex items-center gap-2 p-2 border-b">
                          <div className="flex-1">
                            <CommandInput
                              placeholder="Search dishes..."
                              value={searchQuery}
                              onValueChange={setSearchQuery}
                            />
                          </div>
                          <Select
                            value={sortOption}
                            onValueChange={value =>
                              setSortOption(value as SortOption)
                            }
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Sort by..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="name-asc">
                                Name (A-Z)
                              </SelectItem>
                              <SelectItem value="name-desc">
                                Name (Z-A)
                              </SelectItem>
                              <SelectItem value="popular">
                                Most Popular
                              </SelectItem>
                              <SelectItem value="least-popular">
                                Least Popular
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <CommandEmpty>
                          <p className="p-2 text-sm text-center text-muted-foreground">
                            No dishes found.
                          </p>
                        </CommandEmpty>
                        <CommandGroup>
                          <div className="p-2">
                            <Button
                              variant="outline"
                              className="w-full gap-2"
                              onClick={() => {
                                setIsCreatingDish(true);
                                setCommandOpen(false);
                              }}
                            >
                              <PlusIcon className="h-4 w-4" />
                              Create New Dish
                            </Button>
                          </div>
                          <CommandSeparator />
                          {isLoadingDishes ? (
                            <CommandItem disabled>Loading...</CommandItem>
                          ) : (
                            <>
                              {sortedAndFilteredDishes.map(dish => (
                                <CommandItem
                                  key={dish.id}
                                  onSelect={() => handleSelectDish(dish)}
                                  disabled={field.value.includes(dish.id)}
                                  className="flex items-center justify-between"
                                >
                                  <div>
                                    <span>{dish.name}</span>
                                    {dish.description && (
                                      <span className="ml-2 text-muted-foreground">
                                        - {dish.description}
                                      </span>
                                    )}
                                  </div>
                                  {dish._count && (
                                    <Badge variant="secondary" className="ml-2">
                                      Used in {dish._count.parties}{' '}
                                      {dish._count.parties === 1
                                        ? 'party'
                                        : 'parties'}
                                    </Badge>
                                  )}
                                </CommandItem>
                              ))}
                            </>
                          )}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Quick Create Dish Dialog */}
                  <Dialog
                    open={isCreatingDish}
                    onOpenChange={setIsCreatingDish}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Dish</DialogTitle>
                        <DialogDescription>
                          Add a new dish that can be included in parties.
                        </DialogDescription>
                      </DialogHeader>

                      <form onSubmit={handleCreateDish} className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={newDishName}
                              onChange={e => setNewDishName(e.target.value)}
                              placeholder="Enter dish name"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">
                              Description (Optional)
                            </Label>
                            <Input
                              id="description"
                              value={newDishDescription}
                              onChange={e =>
                                setNewDishDescription(e.target.value)
                              }
                              placeholder="Enter dish description"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="unit">Unit</Label>
                            <Select
                              value={newDishUnit}
                              onValueChange={(value: Unit) =>
                                setNewDishUnit(value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a unit" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(unitLabels).map(
                                  ([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCreatingDish(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isCreatingNewDish}>
                            {isCreatingNewDish ? 'Creating...' : 'Create Dish'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {selectedDishes.length > 0 && (
                    <div className="space-y-4">
                      {selectedDishes.map(dish => (
                        <div
                          key={dish.id}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex-1 min-w-0 space-y-1 sm:space-y-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium truncate">
                                {dish.name}
                              </span>
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
                                value={dishAmounts[dish.id] || ''}
                                onChange={e =>
                                  handleAmountChange(dish.id, e.target.value)
                                }
                                className="w-24"
                                placeholder="Amount"
                                step="0.1"
                                min="0.1"
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
                              onClick={() => handleRemoveDish(dish.id)}
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage className="text-xs" />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Creating...' : 'Create Party'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreatePartyForm;
