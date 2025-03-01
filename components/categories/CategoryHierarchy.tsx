import type { Category } from '@/lib/types';

interface CategoryWithCount {
  id: string;
  name: string;
  description?: string | null;
  parentId: string | null;
  parent?: { id: string; name: string } | null;
  _count?: { dishes: number };
}

interface CategoryHierarchyProps {
  parentCategories: CategoryWithCount[];
  childCategories: CategoryWithCount[];
}

export function CategoryHierarchy({
  parentCategories,
  childCategories,
}: CategoryHierarchyProps) {
  if (parentCategories.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-4">
      {parentCategories.map(parent => (
        <li key={parent.id} className="space-y-2">
          <div className="font-medium">{parent.name}</div>
          {childCategories.some(child => child.parentId === parent.id) && (
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
  );
}
