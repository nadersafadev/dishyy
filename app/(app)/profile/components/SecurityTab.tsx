'use client';

import { SettingItem } from '@/components/profile/SettingItem';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Key, Shield } from 'lucide-react';

export function SecurityTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingItem
            icon={<Key className="h-5 w-5" />}
            title="Password"
            description="Last updated: Never"
            actionLabel="Update"
            onClick={() => {}}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingItem
            icon={<Shield className="h-5 w-5" />}
            title="Two-factor Authentication"
            description="Enable 2FA for enhanced security"
            actionLabel="Enable"
            onClick={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
}
