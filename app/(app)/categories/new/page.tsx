import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CategoryForm } from '@/components/CategoryForm';

export default async function NewCategoryPage() {
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          Create New Category
        </h1>
        <p className="text-muted-foreground">
          Add a new category for organizing dishes.
        </p>
      </div>

      <div className="card p-6">
        <CategoryForm />
      </div>
    </div>
  );
}
