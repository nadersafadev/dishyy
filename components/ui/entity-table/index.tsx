'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit2Icon,
  Trash2Icon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataPagination } from '@/components/ui/DataPagination';
import { DeleteEntityDialog } from '@/components/ui/delete-entity-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  BaseEntity,
  BaseEntityTableProps,
  EntityTableColumn,
} from '@/lib/types/entity';
import { useState } from 'react';

export function EntityTable<T extends BaseEntity>({
  data,
  columns,
  pagination,
  sortBy = columns[0]?.key || 'name',
  sortOrder = 'asc',
  baseUrl,
  onDelete,
  onEdit,
  editDialog,
  actions,
  selectable = false,
  selectedIds = [],
  onRowSelect,
  onRowClick,
}: BaseEntityTableProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const createSortURL = (key: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    const currentSortBy = params.get('sortBy') || sortBy;
    const currentSortOrder = params.get('sortOrder') || sortOrder;

    if (currentSortBy === key) {
      params.set('sortOrder', currentSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      params.set('sortBy', key);
      params.set('sortOrder', 'asc');
    }

    return `${baseUrl}?${params.toString()}`;
  };

  const getSortIcon = (key: string) => {
    if (sortBy !== key) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const handleRowClick = (e: React.MouseEvent, item: T) => {
    const target = e.target as HTMLElement;
    const isNoRowClick = target.closest('[data-no-row-click="true"]');

    if (isNoRowClick) {
      e.stopPropagation();
      return;
    }

    onRowClick?.(item);
  };

  const handleEditClick = (e: React.MouseEvent, item: T) => {
    e.stopPropagation();
    if (editDialog) {
      setEditingItem(item);
    } else if (onEdit) {
      onEdit(item.id);
    }
  };

  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      data.length > 0 &&
                      data.every(item => selectedIds.includes(item.id))
                    }
                    onCheckedChange={checked => {
                      if (onRowSelect) {
                        data.forEach(item => {
                          if (checked && !selectedIds.includes(item.id)) {
                            onRowSelect(item.id);
                          } else if (
                            !checked &&
                            selectedIds.includes(item.id)
                          ) {
                            onRowSelect(item.id);
                          }
                        });
                      }
                    }}
                  />
                </TableHead>
              )}
              {columns.map(column => (
                <TableHead
                  key={column.key}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.sortable ? (
                    <Link
                      href={createSortURL(column.key)}
                      className="flex items-center hover:underline"
                    >
                      {column.header}
                      {getSortIcon(column.key)}
                    </Link>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
              {(onEdit || onDelete || actions) && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(item => (
              <TableRow
                key={item.id}
                className={cn(
                  onRowClick && 'cursor-pointer hover:bg-muted/50',
                  selectedIds.includes(item.id) && 'bg-muted'
                )}
                onClick={e => handleRowClick(e, item)}
              >
                {selectable && (
                  <TableCell>
                    <div data-no-row-click="true">
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={() => onRowSelect?.(item.id)}
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                  </TableCell>
                )}
                {columns.map(column => (
                  <TableCell key={`${item.id}-${column.key}`}>
                    {column.render(item)}
                  </TableCell>
                ))}
                {(onEdit || onDelete || actions) && (
                  <TableCell className="text-right">
                    <div
                      className="flex justify-end gap-2"
                      data-no-row-click="true"
                      onClick={e => e.stopPropagation()}
                    >
                      {actions?.(item)}
                      {(onEdit || editDialog) &&
                        (editDialog ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={e => handleEditClick(e, item)}
                                title={`Edit ${item.name}`}
                              >
                                <Edit2Icon className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit {item.name}</DialogTitle>
                              </DialogHeader>
                              {editDialog(item)}
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={e => handleEditClick(e, item)}
                            title={`Edit ${item.name}`}
                          >
                            <Edit2Icon className="h-4 w-4" />
                          </Button>
                        ))}
                      {onDelete && (
                        <DeleteEntityDialog
                          entityId={item.id}
                          entityName={item.name}
                          entityType={
                            baseUrl.split('/')[1]?.slice(0, -1) || 'Item'
                          }
                          deleteEndpoint={`/api${baseUrl}/${item.id}`}
                          trigger={
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                              title={`Delete ${item.name}`}
                              onClick={e => e.stopPropagation()}
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          }
                        />
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DataPagination
        pagination={pagination}
        itemName={baseUrl.split('/')[1] || 'items'}
        baseUrl={baseUrl}
      />
    </div>
  );
}
