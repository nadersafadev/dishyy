import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { PartyListWithViewToggle } from '@/components/party-list-with-view-toggle'

export default async function PartiesPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const [user, parties] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    }),
    prisma.party.findMany({
      include: {
        createdBy: true,
        dishes: {
          include: {
            dish: {
              select: {
                name: true,
                unit: true,
              },
            },
          },
        },
        participants: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
      where: {
        date: {
          gte: new Date(),
        },
      },
    }),
  ])

  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className='space-y-8'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            All Dish Parties
          </h1>
          <p className='text-muted-foreground'>
            Browse and join upcoming dish parties in your area.
          </p>
        </div>
        {isAdmin && (
          <Link href='/parties/new' className='self-start sm:self-auto'>
            <Button className='gap-2 w-full sm:w-auto'>
              <PlusIcon className='h-4 w-4' />
              Create Party
            </Button>
          </Link>
        )}
      </div>

      <div className='card p-6'>
        {parties.length === 0 ? (
          <div className='text-center'>
            <p className='text-muted-foreground'>No upcoming parties found.</p>
            {isAdmin && (
              <Button asChild className='mt-4 w-full sm:w-auto'>
                <Link href='/parties/new'>Create Your First Party</Link>
              </Button>
            )}
          </div>
        ) : (
          <PartyListWithViewToggle
            parties={parties}
            title='Upcoming Dish Parties'
            description='Browse and join upcoming dish parties in your area.'
          />
        )}
      </div>
    </div>
  )
}
