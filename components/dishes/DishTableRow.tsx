import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Edit2Icon, ImageIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DeleteDishDialog } from '@/components/dishes/DeleteDishDialog';

interface DishTableRowProps {
  dish: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    category: { id: string; name: string } | null;
    _count: { parties: number };
  };
}

export function DishTableRow({ dish }: DishTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
          {dish.imageUrl ? (
            <Image
              src={dish.imageUrl}
              alt={dish.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <div>
          <div>{dish.name}</div>
          {dish.description && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {dish.description}
            </p>
          )}
        </div>
      </TableCell>
      <TableCell>
        {dish.category ? (
          <Link
            href={`/categories/${dish.category.id}`}
            className="hover:underline text-primary"
          >
            {dish.category.name}
          </Link>
        ) : (
          <span className="text-muted-foreground">None</span>
        )}
      </TableCell>
      <TableCell>
        <Badge variant="outline">
          {dish._count.parties}{' '}
          {dish._count.parties === 1 ? 'party' : 'parties'}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Link href={`/dishes/${dish.id}`}>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              title="View Dish"
            >
              <Edit2Icon className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteDishDialog
            dishId={dish.id}
            dishName={dish.name}
            inMenuCount={dish._count.parties}
            trigger={
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                title="Delete Dish"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
