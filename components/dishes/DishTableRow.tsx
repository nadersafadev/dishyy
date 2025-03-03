import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Edit2Icon, ImageIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons
    if ((e.target as HTMLElement).closest('.action-buttons')) {
      return;
    }
    router.push(`/dishes/${dish.id}`);
  };

  return (
    <TableRow
      onClick={handleRowClick}
      className="cursor-pointer hover:bg-muted/50 transition-colors"
    >
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
          <span
            onClick={e => {
              e.stopPropagation();
              router.push(`/categories/${dish.category!.id}`);
            }}
            className="text-primary hover:underline cursor-pointer"
          >
            {dish.category.name}
          </span>
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
        <div className="flex justify-end gap-2 action-buttons">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            title="View Dish"
            onClick={e => {
              e.stopPropagation();
              router.push(`/dishes/${dish.id}`);
            }}
          >
            <Edit2Icon className="h-4 w-4" />
          </Button>
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
                onClick={e => e.stopPropagation()}
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
