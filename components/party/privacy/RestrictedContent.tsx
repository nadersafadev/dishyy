import { ReactNode } from 'react';
import { usePartyPrivacyStore } from '@/store/partyPrivacyStore';
import { PartyAccessControl } from '@/lib/types/party';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface RestrictedContentProps {
  partyId: string;
  accessCheck: keyof PartyAccessControl;
  children: ReactNode;
  fallback?: ReactNode;
  userId?: string;
}

export function RestrictedContent({
  partyId,
  accessCheck,
  children,
  fallback,
  userId,
}: RestrictedContentProps) {
  const { getPartyAccess } = usePartyPrivacyStore();
  const access = getPartyAccess(partyId, userId);

  if (access[accessCheck]) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-muted p-3 rounded-full">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Content Restricted</h3>
          <p className="text-sm text-muted-foreground">
            This content is not visible due to the party&apos;s privacy settings
          </p>
        </div>
      </div>
    </Card>
  );
}
