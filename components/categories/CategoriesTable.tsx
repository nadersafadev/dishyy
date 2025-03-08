'use client';

import { Badge } from '@/components/ui/badge';
import { EntityTable } from '@/components/ui/entity-table';
import { EntityTableColumn } from '@/lib/types/entity';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CategoryForm } from '@/components/CategoryForm';

interface CategoryWithRelations {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  parent: { id: string; name: string } | null;
  _count?: { dishes: number };
}

interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface CategoriesTableProps {
  categories: CategoryWithRelations[];
  pagination: PaginationMeta;
  sortBy?: string;
  sortOrder?: string;
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function CategoriesTable({
  categories,
  pagination,
  sortBy = 'name',
  sortOrder = 'asc',
  onSelectionChange,
}: CategoriesTableProps) {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleRowSelect = (id: string) => {
    const newSelection = selectedCategories.includes(id)
      ? selectedCategories.filter(selectedId => selectedId !== id)
      : [...selectedCategories, id];

    setSelectedCategories(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleRowClick = (category: CategoryWithRelations) => {
    router.push(`/categories/${category.id}`);
  };

  const columns: EntityTableColumn<CategoryWithRelations>[] = [
    {
      key: 'name',
      header: 'Name',
      render: category => category.name,
      sortable: true,
    },
    {
      key: 'parent',
      header: 'Parent Category',
      render: category =>
        category.parent ? (
          <span className="inline-flex items-center gap-1">
            {category.parent.name}
          </span>
        ) : (
          <span className="text-muted-foreground">None</span>
        ),
    },
    {
      key: 'dishCount',
      header: 'Dishes Count',
      render: category => (
        <Badge variant="outline">{category._count?.dishes || 0} dishes</Badge>
      ),
      sortable: true,
    },
  ];

  return (
    <EntityTable
      data={categories}
      columns={columns}
      pagination={pagination}
      sortBy={sortBy}
      sortOrder={sortOrder}
      baseUrl="/categories"
      editDialog={category => (
        <CategoryForm
          category={{
            ...category,
            parent: category.parent || undefined,
          }}
        />
      )}
      onDelete={async id => {
        // The delete functionality is handled by the DeleteEntityDialog component
      }}
      selectable={true}
      selectedIds={selectedCategories}
      onRowSelect={handleRowSelect}
      onRowClick={handleRowClick}
    />
  );
}
