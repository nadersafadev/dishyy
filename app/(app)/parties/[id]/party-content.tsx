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
      <div key={category.id} className={`space-y-3 ${level > 0 ? 'ml-4' : ''}`}>
        <h3
          className={`text-md font-medium ${level === 0 ? 'text-muted-foreground' : 'text-muted-foreground/80'}`}
        >
          {category.name}
        </h3>

        {/* Render dishes in this category */}
        {hasDirectDishes && (
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-1 lg:grid-cols-2 gap-4'
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
              ) => {
                const contributions = participants.flatMap(p =>
                  p.contributions.filter(c => c.dishId === partyDish.dishId)
                );
                const totalContributed = contributions.reduce(
                  (sum, c) => sum + c.amount,
                  0
                );
                const totalNeeded =
                  partyDish.amountPerPerson * totalParticipants;
                const remainingNeeded = Math.max(
                  0,
                  totalNeeded - totalContributed
                );
                const progressPercentage = Math.min(
                  (totalContributed / totalNeeded) * 100,
                  100
                );

                return (
                  <div
                    key={partyDish.dishId}
                    className="flex flex-col gap-4 p-4 bg-muted/50 rounded-lg relative"
                  >
                    {/* New dish management controls for admins */}
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex items-center gap-2">
                        <UpdateDishQuantity
                          partyId={partyId}
                          dishId={partyDish.dishId}
                          dishName={partyDish.dish.name}
                          unit={partyDish.dish.unit}
                          currentAmount={partyDish.amountPerPerson}
                          isAdmin={isAdmin}
                        />
                        <RemovePartyDish
                          partyId={partyId}
                          dishId={partyDish.dishId}
                          dishName={partyDish.dish.name}
                          isAdmin={isAdmin}
                        />
                      </div>
                    )}

                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                        {partyDish.dish.imageUrl ? (
                          <img
                            src={partyDish.dish.imageUrl}
                            alt={partyDish.dish.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                            <svg
                              className="w-12 h-12"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3 19h18M3 14h18m-9-4v6m6-6v6m-12-6v6"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">
                            {partyDish.dish.name}
                          </span>
                          <Badge variant="outline" className="shrink-0">
                            {partyDish.dish.unit}
                          </Badge>
                        </div>
                        {partyDish.dish.description && (
                          <p className="text-sm text-muted-foreground truncate mb-2">
                            {partyDish.dish.description}
                          </p>
                        )}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{partyDish.amountPerPerson} per person</span>
                            <span className="font-medium text-foreground">
                              {totalContributed.toFixed(1)} /{' '}
                              {totalNeeded.toFixed(1)}{' '}
                              {partyDish.dish.unit.toLowerCase()}
                            </span>
                          </div>
                          <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="absolute left-0 top-0 h-full bg-primary transition-all duration-500 ease-in-out"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contributions section */}
                    <div className="space-y-2">
                      {isParticipant ? (
                        <>
                          <div className="text-sm font-medium">
                            Contributions
                          </div>
                          <div className="space-y-1.5">
                            {contributions.map(contribution => {
                              const participant = participants.find(
                                p => p.id === contribution.participantId
                              );
                              return (
                                <div
                                  key={contribution.id}
                                  className="flex items-center justify-between text-sm bg-background/50 p-2 rounded"
                                >
                                  <span>{participant?.user.name}</span>
                                  <span>
                                    {contribution.amount.toFixed(1)}{' '}
                                    {partyDish.dish.unit.toLowerCase()}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Join the party to see individual contributions
                        </div>
                      )}
                      {remainingNeeded > 0 && (
                        <div className="text-sm text-muted-foreground mb-2">
                          Still needed: {remainingNeeded.toFixed(1)}{' '}
                          {partyDish.dish.unit.toLowerCase()}
                        </div>
                      )}
                      {isParticipant && remainingNeeded > 0 && (
                        <div className="border-t pt-3 mt-2">
                          <DishContributionForm
                            partyId={partyId}
                            dishId={partyDish.dishId}
                            dishName={partyDish.dish.name}
                            unit={partyDish.dish.unit}
                            remainingNeeded={remainingNeeded}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
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
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Dishes</h2>
        <div className="flex items-center gap-4">
          {isAdmin && <AddPartyDishDialog partyId={partyId} />}
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>

      <div className="space-y-6">
        {dishesByCategory.map(category => renderCategoryWithDishes(category))}
      </div>
    </div>
  );
}
