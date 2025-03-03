import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import { DishesTable } from '@/components/dishes/DishesTable';
import { DishesFilters } from '@/components/dishes/DishesFilters';
import { DishesGrid } from '@/components/dishes/DishesGrid';
import { ViewSwitcher, ViewMode } from '@/components/ui/view-switcher';
import { generateMetadata } from '@/lib/metadata';

// Define the interface for dish data
interface DishWithRelations {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  unit: string;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  _count: { parties: number };
}

// Define pagination metadata interface
interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const metadata = generateMetadata(
  'Dishes',
  'Browse and manage your dishes collection'
);

export default async function DishesPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    categoryId?: string;
    hasCategory?: string;
    hasImage?: string;
    sortBy?: string;
    sortOrder?: string;
    view?: string;
  };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get user for role checking
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Parse search parameters
  const page = Number(searchParams.page || '1');
  const limit = Number(searchParams.limit || '10');
  const search =
    typeof searchParams.search === 'string' ? searchParams.search : '';
  const categoryId =
    typeof searchParams.categoryId === 'string' ? searchParams.categoryId : '';
  const hasCategory =
    typeof searchParams.hasCategory === 'string'
      ? searchParams.hasCategory
      : 'all';
  const hasImage =
    typeof searchParams.hasImage === 'string' ? searchParams.hasImage : 'all';
  const sortBy =
    typeof searchParams.sortBy === 'string' ? searchParams.sortBy : 'name';
  const sortOrder =
    typeof searchParams.sortOrder === 'string' ? searchParams.sortOrder : 'asc';

  // Add view mode parsing
  const viewMode = (searchParams.view as ViewMode) || 'list';

  // Fetch categories for the filter dropdown
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      // Include parent info to show hierarchy in the dropdown
      parent: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Build URL to fetch dishes with filters
  const apiUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/dishes`);
  apiUrl.searchParams.set('page', page.toString());
  apiUrl.searchParams.set('limit', limit.toString());
  if (search) apiUrl.searchParams.set('search', search);
  if (categoryId) {
    apiUrl.searchParams.set('categoryId', categoryId);
    // Always include child categories when a category is selected
    apiUrl.searchParams.set('includeChildCategories', 'true');
  }
  if (hasCategory !== 'all')
    apiUrl.searchParams.set('hasCategory', hasCategory);
  if (hasImage !== 'all') apiUrl.searchParams.set('hasImage', hasImage);
  apiUrl.searchParams.set('sortBy', sortBy);
  apiUrl.searchParams.set('sortOrder', sortOrder);

  // Fetch dishes with filters
  const response = await fetch(apiUrl, { next: { tags: ['dishes'] } });

  if (!response.ok) {
    throw new Error(`Failed to fetch dishes: ${response.statusText}`);
  }

  const data = await response.json();
  const dishes: DishWithRelations[] = data.dishes;
  const pagination: PaginationMeta = data.pagination;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Dishes</h1>
        </div>
        <div className="flex items-center gap-4">
          <ViewSwitcher currentView={viewMode} />
          <Link href="/dishes/new" className="self-start sm:self-auto">
            <Button className="gap-2 w-full sm:w-auto">
              <PlusIcon className="h-4 w-4" />
              Add Dish
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <DishesFilters
        search={search}
        categoryId={categoryId}
        hasCategory={hasCategory}
        hasImage={hasImage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        categories={categories}
      />

      {/* Dishes Table/Grid */}
      <div className="card p-6">
        {dishes.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No dishes available.</p>
            <Button asChild className="mt-4">
              <Link href="/dishes/new">Create Your First Dish</Link>
            </Button>
          </div>
        ) : viewMode === 'list' ? (
          <DishesTable
            dishes={dishes}
            pagination={pagination}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        ) : (
          <DishesGrid
            dishes={dishes}
            pagination={pagination}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        )}
      </div>
    </div>
  );
}
