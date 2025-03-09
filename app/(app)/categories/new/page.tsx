import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { CategoryForm } from '@/components/CategoryForm';
import { generateMetadata as baseGenerateMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = baseGenerateMetadata('New Category');

export default async function NewCategoryPage() {
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
        <h1 className="text-2xl font-semibold tracking-tight">New Category</h1>
        <p className="text-muted-foreground">
          Create a new category for organizing dishes.
        </p>
      </div>

      <div className="card p-6">
        <CategoryForm />
      </div>
    </div>
  );
}
