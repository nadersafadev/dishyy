'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ViewToggle } from '@/components/ui/view-toggle'
import { DishContributionForm } from '@/components/dish-contribution-form'
import { AddPartyDishDialog } from '@/components/add-party-dish-dialog'
import {
  PartyDish,
  PartyParticipant,
  ParticipantDishContribution,
} from '@prisma/client'
import { useParams } from 'next/navigation'

interface DishesContentProps {
  dishes: (PartyDish & {
    dish: {
      name: string
      unit: string
      description: string | null
      imageUrl: string | null
    }
  })[]
  participants: (PartyParticipant & {
    user: {
      name: string
    }
    contributions: (ParticipantDishContribution & {
      dish: {
        name: string
        unit: string
      }
    })[]
  })[]
  isParticipant: boolean
  totalParticipants: number
  isAdmin: boolean
}

export function DishesContent({
  dishes,
  participants,
  isParticipant,
  totalParticipants,
  isAdmin,
}: DishesContentProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const params = useParams()
  const partyId = params.id as string

  return (
    <div className='card p-6 space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-medium'>Dishes</h2>
        <div className='flex items-center gap-4'>
          {isAdmin && <AddPartyDishDialog partyId={partyId} />}
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>
      <div
        className={
          view === 'grid'
            ? 'grid grid-cols-1 lg:grid-cols-2 gap-4'
            : 'flex flex-col gap-4'
        }
      >
        {dishes.map((partyDish) => {
          const contributions = participants.flatMap((p) =>
            p.contributions.filter((c) => c.dishId === partyDish.dishId)
          )
          const totalContributed = contributions.reduce(
            (sum, c) => sum + c.amount,
            0
          )
          const totalNeeded = partyDish.amountPerPerson * totalParticipants
          const remainingNeeded = Math.max(0, totalNeeded - totalContributed)
          const progressPercentage = Math.min(
            (totalContributed / totalNeeded) * 100,
            100
          )

          return (
            <div
              key={partyDish.dishId}
              className='flex flex-col gap-4 p-4 bg-muted/50 rounded-lg'
            >
              <div className='flex gap-4'>
                <div className='relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted'>
                  {partyDish.dish.imageUrl ? (
                    <img
                      src={partyDish.dish.imageUrl}
                      alt={partyDish.dish.name}
                      className='object-cover w-full h-full'
                    />
                  ) : (
                    <div className='flex items-center justify-center w-full h-full text-muted-foreground'>
                      <svg
                        className='w-12 h-12'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1.5}
                          d='M3 19h18M3 14h18m-9-4v6m6-6v6m-12-6v6'
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='font-medium truncate'>
                      {partyDish.dish.name}
                    </span>
                    <Badge variant='outline' className='shrink-0'>
                      {partyDish.dish.unit}
                    </Badge>
                  </div>
                  {partyDish.dish.description && (
                    <p className='text-sm text-muted-foreground truncate mb-2'>
                      {partyDish.dish.description}
                    </p>
                  )}
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm text-muted-foreground'>
                      <span>{partyDish.amountPerPerson} per person</span>
                      <span className='font-medium text-foreground'>
                        {totalContributed.toFixed(1)} / {totalNeeded.toFixed(1)}{' '}
                        {partyDish.dish.unit.toLowerCase()}
                      </span>
                    </div>
                    <div className='relative w-full h-2 bg-muted rounded-full overflow-hidden'>
                      <div
                        className='absolute left-0 top-0 h-full bg-primary transition-all duration-500 ease-in-out'
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contributions section */}
              <div className='space-y-2'>
                {isParticipant ? (
                  <>
                    <div className='text-sm font-medium'>Contributions</div>
                    <div className='space-y-1.5'>
                      {contributions.map((contribution) => {
                        const participant = participants.find(
                          (p) => p.id === contribution.participantId
                        )
                        return (
                          <div
                            key={contribution.id}
                            className='flex items-center justify-between text-sm bg-background/50 p-2 rounded'
                          >
                            <span>{participant?.user.name}</span>
                            <span>
                              {contribution.amount.toFixed(1)}{' '}
                              {partyDish.dish.unit.toLowerCase()}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <div className='text-sm text-muted-foreground'>
                    Join the party to see individual contributions
                  </div>
                )}
                {remainingNeeded > 0 && (
                  <div className='text-sm text-muted-foreground mb-2'>
                    Still needed: {remainingNeeded.toFixed(1)}{' '}
                    {partyDish.dish.unit.toLowerCase()}
                  </div>
                )}
                {isParticipant && remainingNeeded > 0 && (
                  <div className='border-t pt-3 mt-2'>
                    <DishContributionForm
                      partyId={partyId}
                      dishId={partyDish.dishId}
                      dishName={partyDish.dish.name}
                      unit={partyDish.dish.unit}
                      remainingNeeded={remainingNeeded}
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
