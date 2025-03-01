import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DishForm } from '@/components/DishForm';
import { generateMetadata as baseGenerateMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { Dish, Unit } from '@/lib/types';

export default async function EditDishPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const [user, dbDish] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    }),
    prisma.dish.findUnique({
      where: { id: params.id },
    }),
  ]);

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  if (!dbDish) {
    redirect('/dishes');
  }

  // Convert Prisma dish to app Dish type
  const dish: Dish = {
    ...dbDish,
    unit: dbDish.unit as unknown as Unit, // Type conversion
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

// Generate dynamic metadata for the edit dish page
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return baseGenerateMetadata('Edit Dish', 'Update dish details');
}
