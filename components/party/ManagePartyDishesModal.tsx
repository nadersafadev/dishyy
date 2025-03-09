import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DishSelector } from '@/components/dishes/DishSelector';
import { DishWithRelations } from '@/lib/types';
import { PartyDishWithDetails } from '@/lib/services/dish';
import { toast } from '@/lib/toast';
import { DeleteEntityDialog } from '@/components/ui/delete-entity-dialog';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/forms/input';

interface ManagePartyDishesModalProps {
  partyId: string;
  currentDishes: PartyDishWithDetails[];
}

export function ManagePartyDishesModal({
  partyId,
  currentDishes,
}: ManagePartyDishesModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableDishes, setAvailableDishes] = useState<DishWithRelations[]>(
    []
  );
  const [selectedDishes, setSelectedDishes] = useState<DishWithRelations[]>(
    currentDishes.map(pd => ({
      ...pd.dish,
      id: pd.dishId,
      imageId: null,
      _count: { parties: 0 },
      category: pd.dish.category
        ? {
            ...pd.dish.category,
            createdAt: new Date(),
            updatedAt: new Date(),
            description: null,
            imageUrl: null,
            imageId: null,
            dishes: [],
            subcategories: [],
          }
        : null,
    }))
  );
  const [dishQuantities, setDishQuantities] = useState<Record<string, number>>(
    currentDishes.reduce(
      (acc, dish) => ({
        ...acc,
        [dish.dishId]: dish.amountPerPerson,
      }),
      {}
    )
  );
  const [tempQuantities, setTempQuantities] = useState<Record<string, number>>(
    currentDishes.reduce(
      (acc, dish) => ({
        ...acc,
        [dish.dishId]: dish.amountPerPerson,
      }),
      {}
    )
  );
  const [updatingDishId, setUpdatingDishId] = useState<string | null>(null);
  const [dishToRemove, setDishToRemove] = useState<DishWithRelations | null>(
    null
  );

  // Fetch available dishes when dialog opens
  const fetchDishes = async (search?: string) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      const response = await fetch(`/api/dishes?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch dishes');
      const data = await response.json();
      setAvailableDishes(data.dishes || []);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      toast.error('Error', 'Failed to load dishes');
      setAvailableDishes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDishSelect = async (dish: DishWithRelations) => {
    try {
      const response = await fetch(`/api/parties/${partyId}/dishes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dishId: dish.id,
          amountPerPerson: 1, // Default amount
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add dish');
      }

      setSelectedDishes(prev => [...prev, dish]);
      setDishQuantities(prev => ({ ...prev, [dish.id]: 1 }));
      setTempQuantities(prev => ({ ...prev, [dish.id]: 1 }));
      toast.success('Success', 'Dish added to party successfully');
      router.refresh();
    } catch (error) {
      console.error('Error adding dish:', error);
      toast.error(
        'Error',
        error instanceof Error ? error.message : 'Failed to add dish'
      );
    }
  };

  const handleDishDeselect = (dishId: string) => {
    const dish = selectedDishes.find(d => d.id === dishId);
    if (!dish) return;
    setDishToRemove(dish);
  };

  const handleDishCreated = (dish: DishWithRelations) => {
    setAvailableDishes(prev => [...prev, dish]);
  };

  const handleQuantityChange = (dishId: string, amount: number) => {
    setTempQuantities(prev => ({ ...prev, [dishId]: amount }));
  };

  const handleQuantitySubmit = async (dishId: string) => {
    const newAmount = tempQuantities[dishId];
    if (newAmount === dishQuantities[dishId]) return;

    try {
      setUpdatingDishId(dishId);
      const response = await fetch(`/api/parties/${partyId}/dishes/${dishId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amountPerPerson: newAmount,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update quantity');
      }

      setDishQuantities(prev => ({ ...prev, [dishId]: newAmount }));
      toast.success('Success', 'Quantity updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(
        'Error',
        error instanceof Error ? error.message : 'Failed to update quantity'
      );
      // Reset temp quantity on error
      setTempQuantities(prev => ({
        ...prev,
        [dishId]: dishQuantities[dishId],
      }));
    } finally {
      setUpdatingDishId(null);
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={open => {
          setIsOpen(open);
          if (open) fetchDishes();
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 whitespace-nowrap"
            data-manage-dishes-trigger
          >
            <Plus className="h-4 w-4 mr-2 shrink-0" />
            <span className="sm:inline">Manage Dishes</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[calc(100%-2rem)] max-w-5xl h-[calc(100vh-2rem)] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>Manage Party Dishes</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-6">
              <DishSelector
                availableDishes={availableDishes}
                selectedDishes={selectedDishes}
                onDishSelect={handleDishSelect}
                onDishDeselect={handleDishDeselect}
                onDishCreated={handleDishCreated}
                onSearch={fetchDishes}
                isLoading={isLoading}
              />

              {selectedDishes.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-medium mb-4">Amount per Person</h3>
                  <div className="space-y-4">
                    {selectedDishes.map(dish => (
                      <div
                        key={dish.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-2"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {dish.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {dish.unit}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:w-auto w-full">
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            value={tempQuantities[dish.id] || 0}
                            onChange={e =>
                              handleQuantityChange(
                                dish.id,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full sm:w-24"
                          />
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleQuantitySubmit(dish.id)}
                            disabled={
                              updatingDishId === dish.id ||
                              tempQuantities[dish.id] ===
                                dishQuantities[dish.id]
                            }
                            className="h-9 px-2 shrink-0"
                          >
                            {updatingDishId === dish.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {dishToRemove && (
        <DeleteEntityDialog
          entityId={dishToRemove.id}
          entityName={dishToRemove.name}
          entityType="Dish"
          deleteEndpoint={`/api/parties/${partyId}/dishes/${dishToRemove.id}`}
          warnings={[
            {
              type: 'warning',
              title: 'Warning',
              message: 'This will remove all contributions for this dish.',
            },
          ]}
          open={!!dishToRemove}
          onOpenChange={open => {
            if (!open) setDishToRemove(null);
          }}
          onSuccess={() => {
            setSelectedDishes(prev =>
              prev.filter(dish => dish.id !== dishToRemove.id)
            );
            setDishQuantities(prev => {
              const newQuantities = { ...prev };
              delete newQuantities[dishToRemove.id];
              return newQuantities;
            });
            setTempQuantities(prev => {
              const newQuantities = { ...prev };
              delete newQuantities[dishToRemove.id];
              return newQuantities;
            });
            router.refresh();
          }}
        />
      )}
    </>
  );
}
