import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusIcon, Edit2Icon, Trash2Icon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default async function CategoriesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const [user, categories] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    }),
    prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            dishes: true,
          },
        },
      },
    }),
  ]);

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Group categories by parent
  const parentCategories = categories.filter(
    category => category.parentId === null
  );

  const childCategories = categories.filter(
    category => category.parentId !== null
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Manage Categories
          </h1>
          <p className="text-muted-foreground">
            Create and manage categories for organizing dishes.
          </p>
        </div>
        <Link href="/categories/new" className="self-start sm:self-auto">
          <Button className="gap-2 w-full sm:w-auto">
            <PlusIcon className="h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Main categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Manage dish categories and their hierarchies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  No categories available.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/categories/new">Create Your First Category</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Parent Category</TableHead>
                    <TableHead>Dishes Count</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map(category => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>
                        {category.parent ? (
                          <span className="inline-flex items-center gap-1">
                            {category.parent.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {category._count?.dishes || 0} dishes
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/categories/${category.id}`}>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              title="Edit Category"
                            >
                              <Edit2Icon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/categories/${category.id}/delete`}>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                              title="Delete Category"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Hierarchical view */}
        {parentCategories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Category Hierarchy</CardTitle>
              <CardDescription>
                View how categories are organized.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {parentCategories.map(parent => (
                  <li key={parent.id} className="space-y-2">
                    <div className="font-medium">{parent.name}</div>
                    {childCategories.some(
                      child => child.parentId === parent.id
                    ) && (
                      <ul className="ml-6 space-y-1 border-l pl-4">
                        {childCategories
                          .filter(child => child.parentId === parent.id)
                          .map(child => (
                            <li key={child.id} className="text-sm">
                              {child.name}{' '}
                              <span className="text-muted-foreground text-xs">
                                ({child._count?.dishes || 0} dishes)
                              </span>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
