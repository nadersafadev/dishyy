import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DishForm } from '@/components/DishForm'

export default async function NewDishPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  })

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className='max-w-2xl mx-auto space-y-8'>
      <div className='space-y-2'>
        <h1 className='text-2xl font-semibold tracking-tight'>Add New Dish</h1>
        <p className='text-muted-foreground'>
          Create a new dish that can be added to parties.
        </p>
      </div>

      <div className='card p-6'>
        <DishForm />
      </div>
    </div>
  )
}
