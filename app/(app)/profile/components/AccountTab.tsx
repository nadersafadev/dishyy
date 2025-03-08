'use client';

import { ConnectedAccount } from '@/components/profile/ConnectedAccount';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@clerk/nextjs';
import { Github, Twitter } from 'lucide-react';
import { toast } from '@/lib/toast';

interface AccountTabProps {
  dbUser?: { role: string } | null;
}

export function AccountTab({ dbUser }: AccountTabProps) {
  const { user } = useUser();

  if (!user) return null;

  const handleConnectGithub = () => {
    // In a real app, this would initiate OAuth with GitHub
    // For now we just use the simulation in ConnectedAccount
    console.log('Connecting to GitHub...');
  };

  const handleDisconnectGithub = () => {
    // In a real app, this would remove the GitHub connection
    console.log('Disconnecting from GitHub...');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                First Name
              </label>
              <div className="mt-1 text-base">{user.firstName}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Last Name
              </label>
              <div className="mt-1 text-base">{user.lastName}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <div className="mt-1 text-base">
                {user.primaryEmailAddress?.emailAddress}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Role
              </label>
              <div className="mt-1 text-base capitalize">
                {dbUser?.role?.toLowerCase() || 'User'}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            This information is managed through your Clerk account.
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Manage your connected accounts and social logins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ConnectedAccount
              icon={<Github className="h-5 w-5" />}
              name="GitHub"
              description="Connect your GitHub account"
              onConnect={handleConnectGithub}
              onDisconnect={handleDisconnectGithub}
            />
            <Separator />
            <ConnectedAccount
              icon={<Twitter className="h-5 w-5" />}
              name="Twitter"
              description="Connect your Twitter account"
              onConnect={() =>
                toast.info(
                  'Twitter integration',
                  'Twitter integration coming soon!'
                )
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
