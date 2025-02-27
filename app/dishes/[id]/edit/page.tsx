import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DishForm } from '@/components/DishForm'

export default async function EditDishPage({
  params,
}: {
  params: { id: string }
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const [user, dish] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    }),
    prisma.dish.findUnique({
      where: { id: params.id },
    }),
  ])

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  if (!dish) {
    redirect('/dishes')
  }

  return (
    <div className='max-w-2xl mx-auto space-y-8'>
      <div className='space-y-2'>
        <h1 className='text-2xl font-semibold tracking-tight'>Edit Dish</h1>
        <p className='text-muted-foreground'>
          Update the details of &quot;{dish.name}&quot;.
        </p>
      </div>

      <div className='card p-6'>
        <DishForm dish={dish} />
      </div>
    </div>
  )
}
