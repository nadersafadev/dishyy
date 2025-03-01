import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CategoryForm } from '@/components/CategoryForm';

export default async function EditCategoryPage({
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

  // Fetch the category
  const category = await prisma.category.findUnique({
    where: { id: params.id },
  });

  if (!category) {
    redirect('/categories');
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
        <p className="text-muted-foreground">
          Update the details for this category.
        </p>
      </div>

      <div className="p-6 bg-card rounded-lg shadow">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
