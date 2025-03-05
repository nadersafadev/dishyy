import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const partySchema = z.object({
  name: z.string().min(1, 'Party name is required'),
  description: z.string().optional(),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date',
  }),
  maxParticipants: z.number().min(1).optional(),
  dishes: z
    .array(
      z.object({
        dishId: z.string(),
        amountPerPerson: z.number().positive('Amount must be greater than 0'),
      })
    )
    .min(1, 'At least one dish is required'),
});

// Query params validation schema
const getPartiesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z
    .enum(['name', 'date', 'createdAt', 'participantsCount'])
    .default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

// GET all parties with filtering, sorting and pagination
export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);

    // Parse and validate query params
    const queryParams = getPartiesQuerySchema.parse({
      page: url.searchParams.get('page') || 1,
      limit: url.searchParams.get('limit') || 20,
      sortBy: url.searchParams.get('sortBy') || 'date',
      sortOrder: url.searchParams.get('sortOrder') || 'desc',
      search: url.searchParams.get('search') || undefined,
      dateFrom: url.searchParams.get('dateFrom') || undefined,
      dateTo: url.searchParams.get('dateTo') || undefined,
    });

    // Calculate pagination
    const skip = (queryParams.page - 1) * queryParams.limit;

    // Build where conditions for filtering
    const whereConditions: any = {};

    // Search by name or description
    if (queryParams.search) {
      whereConditions.OR = [
        {
          name: {
            contains: queryParams.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: queryParams.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Filter by date range
    if (queryParams.dateFrom || queryParams.dateTo) {
      whereConditions.date = {};
      if (queryParams.dateFrom) {
        whereConditions.date.gte = new Date(queryParams.dateFrom);
      }
      if (queryParams.dateTo) {
        whereConditions.date.lte = new Date(queryParams.dateTo);
      }
    }

    // Build orderBy
    let orderBy: any = {};
    switch (queryParams.sortBy) {
      case 'name':
      case 'date':
      case 'createdAt':
        orderBy[queryParams.sortBy] = queryParams.sortOrder;
        break;
      case 'participantsCount':
        // Special case handled below
        break;
      default:
        orderBy.date = 'desc';
    }

    // Get parties with their relations and counts
    const partiesPromise = prisma.party.findMany({
      where: whereConditions,
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
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: queryParams.sortBy === 'participantsCount' ? undefined : orderBy,
      skip,
      take: queryParams.limit,
    });

    // Get total count for pagination
    const totalCountPromise = prisma.party.count({
      where: whereConditions,
    });

    // Execute both promises simultaneously
    const [parties, totalCount] = await Promise.all([
      partiesPromise,
      totalCountPromise,
    ]);

    // Sort by participantsCount if needed
    if (queryParams.sortBy === 'participantsCount') {
      parties.sort((a, b) => {
        const countA = a._count?.participants || 0;
        const countB = b._count?.participants || 0;
        return queryParams.sortOrder === 'asc'
          ? countA - countB
          : countB - countA;
      });
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / queryParams.limit);
    const hasNextPage = queryParams.page < totalPages;
    const hasPreviousPage = queryParams.page > 1;

    return NextResponse.json({
      parties,
      pagination: {
        page: queryParams.page,
        limit: queryParams.limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    console.error('Error fetching parties:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error fetching parties' },
      { status: 500 }
    );
  }
}

// CREATE a new party
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = partySchema.parse(body);

    // Verify all dishes exist
    const dishes = await prisma.dish.findMany({
      where: {
        id: {
          in: validatedData.dishes.map(d => d.dishId),
        },
      },
    });

    if (dishes.length !== validatedData.dishes.length) {
      return NextResponse.json(
        { error: 'One or more dishes not found' },
        { status: 400 }
      );
    }

    const party = await prisma.party.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || '',
        date: new Date(validatedData.date),
        maxParticipants: validatedData.maxParticipants,
        createdById: user.id,
        dishes: {
          create: validatedData.dishes.map(({ dishId, amountPerPerson }) => ({
            dish: {
              connect: { id: dishId },
            },
            amountPerPerson,
          })),
        },
      },
      include: {
        createdBy: true,
        dishes: {
          include: {
            dish: true,
          },
        },
      },
    });

    return NextResponse.json(party);
  } catch (error) {
    console.error('Error creating party:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
