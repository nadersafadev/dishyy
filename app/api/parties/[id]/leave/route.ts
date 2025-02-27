import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is a participant
    const participant = await prisma.partyParticipant.findUnique({
      where: {
        userId_partyId: {
          userId: user.id,
          partyId: params.id,
        },
      },
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Not a participant of this party' },
        { status: 400 }
      )
    }

    // Leave the party
    await prisma.partyParticipant.delete({
      where: {
        userId_partyId: {
          userId: user.id,
          partyId: params.id,
        },
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error leaving party:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
