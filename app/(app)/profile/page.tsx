import { auth, currentUser } from '@clerk/nextjs/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle, Shield, Settings } from 'lucide-react';
import { generateMetadata as baseGenerateMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

// Import our custom components
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileStats } from './components/ProfileStats';
import { AccountTab } from './components/AccountTab';
import { SecurityTab } from './components/SecurityTab';
import { PreferencesTab } from './components/PreferencesTab';

export const metadata: Metadata = baseGenerateMetadata('Profile');

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User ID not found');
  }

  const [user, clerkUser] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true },
    }),
    currentUser(),
  ]);

  if (!user || !clerkUser) {
    throw new Error('User not found');
  }

  // Get parties created by user using the correct relation field
  const userParties = user
    ? await prisma.party.findMany({
        where: { createdById: user.id },
      })
    : [];

  // Get total contributions by the user
  const totalContributions = user
    ? await prisma.participantDishContribution.count({
        where: {
          participant: {
            userId: user.id,
          },
        },
      })
    : 0;

  const totalParties = userParties.length;

  const accountCreated = clerkUser.createdAt
    ? new Date(clerkUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile and account settings.
        </p>
      </div>

      <div className="card p-6">
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4">
            <AccountTab />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <SecurityTab />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <PreferencesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
