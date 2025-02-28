import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CreatePartyForm from '@/components/CreatePartyForm';

export default async function NewPartyPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create a New Party
        </h1>
        <p className="text-muted-foreground">
          Set up a new dish party and invite others to join the culinary
          adventure.
        </p>
      </div>

      <div className="card p-6">
        <CreatePartyForm />
      </div>
    </div>
  );
}
