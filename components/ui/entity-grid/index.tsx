'use client';

import { BaseEntity, BaseEntityGridProps } from '@/lib/types/entity';
import { DataPagination } from '@/components/ui/DataPagination';

export function EntityGrid<T extends BaseEntity>({
  data,
  renderCard,
  pagination,
  sortBy,
  sortOrder,
  baseUrl,
}: BaseEntityGridProps<T>) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map(item => (
          <div key={item.id} className="col-span-1">
            {renderCard(item)}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <DataPagination
          pagination={pagination}
          itemName={baseUrl.split('/')[1] || 'items'}
          baseUrl={baseUrl}
        />
      </div>
    </div>
  );
}
