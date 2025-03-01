import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2Icon, Trash2Icon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DeleteCategoryDialog } from '@/components/categories/DeleteCategoryDialog';
import type { Category } from '@/lib/types';

interface CategoryWithRelations {
  id: string;
  name: string;
  description?: string | null;
  parentId: string | null;
  parent?: { id: string; name: string } | null;
  _count?: { dishes: number };
}

interface CategoriesTableProps {
  categories: CategoryWithRelations[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No categories available.</p>
        <Button asChild className="mt-4">
          <Link href="/categories/new">Create Your First Category</Link>
        </Button>
      </div>
    );
  }

  return (
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
            <TableCell className="font-medium">{category.name}</TableCell>
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
                    title="View Category"
                  >
                    <Edit2Icon className="h-4 w-4" />
                  </Button>
                </Link>
                <DeleteCategoryDialog
                  categoryId={category.id}
                  categoryName={category.name}
                  dishesCount={category._count?.dishes || 0}
                  isParent={category.parentId === null}
                  trigger={
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                      title="Delete Category"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
