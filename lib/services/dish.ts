import { Unit } from '@/lib/types';
import {
  PartyDish,
  PartyParticipant,
  ParticipantDishContribution,
} from '@prisma/client';

export interface PartyDishWithDetails extends PartyDish {
  dish: {
    name: string;
    unit: Unit;
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

export interface ParticipantWithContributions extends PartyParticipant {
  user: {
    name: string;
  };
  contributions: (ParticipantDishContribution & {
    dish: {
      name: string;
      unit: Unit;
    };
  })[];
}

export interface CategoryWithDishes {
  id: string;
  name: string;
  parentId: string | null;
  dishes: PartyDishWithDetails[];
  subcategories: Record<string, CategoryWithDishes>;
}

export function organizeDishesByCategory(
  dishes: PartyDishWithDetails[]
): CategoryWithDishes[] {
  // Track categories and build hierarchy
  const categoryMap: Record<string, CategoryWithDishes> = {};

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

  // Extract top-level categories
  const topLevelCategories = Object.values(categoryMap).filter(
    category => !category.parentId || !categoryMap[category.parentId]
  );

  // Sort categories by name, but keep "Uncategorized" at the end
  return topLevelCategories.sort((a, b) => {
    if (a.id === 'uncategorized') return 1;
    if (b.id === 'uncategorized') return -1;
    return a.name.localeCompare(b.name);
  });
}

export function hasSubcategoryDishes(category: CategoryWithDishes): boolean {
  if (category.dishes.length > 0) return true;

  return Object.values(category.subcategories).some(
    subcat => subcat.dishes.length > 0 || hasSubcategoryDishes(subcat)
  );
}
