'use client';

import { useState } from 'react';
import { SettingItem } from '@/components/profile/SettingItem';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';

export function PreferencesTab() {
  const { theme, setTheme } = useTheme();
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [partyInvites, setPartyInvites] = useState(true);
  const [dishUpdates, setDishUpdates] = useState(true);

  const handleSaveNotifications = () => {
    toast({
      title: 'Notification preferences saved',
      description: 'Your notification settings have been updated.',
    });
    setIsNotificationsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how Dishyy looks for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Theme Preference</p>
                <p className="text-sm text-muted-foreground">
                  Choose between light, dark, or system theme
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setTheme('light');
                  toast({
                    title: 'Theme updated',
                    description: 'Light theme applied successfully.',
                  });
                }}
              >
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setTheme('dark');
                  toast({
                    title: 'Theme updated',
                    description: 'Dark theme applied successfully.',
                  });
                }}
              >
                Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setTheme('system');
                  toast({
                    title: 'Theme updated',
                    description: 'System theme preference applied.',
                  });
                }}
              >
                System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingItem
            icon={<Bell className="h-5 w-5" />}
            title="Email Notifications"
            description="Receive updates about your parties and contributions"
            actionLabel="Configure"
            onClick={() => setIsNotificationsModalOpen(true)}
          />
        </CardContent>
      </Card>

      {/* Notifications Dialog */}
      <Dialog
        open={isNotificationsModalOpen}
        onOpenChange={setIsNotificationsModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>
              Customize which notifications you receive from Dishyy.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications" className="font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about activity on Dishyy
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="party-invites" className="font-medium">
                  Party Invitations
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when you're invited to a party
                </p>
              </div>
              <Switch
                id="party-invites"
                checked={partyInvites}
                onCheckedChange={setPartyInvites}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dish-updates" className="font-medium">
                  Dish Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about dishes you've contributed to
                </p>
              </div>
              <Switch
                id="dish-updates"
                checked={dishUpdates}
                onCheckedChange={setDishUpdates}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsNotificationsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNotifications}>Save Preferences</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
