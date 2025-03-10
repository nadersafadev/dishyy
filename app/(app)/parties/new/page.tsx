import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import CreatePartyForm from '@/components/CreatePartyForm';
import { generateMetadata as baseGenerateMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = baseGenerateMetadata('New Party');

export default async function NewPartyPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User ID not found');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized access');
  }

  return (
    <div className="container mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">New Party</h1>
        <p className="text-muted-foreground">
          Create a new dish party and invite others to join.
        </p>
      </div>

      <div className="card p-6">
        <CreatePartyForm />
      </div>
    </div>
  );
}
