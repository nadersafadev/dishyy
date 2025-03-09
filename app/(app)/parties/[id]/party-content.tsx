'use client';

import { useState, useMemo } from 'react';
import { ViewToggle } from '@/components/ui/view-toggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PartyDishItem } from '@/components/party-dish-item';
import { ManagePartyDishesModal } from '@/components/party/ManagePartyDishesModal';
import {
  PartyDishWithDetails,
  ParticipantWithContributions,
  CategoryWithDishes,
  organizeDishesByCategory,
  hasSubcategoryDishes,
} from '@/lib/services/dish';

interface DishesContentProps {
  dishes: PartyDishWithDetails[];
  participants: ParticipantWithContributions[];
  isParticipant: boolean;
  totalParticipants: number;
  isAdmin: boolean;
  currentUserId?: string;
  partyId: string;
  participantIds: string[];
}

export function DishesContent({
  dishes,
  participants,
  isParticipant,
  totalParticipants,
  isAdmin,
  currentUserId,
  partyId,
  participantIds,
}: DishesContentProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Create a hierarchical category structure
  const dishesByCategory = useMemo(
    () => organizeDishesByCategory(dishes),
    [dishes]
  );

  // Recursive function to render categories and their subcategories
  const renderCategoryWithDishes = (
    category: CategoryWithDishes,
    level: number = 0
  ) => {
    // Don't render categories with no dishes and no subcategories with dishes
    const hasDirectDishes = category.dishes.length > 0;
    const hasChildDishes = Object.values(category.subcategories).some(
      subcat => subcat.dishes.length > 0 || hasSubcategoryDishes(subcat)
    );

    if (!hasDirectDishes && !hasChildDishes) {
      return null;
    }

    return (
      <div key={category.id} className={`space-y-4 ${level > 0 ? 'ml-5' : ''}`}>
        <h3
          className={`text-md font-medium ${
            level === 0 ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          {category.name}
        </h3>

        {/* Render dishes in this category */}
        {hasDirectDishes && (
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-1 lg:grid-cols-2 gap-5'
                : 'flex flex-col gap-4'
            }
          >
            {category.dishes.map(partyDish => (
              <PartyDishItem
                key={partyDish.dishId}
                partyDish={partyDish}
                participants={participants}
                totalParticipants={totalParticipants}
                isAdmin={isAdmin}
                isParticipant={isParticipant}
                partyId={partyId}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}

        {/* Render subcategories */}
        {Object.values(category.subcategories).map(subcategory =>
          renderCategoryWithDishes(subcategory, level + 1)
        )}
      </div>
    );
  };

  return (
    <Card className="shadow-sm">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Dishes</h2>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <ManagePartyDishesModal
                partyId={partyId}
                currentDishes={dishes}
              />
            )}
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>

        {dishes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              No dishes have been added to this party yet.
            </p>
            {isAdmin && (
              <Button
                className="mt-4"
                variant="outline"
                onClick={() =>
                  (
                    document.querySelector(
                      '[data-manage-dishes-trigger]'
                    ) as HTMLElement
                  )?.click()
                }
              >
                Add First Dish
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {dishesByCategory.map(category =>
              renderCategoryWithDishes(category)
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
