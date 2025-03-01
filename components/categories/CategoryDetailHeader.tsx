import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit2Icon, Trash2Icon, ChevronLeftIcon } from 'lucide-react';

interface CategoryDetailHeaderProps {
  id: string;
  name: string;
  description?: string | null;
}

export function CategoryDetailHeader({
  id,
  name,
  description,
}: CategoryDetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div>
        <Button variant="ghost" size="sm" className="gap-1 mb-2" asChild>
          <Link href="/categories">
            <ChevronLeftIcon className="h-4 w-4" />
            Back to Categories
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/categories/${id}/edit`}>
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
          <Link href={`/categories/${id}/delete`}>
            <Trash2Icon className="h-4 w-4 mr-2" />
            Delete
          </Link>
        </Button>
      </div>
    </div>
  );
}
