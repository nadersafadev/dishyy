'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/forms/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface ProfileHeaderProps {
  dbUser?: { role: string } | null;
  accountCreated: string;
}

export function ProfileHeader({ dbUser, accountCreated }: ProfileHeaderProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  if (!user) return null;

  const handleEditProfile = () => {
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      // This is where you would actually save the profile using Clerk's API
      await user.update({
        firstName,
        lastName,
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      });

      setIsEditModalOpen(false);
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'There was a problem updating your profile.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
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
              <Button variant="outline" size="sm" onClick={handleEditProfile}>
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile information here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last name
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveProfile}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
