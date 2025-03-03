'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface ConnectedAccountProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  isConnected?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function ConnectedAccount({
  icon,
  name,
  description,
  isConnected: initialConnected = false,
  onConnect,
  onDisconnect,
}: ConnectedAccountProps) {
  const [isConnected, setIsConnected] = useState(initialConnected);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnection = async () => {
    setIsLoading(true);

    try {
      if (isConnected) {
        // Simulate the disconnection process
        await new Promise(resolve => setTimeout(resolve, 800));

        if (onDisconnect) {
          onDisconnect();
        }

        setIsConnected(false);
        toast({
          title: `${name} disconnected`,
          description: `Your ${name} account has been disconnected successfully.`,
        });
      } else {
        // Simulate the OAuth connection process
        await new Promise(resolve => setTimeout(resolve, 800));

        if (onConnect) {
          onConnect();
        }

        setIsConnected(true);
        toast({
          title: `${name} connected`,
          description: `Your ${name} account has been connected successfully.`,
        });
      }
    } catch (error) {
      console.error(
        `Error ${isConnected ? 'disconnecting' : 'connecting'} account:`,
        error
      );
      toast({
        title: 'Error',
        description: `There was a problem ${isConnected ? 'disconnecting' : 'connecting'} your ${name} account.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="text-muted-foreground">{icon}</div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : description}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleConnection}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : isConnected ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  );
}
