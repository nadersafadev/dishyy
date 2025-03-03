import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CategoryDetailHeader } from '@/components/categories/CategoryDetailHeader';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { ParentCategoryLink } from '@/components/categories/ParentCategoryLink';
import { ChildCategoriesList } from '@/components/categories/ChildCategoriesList';
import { DishesGrid } from '@/components/categories/DishesGrid';

export default async function CategoryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      parent: {
        select: {
          id: true,
          name: true,
        },
      },
      children: {
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              dishes: true,
            },
          },
        },
      },
      dishes: {
        select: {
          id: true,
          name: true,
          unit: true,
          createdAt: true,
          updatedAt: true,
          description: true,
          imageId: true,
          imageUrl: true,
          categoryId: true,
        },
      },
    },
  });

  if (!category) {
    redirect('/categories');
  }

  return (
    <div className="space-y-6">
      <CategoryDetailHeader
        id={category.id}
        name={category.name}
        description={category.description}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Parent Category */}
        <CategoryCard title="Parent Category">
          <ParentCategoryLink parent={category.parent} />
        </CategoryCard>

        {/* Child Categories */}
        <CategoryCard
          title="Child Categories"
          description="Categories that are nested under this one"
        >
          <ChildCategoriesList children={category.children} />
        </CategoryCard>
      </div>

      {/* Associated Dishes */}
      <CategoryCard
        title="Associated Dishes"
        description="Dishes that belong to this category"
      >
        <DishesGrid dishes={category.dishes} />
      </CategoryCard>
    </div>
  );
}
