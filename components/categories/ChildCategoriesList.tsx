import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface ChildCategory {
  id: string;
  name: string;
  _count: {
    dishes: number;
  };
}

interface ChildCategoriesListProps {
  children: ChildCategory[];
}

export function ChildCategoriesList({ children }: ChildCategoriesListProps) {
  if (children.length === 0) {
    return <p className="text-muted-foreground">No child categories found.</p>;
  }

  return (
    <ul className="space-y-2">
      {children.map(child => (
        <li key={child.id} className="flex items-center justify-between">
          <Link
            href={`/categories/${child.id}`}
            className="font-medium hover:underline"
          >
            {child.name}
          </Link>
          <Badge variant="outline">{child._count.dishes} dishes</Badge>
        </li>
      ))}
    </ul>
  );
}
