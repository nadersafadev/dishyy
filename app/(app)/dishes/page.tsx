import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import { DishesTable } from '@/components/dishes/DishesTable';
import { DishesFilters } from '@/components/dishes/DishesFilters';
import { DishesGrid } from '@/components/dishes/DishesGrid';
import { ViewSwitcher, ViewMode } from '@/components/ui/view-switcher';
import { generateMetadata } from '@/lib/metadata';
import { Unit, DishWithRelations, PaginationMeta } from '@/lib/types';
import { redirect } from 'next/navigation';

export const metadata = generateMetadata(
  'Dishes',
  'Browse and manage your dishes collection'
);

interface PageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    view?: ViewMode;
  };
}

export default async function DishesPage({ searchParams }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  // Get query parameters with defaults
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '10');
  const sortBy = searchParams.sortBy || 'name';
  const sortOrder = searchParams.sortOrder || 'asc';
  const search = searchParams.search || '';
  const view = searchParams.view || 'grid';

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
          <ViewSwitcher currentView={view} />
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
        ) : view === 'list' ? (
          <DishesTable
            dishes={dishes}
            pagination={pagination}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        ) : (
          <DishesGrid
            data={dishes}
            pagination={pagination}
            sortBy={sortBy}
            sortOrder={sortOrder}
            baseUrl=""
          />
        )}
      </div>
    </div>
  );
}
