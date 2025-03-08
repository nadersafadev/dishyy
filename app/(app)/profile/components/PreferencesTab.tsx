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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from '@/lib/toast';

export function PreferencesTab() {
  const { theme, setTheme } = useTheme();
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [partyInvites, setPartyInvites] = useState(true);
  const [dishUpdates, setDishUpdates] = useState(true);

  const handleSaveNotifications = () => {
    toast.success(
      'Notification preferences saved',
      'Your notification settings have been updated.'
    );
    setIsNotificationsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how Dishyy looks on your device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label>Theme</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setTheme('light');
                    toast.info('Theme updated', 'Light theme applied.');
                  }}
                >
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setTheme('dark');
                    toast.info('Theme updated', 'Dark theme applied.');
                  }}
                >
                  Dark
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setTheme('system');
                    toast.info(
                      'Theme updated',
                      'System theme preference applied.'
                    );
                  }}
                >
                  System
                </Button>
              </div>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Preferences</DialogTitle>
            <DialogDescription>
              Choose which notifications you want to receive
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="party-invites">Party Invites</Label>
              <Switch
                id="party-invites"
                checked={partyInvites}
                onCheckedChange={setPartyInvites}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dish-updates">Dish Updates</Label>
              <Switch
                id="dish-updates"
                checked={dishUpdates}
                onCheckedChange={setDishUpdates}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveNotifications}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
