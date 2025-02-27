import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateDishSchema = z.object({
  amountPerPerson: z.number().positive('Amount per person must be positive'),
})

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; dishId: string } }
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
    const validatedData = updateDishSchema.parse(body)

    // Check if party dish exists
    const partyDish = await prisma.partyDish.findUnique({
      where: {
        partyId_dishId: {
          partyId: params.id,
          dishId: params.dishId,
        },
      },
    })

    if (!partyDish) {
      return NextResponse.json(
        { error: 'Party dish not found' },
        { status: 404 }
      )
    }

    // Update party dish
    const updatedPartyDish = await prisma.partyDish.update({
      where: {
        partyId_dishId: {
          partyId: params.id,
          dishId: params.dishId,
        },
      },
      data: {
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

    return NextResponse.json(updatedPartyDish)
  } catch (error) {
    console.error('Error updating party dish:', error)
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; dishId: string } }
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

    // Check if party dish exists
    const partyDish = await prisma.partyDish.findUnique({
      where: {
        partyId_dishId: {
          partyId: params.id,
          dishId: params.dishId,
        },
      },
    })

    if (!partyDish) {
      return NextResponse.json(
        { error: 'Party dish not found' },
        { status: 404 }
      )
    }

    // Delete party dish
    await prisma.partyDish.delete({
      where: {
        partyId_dishId: {
          partyId: params.id,
          dishId: params.dishId,
        },
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting party dish:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
