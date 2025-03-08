'use client';

import { useState } from 'react';
import { SettingItem } from '@/components/profile/SettingItem';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Label } from '@/components/ui/label';
import { Key, Shield } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useUser } from '@clerk/nextjs';

export function SecurityTab() {
  const { user } = useUser();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async () => {
    try {
      // Password validation
      if (newPassword !== confirmPassword) {
        toast.error(
          "Passwords don't match",
          'New password and confirmation must match.'
        );
        return;
      }

      if (newPassword.length < 8) {
        toast.error(
          'Password too short',
          'Password must be at least 8 characters long.'
        );
        return;
      }

      // This would be the actual Clerk update password code
      // For now, we're simulating success
      toast.success(
        'Password updated',
        'Your password has been updated successfully.'
      );
      setIsPasswordModalOpen(false);

      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Error', 'There was a problem updating your password.');
    }
  };

  const handleEnable2FA = async () => {
    try {
      toast.success(
        'Two-factor authentication',
        "We've sent verification instructions to your email."
      );
      setIsTwoFactorModalOpen(false);

      // In a real implementation, this would:
      // 1. Generate a 2FA secret
      // 2. Show a QR code for the user to scan with an authenticator app
      // 3. Ask for verification code
      // 4. Enable 2FA if verification is successful
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast.error(
        'Error',
        'There was a problem enabling two-factor authentication.'
      );
    }
  };

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
            onClick={() => setIsPasswordModalOpen(true)}
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
            onClick={() => setIsTwoFactorModalOpen(true)}
          />
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your password to keep your account secure.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-password" className="text-right">
                Current
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">
                New
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirm-password" className="text-right">
                Confirm
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdatePassword}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Dialog */}
      <Dialog
        open={isTwoFactorModalOpen}
        onOpenChange={setIsTwoFactorModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enable Two-factor Authentication</DialogTitle>
            <DialogDescription>
              Enhance your account security with two-factor authentication.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Two-factor authentication adds an extra layer of security to your
              account. In addition to your password, you'll need to enter a code
              from your mobile device.
            </p>

            <div className="flex justify-center items-center p-4 bg-muted rounded-md mb-4">
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Simulated QR Code</p>
                <div className="w-40 h-40 mx-auto bg-background flex items-center justify-center border">
                  <Shield className="h-16 w-16 opacity-40" />
                </div>
                <p className="text-xs mt-2">Scan with an authenticator app</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsTwoFactorModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEnable2FA}>Enable 2FA</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
