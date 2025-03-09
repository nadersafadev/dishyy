import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { DishForm } from '@/components/DishForm';
import { generateMetadata as baseGenerateMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = baseGenerateMetadata('New Dish');

export default async function NewDishPage() {
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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">New Dish</h1>
        <p className="text-muted-foreground">
          Add a new dish to your collection.
        </p>
      </div>

      <div className="card p-6">
        <DishForm />
      </div>
    </div>
  );
}
