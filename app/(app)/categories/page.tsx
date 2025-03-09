import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/categories/PageHeader';
import { CategoriesTable } from '@/components/categories/CategoriesTable';
import { CategoryHierarchy } from '@/components/categories/CategoryHierarchy';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { CategoriesFilters } from '@/components/categories/CategoriesFilters';
import { generateMetadata } from '@/lib/metadata';
import { PaginationMeta } from '@/lib/types';

export const metadata = generateMetadata(
  'Categories',
  'Create and manage categories for organizing dishes'
);

// Define types for the page props
interface PageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    parentId?: string;
    hasParent?: string;
    hasDishes?: string;
  };
}

// Define a type for category with relations
interface CategoryWithRelations {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  parent: { id: string; name: string } | null;
  _count?: { dishes: number };
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User ID not found');
  }

  // Check user permissions directly from the database (server component)
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized access');
  }

  // Get query parameters with defaults
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '10');
  const sortBy = searchParams.sortBy || 'name';
  const sortOrder = searchParams.sortOrder || 'asc';
  const search = searchParams.search || '';
  const parentId = searchParams.parentId || '';

  // Handle 'all' value for hasParent and hasDishes (treat as empty string for API)
  const hasParent =
    searchParams.hasParent === 'all' ? '' : searchParams.hasParent || '';
  const hasDishes =
    searchParams.hasDishes === 'all' ? '' : searchParams.hasDishes || '';

  // Build the query string
  const queryParams = new URLSearchParams();
  queryParams.set('page', page.toString());
  queryParams.set('limit', limit.toString());
  queryParams.set('sortBy', sortBy);
  queryParams.set('sortOrder', sortOrder);
  if (search) queryParams.set('search', search);
  if (parentId) queryParams.set('parentId', parentId);
  if (hasParent) queryParams.set('hasParent', hasParent);
  if (hasDishes) queryParams.set('hasDishes', hasDishes);

  // Get the API base URL
  const apiBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Fetch data from the API
  const res = await fetch(
    `${apiBaseUrl}/api/categories?${queryParams.toString()}`,
    {
      cache: 'no-store', // Disable caching to always get fresh data
      next: { tags: ['categories'] }, // For use with revalidateTag
    }
  );

  if (!res.ok) {
    console.error('Failed to fetch categories');
    // Handle error - could redirect or show a message
    return (
      <div className="space-y-8">
        <PageHeader
          title="Manage Categories"
          description="Create and manage categories for organizing dishes."
          buttonText="Add Category"
          buttonHref="/categories/new"
        />
        <div className="p-6 text-center">
          <p className="text-red-500">
            Failed to load categories. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const data = await res.json();
  const categories: CategoryWithRelations[] = data.categories;
  const pagination: PaginationMeta = data.pagination;

  // Group categories by parent
  const parentCategories = categories.filter(
    category => category.parentId === null
  );

  const childCategories = categories.filter(
    category => category.parentId !== null
  );

  // Use the original searchParams values for the UI components to keep the selected values
  const uiHasParent = searchParams.hasParent || 'all';
  const uiHasDishes = searchParams.hasDishes || 'all';

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Categories"
        description="Create and manage categories for organizing dishes."
        buttonText="Add Category"
        buttonHref="/categories/new"
      />

      <CategoriesFilters
        search={search}
        hasParent={uiHasParent}
        hasDishes={uiHasDishes}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />

      <div className="grid gap-6">
        <CategoryCard
          title="Categories"
          description="Manage dish categories and their hierarchies."
        >
          <CategoriesTable
            categories={categories}
            pagination={pagination}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </CategoryCard>

        {parentCategories.length > 0 && (
          <CategoryCard
            title="Category Hierarchy"
            description="View how categories are organized."
          >
            <CategoryHierarchy
              parentCategories={parentCategories}
              childCategories={childCategories}
            />
          </CategoryCard>
        )}
      </div>
    </div>
  );
}
