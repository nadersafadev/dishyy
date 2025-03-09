import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { DishForm } from '@/components/DishForm';
import { generateMetadata as baseGenerateMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { Dish, Unit } from '@/lib/types';

export const metadata: Metadata = baseGenerateMetadata('Edit Dish');

export default async function EditDishPage({
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

  const dbDish = await prisma.dish.findUnique({
    where: { id: params.id },
    include: {
      category: true,
    },
  });

  if (!dbDish) {
    notFound();
  }

  // Convert Prisma dish to app Dish type
  const dish: Dish = {
    ...dbDish,
    unit: dbDish.unit as unknown as Unit, // Type conversion
    category: dbDish.category || undefined, // Handle null case
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Dish</h1>
        <p className="text-muted-foreground">
          Update the details of &quot;{dish.name}&quot;.
        </p>
      </div>

      <div className="card p-6">
        <DishForm dish={dish} />
      </div>
    </div>
  );
}
