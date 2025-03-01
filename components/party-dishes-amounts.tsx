'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ViewToggle } from '@/components/ui/view-toggle';
import { PartyDish } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { UtensilsCrossedIcon, ChevronRightIcon } from 'lucide-react';
import { UpdateDishQuantity } from '@/components/update-dish-quantity';
import { useParams } from 'next/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface PartyDishAmountsProps {
  dishes: (PartyDish & {
    dish: {
      id: string;
      name: string;
      unit: string;
      description: string | null;
      imageUrl: string | null;
      categoryId: string;
      category?: {
        id: string;
        name: string;
        parentId: string | null;
      };
    };
  })[];
  isAdmin?: boolean;
}

export function PartyDishAmounts({
  dishes,
  isAdmin = false,
}: PartyDishAmountsProps) {
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const partyId = params.id as string;

  // Group dishes by category in a hierarchical structure
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
          className={`text-md font-medium ${level === 0 ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          {category.name}
        </h3>

        {/* Render dishes in this category */}
        {hasDirectDishes && (
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
                : 'flex flex-col gap-2'
            }
          >
            {category.dishes.map(
              (
                partyDish: PartyDish & {
                  dish: {
                    id: string;
                    name: string;
                    unit: string;
                    description: string | null;
                    imageUrl: string | null;
                    categoryId: string;
                    category?: {
                      id: string;
                      name: string;
                      parentId: string | null;
                    };
                  };
                }
              ) => (
                <div
                  key={partyDish.dishId}
                  className={
                    view === 'grid'
                      ? 'flex flex-col p-3 rounded-lg border bg-card/50 hover:bg-accent/10 transition-colors relative'
                      : 'flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-accent/10 transition-colors relative'
                  }
                >
                  {/* Add edit controls for admin - position differently for list vs grid view */}
                  {isAdmin && isOpen && (
                    <div
                      className={
                        view === 'grid'
                          ? 'absolute top-2 right-2 z-10'
                          : 'absolute top-1/2 right-2 -translate-y-1/2 z-10'
                      }
                    >
                      <UpdateDishQuantity
                        partyId={partyId}
                        dishId={partyDish.dishId}
                        dishName={partyDish.dish.name}
                        unit={partyDish.dish.unit}
                        currentAmount={partyDish.amountPerPerson}
                        isAdmin={isAdmin}
                      />
                    </div>
                  )}

                  {view === 'grid' ? (
                    // Grid view
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-muted">
                          {partyDish.dish.imageUrl ? (
                            <Image
                              src={partyDish.dish.imageUrl}
                              alt={partyDish.dish.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                              <UtensilsCrossedIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/dishes/${partyDish.dish.id}`}
                          className="font-medium text-sm truncate hover:underline"
                        >
                          {partyDish.dish.name}
                        </Link>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <Badge variant="outline" className="text-xs">
                          {partyDish.dish.unit}
                        </Badge>
                        <span className="text-sm font-semibold">
                          {partyDish.amountPerPerson.toFixed(1)}
                        </span>
                      </div>
                    </>
                  ) : (
                    // List view
                    <>
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-md overflow-hidden shrink-0 bg-muted">
                          {partyDish.dish.imageUrl ? (
                            <Image
                              src={partyDish.dish.imageUrl}
                              alt={partyDish.dish.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                              <UtensilsCrossedIcon className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/dishes/${partyDish.dish.id}`}
                          className="font-medium truncate hover:underline"
                        >
                          {partyDish.dish.name}
                        </Link>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {partyDish.dish.unit}
                        </Badge>
                      </div>
                      <span className="text-sm font-semibold whitespace-nowrap ml-2 mr-10">
                        {partyDish.amountPerPerson.toFixed(1)}{' '}
                        {partyDish.dish.unit.toLowerCase()}
                      </span>
                    </>
                  )}
                </div>
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
    <Card className="p-6 space-y-4 h-fit">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
        <div className="flex items-center justify-between">
          <CollapsibleTrigger className="flex items-center gap-2 hover:underline">
            <h2 className="text-lg font-medium">Amount Per Person</h2>
            <ChevronRightIcon
              className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-90' : ''}`}
            />
          </CollapsibleTrigger>
          {isOpen && (
            <div className="flex items-center gap-2">
              {isAdmin && isOpen && (
                <span className="text-xs text-muted-foreground">
                  Tip: Click edit icon to modify amounts
                </span>
              )}
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          )}
        </div>

        <CollapsibleContent className="space-y-4">
          {dishes.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No dishes have been added to this party yet.
            </p>
          ) : (
            <div className="space-y-6">
              {dishesByCategory.map(category =>
                renderCategoryWithDishes(category)
              )}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {!isOpen && dishes.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {dishes.length} {dishes.length === 1 ? 'dish' : 'dishes'} • Click to
          show details
        </p>
      )}
    </Card>
  );
}
