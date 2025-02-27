'use client'

import { useState } from 'react'
import type { Dish } from '@prisma/client'
import DishList from './DishList'
import { ViewToggle } from './ui/view-toggle'

interface DishWithCount extends Dish {
  _count: {
    parties: number
  }
}

interface DishListWithViewToggleProps {
  dishes: DishWithCount[]
  title?: string
  description?: string
}

export function DishListWithViewToggle({
  dishes,
  title,
  description,
}: DishListWithViewToggleProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
        {(title || description) && (
          <div className='space-y-1'>
            {title && <h2 className='text-xl font-medium'>{title}</h2>}
            {description && (
              <p className='text-sm text-muted-foreground'>{description}</p>
            )}
          </div>
        )}
        <div className='shrink-0 self-start sm:self-center'>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>
      <DishList dishes={dishes} view={view} />
    </div>
  )
}
