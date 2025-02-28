'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';

interface ProfileHeaderProps {
  dbUser?: { role: string } | null;
  accountCreated: string;
}

export function ProfileHeader({ dbUser, accountCreated }: ProfileHeaderProps) {
  const { user } = useUser();

  if (!user) return null;

  return (
    <Card className="w-full border-none shadow-md bg-white dark:bg-gray-950">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={user.imageUrl} alt="Profile" />
            <AvatarFallback>
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1 text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </p>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
              {dbUser?.role === 'ADMIN' && (
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  Administrator
                </Badge>
              )}
              <Badge variant="outline" className="bg-muted/50">
                Member since {accountCreated}
              </Badge>
            </div>
          </div>

          <div className="flex gap-3 self-center">
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
