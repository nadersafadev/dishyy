'use client';

import { BaseEntity, BaseEntityGridProps } from '@/lib/types/entity';

export function SelectorGrid<T extends BaseEntity>({
  data,
  renderCard,
}: Omit<
  BaseEntityGridProps<T>,
  'pagination' | 'sortBy' | 'sortOrder' | 'baseUrl'
>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {data.map(item => (
        <div key={item.id} className="col-span-1">
          {renderCard(item)}
        </div>
      ))}
    </div>
  );
}
