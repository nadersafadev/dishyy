'use client'

import { useState } from 'react'
import type { Dish } from '@prisma/client'
import { Edit2Icon, Trash2Icon, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface DishWithCount extends Dish {
  _count: {
    parties: number
  }
}

interface DishListProps {
  dishes: DishWithCount[]
  view?: 'grid' | 'list'
}

export default function DishList({ dishes, view = 'grid' }: DishListProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedDish, setSelectedDish] = useState<DishWithCount | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (dish: DishWithCount) => {
    if (dish._count.parties > 0) {
      setError('Cannot delete a dish that is being used in parties')
      return
    }

    try {
      setIsDeleting(true)
      setError(null)

      const response = await fetch(`/api/dishes/${dish.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete dish')
      }

      router.refresh()
    } catch (error) {
      console.error('Error deleting dish:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete dish')
    } finally {
      setIsDeleting(false)
      setSelectedDish(null)
    }
  }

  if (dishes.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-muted-foreground'>No dishes available yet.</p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {error && (
        <div className='p-4 text-sm text-destructive bg-destructive/10 rounded-lg'>
          {error}
        </div>
      )}

      <div
        className={cn(
          view === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        )}
      >
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className={cn(
              'card p-4 sm:p-6 hover:border-primary hover-transition group relative',
              view === 'list' &&
                'flex flex-col sm:flex-row sm:items-center justify-between gap-4'
            )}
          >
            {/* Position actions absolutely in grid view */}
            {view === 'grid' && (
              <div className='absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                <Button
                  variant='secondary'
                  size='icon'
                  onClick={() => router.push(`/dishes/${dish.id}/edit`)}
                  className='h-8 w-8 bg-background/80 backdrop-blur-sm'
                >
                  <Edit2Icon className='h-4 w-4' />
                  <span className='sr-only'>Edit dish</span>
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground'
                      onClick={() => setSelectedDish(dish)}
                    >
                      <Trash2Icon className='h-4 w-4' />
                      <span className='sr-only'>Delete dish</span>
                    </Button>
                  </DialogTrigger>
                  {selectedDish?.id === dish.id && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Dish</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete &quot;
                          {selectedDish.name}
                          &quot;? This action cannot be undone.
                          {selectedDish._count.parties > 0 && (
                            <p className='mt-2 text-destructive'>
                              This dish cannot be deleted because it is being
                              used in {selectedDish._count.parties}{' '}
                              {selectedDish._count.parties === 1
                                ? 'party'
                                : 'parties'}
                              .
                            </p>
                          )}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant='outline'
                          onClick={() => setSelectedDish(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant='destructive'
                          onClick={() => handleDelete(selectedDish)}
                          disabled={
                            isDeleting || selectedDish._count.parties > 0
                          }
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>
              </div>
            )}

            <div className={cn('space-y-2', view === 'list' && 'flex-1')}>
              <div className='flex items-start gap-4'>
                {/* Image Section */}
                <div className='relative shrink-0 w-24 h-24 rounded-md overflow-hidden bg-muted'>
                  {dish.imageUrl ? (
                    <Image
                      src={dish.imageUrl}
                      alt={dish.name}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 96px, 96px'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <ImageIcon className='w-8 h-8 text-muted-foreground/50' />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className='flex-1 min-w-0'>
                  <h3 className='font-medium truncate'>{dish.name}</h3>
                  {dish.description && (
                    <p
                      className={cn(
                        'text-sm text-muted-foreground',
                        view === 'grid'
                          ? 'line-clamp-2'
                          : 'line-clamp-2 sm:line-clamp-1'
                      )}
                    >
                      {dish.description}
                    </p>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Used in {dish._count.parties}{' '}
                    {dish._count.parties === 1 ? 'party' : 'parties'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Section - List View Only */}
            {view === 'list' && (
              <div className='flex items-center gap-4 mt-4 sm:mt-0 shrink-0'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => router.push(`/dishes/${dish.id}/edit`)}
                  className='h-8 w-8'
                >
                  <Edit2Icon className='h-4 w-4' />
                  <span className='sr-only'>Edit dish</span>
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 hover:bg-destructive hover:text-destructive-foreground'
                      onClick={() => setSelectedDish(dish)}
                    >
                      <Trash2Icon className='h-4 w-4' />
                      <span className='sr-only'>Delete dish</span>
                    </Button>
                  </DialogTrigger>
                  {selectedDish?.id === dish.id && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Dish</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete &quot;
                          {selectedDish.name}
                          &quot;? This action cannot be undone.
                          {selectedDish._count.parties > 0 && (
                            <p className='mt-2 text-destructive'>
                              This dish cannot be deleted because it is being
                              used in {selectedDish._count.parties}{' '}
                              {selectedDish._count.parties === 1
                                ? 'party'
                                : 'parties'}
                              .
                            </p>
                          )}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant='outline'
                          onClick={() => setSelectedDish(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant='destructive'
                          onClick={() => handleDelete(selectedDish)}
                          disabled={
                            isDeleting || selectedDish._count.parties > 0
                          }
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
