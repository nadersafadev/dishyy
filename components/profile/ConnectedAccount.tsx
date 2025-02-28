'use client';

import { Button } from '@/components/ui/button';

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
  isConnected = false,
  onConnect,
  onDisconnect,
}: ConnectedAccountProps) {
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
        onClick={isConnected ? onDisconnect : onConnect}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  );
}
