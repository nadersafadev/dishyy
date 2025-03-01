'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Edit, MoreHorizontal, Trash2, UtensilsCrossed } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteDishDialog } from './DeleteDishDialog';

interface DishWithRelations {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  unit: string;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  _count: {
    parties: number;
  };
}

interface DishCardProps {
  dish: DishWithRelations;
}

export function DishCard({ dish }: DishCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="aspect-square relative">
        {dish.imageUrl ? (
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <UtensilsCrossed className="h-16 w-16 text-muted-foreground opacity-50" />
          </div>
        )}
      </div>
      <CardContent className="py-4 flex-grow">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-lg truncate">{dish.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/dishes/${dish.id}`}
                  className="flex w-full cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </DropdownMenuItem>
              <DeleteDishDialog
                dishId={dish.id}
                dishName={dish.name}
                inMenuCount={dish._count.parties}
                trigger={
                  <DropdownMenuItem
                    onSelect={e => e.preventDefault()}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {dish.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {dish.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-0 pb-4 px-6 flex flex-wrap gap-2">
        {dish.category ? (
          <Badge
            variant="outline"
            className="hover:bg-secondary transition-colors"
          >
            <Link
              href={`/categories/${dish.category.id}`}
              className="hover:underline"
            >
              {dish.category.name}
            </Link>
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            No category
          </Badge>
        )}
        <Badge variant="secondary" className="ml-auto">
          {dish._count.parties === 0
            ? 'Not used'
            : `Used in ${dish._count.parties} ${dish._count.parties === 1 ? 'party' : 'parties'}`}
        </Badge>
      </CardFooter>
    </Card>
  );
}
