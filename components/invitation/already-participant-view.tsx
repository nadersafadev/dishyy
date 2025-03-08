'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface AlreadyParticipantViewProps {
  partyId: string;
}

export function AlreadyParticipantView({
  partyId,
}: AlreadyParticipantViewProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold mb-4">Already a Participant</h1>
          <p>You are already a participant in this party.</p>
          <Button
            className="mt-4"
            onClick={() => router.push(`/parties/${partyId}`)}
          >
            View Party
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
