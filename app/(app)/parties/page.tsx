import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { PartyListWithViewToggle } from '@/components/party-list-with-view-toggle';
import { generateMetadata } from '@/lib/metadata';
import { PartyFilters, PartyWithDetails } from '@/components/parties';
import { DataPagination } from '@/components/ui/DataPagination';

export const metadata = generateMetadata(
  'Parties',
  'Browse and manage your parties'
);

interface PageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: 'name' | 'date' | 'createdAt' | 'participantsCount';
    sortOrder?: 'asc' | 'desc';
    dateFrom?: string;
    dateTo?: string;
  };
}

export default async function PartiesPage({ searchParams }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User ID not found');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Get query parameters with defaults
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '10');
  const sortBy = searchParams.sortBy || 'name';
  const sortOrder = searchParams.sortOrder || 'asc';
  const search = searchParams.search || '';
  const dateFrom = searchParams.dateFrom || '';
  const dateTo = searchParams.dateTo || '';

  const [partiesData] = await Promise.all([
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
        _count: {
          select: {
            participants: true,
          },
        },
      },
      where: {
        AND: [
          {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
          {
            date: {
              gte: dateFrom ? new Date(dateFrom) : new Date(),
              ...(dateTo && { lte: new Date(dateTo) }),
            },
          },
        ],
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  // Get total count for pagination
  const totalCount = await prisma.party.count({
    where: {
      AND: [
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
        {
          date: {
            gte: dateFrom ? new Date(dateFrom) : new Date(),
            ...(dateTo && { lte: new Date(dateTo) }),
          },
        },
      ],
    },
  });

  const isAdmin = user.role === 'ADMIN';
  const totalPages = Math.ceil(totalCount / limit);

  // Cast the parties data to the correct type
  const parties = partiesData as unknown as PartyWithDetails[];

  // Create pagination metadata
  const pagination = {
    page,
    limit,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            All Dish Parties
          </h1>
          <p className="text-muted-foreground">
            Browse and join upcoming dish parties in your area.
          </p>
        </div>
        {isAdmin && (
          <Link href="/parties/new" className="self-start sm:self-auto">
            <Button className="gap-2 w-full sm:w-auto">
              <PlusIcon className="h-4 w-4" />
              Create Party
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <PartyFilters
        search={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />

      <div className="card p-6">
        {parties.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground">No upcoming parties found.</p>
            {isAdmin && (
              <Button asChild className="mt-4 w-full sm:w-auto">
                <Link href="/parties/new">Create Your First Party</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <PartyListWithViewToggle
              parties={parties}
              title="Upcoming Dish Parties"
              description="Browse and join upcoming dish parties in your area."
            />

            {/* Pagination */}
            <DataPagination
              pagination={pagination}
              itemName="parties"
              baseUrl="/parties"
            />
          </>
        )}
      </div>
    </div>
  );
}
