import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { CategoryForm } from '@/components/CategoryForm';
import { generateMetadata as baseGenerateMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { Category } from '@/lib/types';

export const metadata: Metadata = baseGenerateMetadata('Edit Category');

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User ID not found');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized access');
  }

  const dbCategory = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      parent: true,
    },
  });

  if (!dbCategory) {
    notFound();
  }

  // Transform the category data to match the expected type
  const category: Category = {
    ...dbCategory,
    parent: dbCategory.parent
      ? {
          id: dbCategory.parent.id,
          name: dbCategory.parent.name,
        }
      : undefined,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Category</h1>
        <p className="text-muted-foreground">
          Update category details and information.
        </p>
      </div>

      <div className="card p-6">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
