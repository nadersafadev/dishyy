import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Edit2Icon, Trash2Icon, ChevronLeftIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
        },
      },
    },
  });

  if (!category) {
    redirect('/categories');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <Button variant="ghost" size="sm" className="gap-1 mb-2" asChild>
            <Link href="/categories">
              <ChevronLeftIcon className="h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-muted-foreground mt-1">{category.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/categories/${category.id}/edit`}>
              <Edit2Icon className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive hover:text-white"
          >
            <Link href={`/categories/${category.id}/delete`}>
              <Trash2Icon className="h-4 w-4 mr-2" />
              Delete
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Parent Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Parent Category</CardTitle>
          </CardHeader>
          <CardContent>
            {category.parent ? (
              <div>
                <Link
                  href={`/categories/${category.parent.id}`}
                  className="font-medium hover:underline"
                >
                  {category.parent.name}
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground">
                This is a top-level category with no parent.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Child Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Child Categories</CardTitle>
            <CardDescription>
              Categories that are nested under this one
            </CardDescription>
          </CardHeader>
          <CardContent>
            {category.children.length > 0 ? (
              <ul className="space-y-2">
                {category.children.map(child => (
                  <li
                    key={child.id}
                    className="flex items-center justify-between"
                  >
                    <Link
                      href={`/categories/${child.id}`}
                      className="font-medium hover:underline"
                    >
                      {child.name}
                    </Link>
                    <Badge variant="outline">
                      {child._count.dishes} dishes
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                No child categories found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Associated Dishes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Associated Dishes</CardTitle>
          <CardDescription>Dishes that belong to this category</CardDescription>
        </CardHeader>
        <CardContent>
          {category.dishes.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {category.dishes.map(dish => (
                <div
                  key={dish.id}
                  className="border rounded-md p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium">{dish.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Unit: {dish.unit}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No dishes associated with this category.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
