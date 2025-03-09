import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { generateMetadata as baseGenerateMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = baseGenerateMetadata('Category Details');

export default async function CategoryPage({
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

  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      parent: true,
      dishes: {
        include: {
          _count: {
            select: {
              parties: true,
            },
          },
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {category.name}
        </h1>
        <p className="text-muted-foreground">
          {category.description || 'No description available'}
        </p>
      </div>

      <div className="card p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">Parent Category</h2>
            <p className="text-muted-foreground">
              {category.parent?.name || 'None'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium">Dishes</h2>
            <p className="text-muted-foreground">
              {category.dishes.length} dishes in this category
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
