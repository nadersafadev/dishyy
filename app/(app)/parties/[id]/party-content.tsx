'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { ViewToggle } from '@/components/ui/view-toggle';
import { DishContributionForm } from '@/components/dish-contribution-form';
import { AddPartyDishDialog } from '@/components/add-party-dish-dialog';
import { RemovePartyDish } from '@/components/remove-party-dish';
import { UpdateDishQuantity } from '@/components/update-dish-quantity';
import {
  PartyDish,
  PartyParticipant,
  ParticipantDishContribution,
} from '@prisma/client';
import { useParams } from 'next/navigation';
import { UtensilsCrossedIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PartyDishItem } from '@/components/party-dish-item';

interface DishesContentProps {
  dishes: (PartyDish & {
    dish: {
      name: string;
      unit: string;
      description: string | null;
      imageUrl: string | null;
      categoryId: string;
      category?: {
        name: string;
        id: string;
        parentId: string | null;
      };
    };
  })[];
  participants: (PartyParticipant & {
    user: {
      name: string;
    };
    contributions: (ParticipantDishContribution & {
      dish: {
        name: string;
        unit: string;
      };
    })[];
  })[];
  isParticipant: boolean;
  totalParticipants: number;
  isAdmin: boolean;
}

export function DishesContent({
  dishes,
  participants,
  isParticipant,
  totalParticipants,
  isAdmin,
}: DishesContentProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const params = useParams();
  const partyId = params.id as string;

  // Create a hierarchical category structure
  const dishesByCategory = useMemo(() => {
    // Track categories and build hierarchy
    const categoryMap: Record<
      string,
      {
        id: string;
        name: string;
        parentId: string | null;
        dishes: typeof dishes;
        subcategories: Record<string, any>;
      }
    > = {};

    // First, create entries for all categories
    dishes.forEach(dish => {
      if (dish.dish.category) {
        const { id, name, parentId } = dish.dish.category;
        if (!categoryMap[id]) {
          categoryMap[id] = {
            id,
            name,
            parentId,
            dishes: [],
            subcategories: {},
          };
        }
      }
    });

    // Second, assign dishes to their categories
    dishes.forEach(dish => {
      const categoryId = dish.dish.categoryId;

      // If dish has a category
      if (categoryId && categoryMap[categoryId]) {
        categoryMap[categoryId].dishes.push(dish);
      }
    });

    // Create an "Uncategorized" group for dishes without categories
    const uncategorizedDishes = dishes.filter(
      dish => !dish.dish.categoryId || !categoryMap[dish.dish.categoryId]
    );

    if (uncategorizedDishes.length > 0) {
      categoryMap['uncategorized'] = {
        id: 'uncategorized',
        name: 'Uncategorized',
        parentId: null,
        dishes: uncategorizedDishes,
        subcategories: {},
      };
    }

    // Build the hierarchy - assign categories to their parents
    Object.values(categoryMap).forEach(category => {
      if (category.parentId && categoryMap[category.parentId]) {
        categoryMap[category.parentId].subcategories[category.id] = category;
      }
    });

    // Extract top-level categories (those without parents or with parents that don't exist in our data)
    const topLevelCategories = Object.values(categoryMap).filter(
      category => !category.parentId || !categoryMap[category.parentId]
    );

    // Sort categories by name, but keep "Uncategorized" at the end
    return topLevelCategories.sort((a, b) => {
      if (a.id === 'uncategorized') return 1;
      if (b.id === 'uncategorized') return -1;
      return a.name.localeCompare(b.name);
    });
  }, [dishes]);

  // Recursive function to render categories and their subcategories
  const renderCategoryWithDishes = (category: any, level: number = 0) => {
    // Don't render categories with no dishes and no subcategories with dishes
    const hasDirectDishes = category.dishes.length > 0;
    const hasChildDishes = Object.values(category.subcategories).some(
      (subcat: any) => subcat.dishes.length > 0 || hasSubcategoryDishes(subcat)
    );

    if (!hasDirectDishes && !hasChildDishes) {
      return null;
    }

    return (
      <div key={category.id} className={`space-y-4 ${level > 0 ? 'ml-5' : ''}`}>
        <h3
          className={`text-md font-medium ${level === 0 ? 'text-foreground' : 'text-muted-foreground'}`}
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
            {category.dishes.map(
              (
                partyDish: PartyDish & {
                  dish: {
                    name: string;
                    unit: string;
                    description: string | null;
                    imageUrl: string | null;
                    categoryId: string;
                    category?: {
                      name: string;
                      id: string;
                      parentId: string | null;
                    };
                  };
                }
              ) => (
                <PartyDishItem
                  key={partyDish.dishId}
                  partyDish={partyDish}
                  participants={participants}
                  totalParticipants={totalParticipants}
                  isAdmin={isAdmin}
                  isParticipant={isParticipant}
                  partyId={partyId}
                />
              )
            )}
          </div>
        )}

        {/* Render subcategories */}
        {Object.values(category.subcategories).map((subcategory: any) =>
          renderCategoryWithDishes(subcategory, level + 1)
        )}
      </div>
    );
  };

  // Helper function to check if a category has dishes in its subcategories
  const hasSubcategoryDishes = (category: any): boolean => {
    if (category.dishes.length > 0) return true;

    return Object.values(category.subcategories).some(
      (subcat: any) => subcat.dishes.length > 0 || hasSubcategoryDishes(subcat)
    );
  };

  return (
    <Card className="shadow-sm">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Dishes</h2>
          <div className="flex items-center gap-4">
            {isAdmin && <AddPartyDishDialog partyId={partyId} />}
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
                  document.getElementById('add-dish-trigger')?.click()
                }
              >
                Add First Dish
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {dishesByCategory.map(category =>
              renderCategoryWithDishes(category)
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
