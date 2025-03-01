import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/categories/PageHeader';
import { CategoriesTable } from '@/components/categories/CategoriesTable';
import { CategoryHierarchy } from '@/components/categories/CategoryHierarchy';
import { CategoryCard } from '@/components/categories/CategoryCard';

export default async function CategoriesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const [user, categories] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    }),
    prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            dishes: true,
          },
        },
      },
    }),
  ]);

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Group categories by parent
  const parentCategories = categories.filter(
    category => category.parentId === null
  );

  const childCategories = categories.filter(
    category => category.parentId !== null
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Categories"
        description="Create and manage categories for organizing dishes."
        buttonText="Add Category"
        buttonHref="/categories/new"
      />

      <div className="grid gap-6">
        <CategoryCard
          title="Categories"
          description="Manage dish categories and their hierarchies."
        >
          <CategoriesTable categories={categories} />
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
