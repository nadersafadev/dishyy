import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updatePartySchema = z.object({
  name: z.string().min(1, 'Party name is required'),
  description: z.string().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date',
  }),
  maxParticipants: z.number().min(1).nullable(),
})

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const party = await prisma.party.findUnique({
      where: { id: params.id },
      include: {
        createdBy: true,
        dishes: {
          include: {
            dish: true,
          },
        },
        participants: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 })
    }

    return NextResponse.json(party)
  } catch (error) {
    console.error('Error fetching party:', error)
    return NextResponse.json({ error: 'Error fetching party' }, { status: 500 })
  }
}

export async function PATCH(
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
      return new NextResponse('Only admins can update parties', { status: 403 })
    }

    const body = await req.json()
    const validatedData = updatePartySchema.parse(body)

    // Get current party
    const party = await prisma.party.findUnique({
      where: { id: params.id },
      include: {
        participants: true,
      },
    })

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 })
    }

    // If reducing max participants, check if it would exclude current participants
    if (
      validatedData.maxParticipants !== null &&
      party.participants.length > 0
    ) {
      const totalParticipants = party.participants.reduce(
        (sum, p) => sum + 1 + p.numGuests,
        0
      )
      if (totalParticipants > validatedData.maxParticipants) {
        return NextResponse.json(
          {
            error:
              'Cannot reduce maximum participants below current participant count',
          },
          { status: 400 }
        )
      }
    }

    // Update party
    const updatedParty = await prisma.party.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        description: validatedData.description || '',
        date: new Date(validatedData.date),
        maxParticipants: validatedData.maxParticipants,
      },
    })

    return NextResponse.json(updatedParty)
  } catch (error) {
    console.error('Error updating party:', error)
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
