import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle, Shield, Settings } from 'lucide-react';
import { generateMetadata } from '@/lib/metadata';
import { prisma } from '@/lib/prisma';

// Import our custom components
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileStats } from './components/ProfileStats';
import { AccountTab } from './components/AccountTab';
import { SecurityTab } from './components/SecurityTab';
import { PreferencesTab } from './components/PreferencesTab';

export const metadata = generateMetadata(
  'Profile',
  'Manage your profile and account settings'
);

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect('/sign-in');
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // Get parties created by user using the correct relation field
  const userParties = user
    ? await prisma.party.findMany({
        where: { createdById: user.id },
      })
    : [];

  // For contributions, use placeholder data for now
  const totalParties = userParties.length;
  const totalContributions = 0; // Placeholder until we have the actual schema

  const accountCreated = clerkUser.createdAt
    ? new Date(clerkUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  // Only pass DB-related info that can't be accessed from Clerk's hooks
  const dbUserInfo = user ? { role: user.role } : null;

  return (
    <div className="w-full mx-auto py-10 px-4 md:px-8 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="mb-8">
          <ProfileHeader dbUser={dbUserInfo} accountCreated={accountCreated} />
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <ProfileStats
              totalParties={totalParties}
              totalContributions={totalContributions}
            />
          </div>

          <div className="md:col-span-3">
            <Tabs defaultValue="account">
              <TabsList className="mb-6">
                <TabsTrigger value="account">
                  <UserCircle className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="preferences">
                  <Settings className="h-4 w-4 mr-2" />
                  Preferences
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <AccountTab dbUser={dbUserInfo} />
              </TabsContent>

              <TabsContent value="security">
                <SecurityTab />
              </TabsContent>

              <TabsContent value="preferences">
                <PreferencesTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
