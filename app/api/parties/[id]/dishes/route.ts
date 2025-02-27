import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const addDishSchema = z.object({
  dishId: z.string().min(1, 'Dish ID is required'),
  amountPerPerson: z.number().positive('Amount per person must be positive'),
})

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse('Only admins can modify party dishes', {
        status: 403,
      })
    }

    const body = await req.json()
    const validatedData = addDishSchema.parse(body)

    // Check if party exists
    const party = await prisma.party.findUnique({
      where: { id: params.id },
    })

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 })
    }

    // Check if dish exists
    const dish = await prisma.dish.findUnique({
      where: { id: validatedData.dishId },
    })

    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 })
    }

    // Check if dish is already in party
    const existingPartyDish = await prisma.partyDish.findUnique({
      where: {
        partyId_dishId: {
          partyId: params.id,
          dishId: validatedData.dishId,
        },
      },
    })

    if (existingPartyDish) {
      return NextResponse.json(
        { error: 'Dish is already in party' },
        { status: 400 }
      )
    }

    // Add dish to party
    const partyDish = await prisma.partyDish.create({
      data: {
        partyId: params.id,
        dishId: validatedData.dishId,
        amountPerPerson: validatedData.amountPerPerson,
      },
      include: {
        dish: {
          select: {
            name: true,
            unit: true,
          },
        },
      },
    })

    return NextResponse.json(partyDish)
  } catch (error) {
    console.error('Error adding dish to party:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
