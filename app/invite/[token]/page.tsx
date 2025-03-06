import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { AcceptInvitationForm } from '@/components/invitation/accept-invitation-form';
import { AlreadyParticipantView } from '@/components/invitation/already-participant-view';
import { SignInPrompt } from '@/components/invitation/sign-in-prompt';

interface InvitePageProps {
  params: {
    token: string;
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { userId } = await auth();

  const invitation = await prisma.partyInvitation.findUnique({
    where: {
      token: params.token,
    },
    include: {
      party: {
        include: {
          createdBy: {
            select: {
              name: true,
            },
          },
          participants: true,
        },
      },
    },
  });

  if (!invitation) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-4">Invalid Invitation</h1>
            <p>This invitation link is invalid or has expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if invitation is expired
  if (invitation.expiresAt && invitation.expiresAt < new Date()) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-4">Expired Invitation</h1>
            <p>This invitation has expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if invitation has reached max uses
  if (invitation.currentUses >= invitation.maxUses) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-4">Invitation Used</h1>
            <p>This invitation has reached its maximum number of uses.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is already a participant
  if (userId) {
    const existingParticipant = await prisma.partyParticipant.findUnique({
      where: {
        userId_partyId: {
          userId,
          partyId: invitation.partyId,
        },
      },
    });

    if (existingParticipant) {
      return <AlreadyParticipantView partyId={invitation.partyId} />;
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            You're Invited!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold">
              {invitation.party.name}
            </h2>
            <p className="text-muted-foreground">
              Invited by {invitation.party.createdBy.name}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="font-medium">Date:</span>
              <span>{format(new Date(invitation.party.date), 'PPP')}</span>
            </div>
            {invitation.party.description && (
              <div className="text-center">
                <p className="text-muted-foreground">
                  {invitation.party.description}
                </p>
              </div>
            )}
          </div>

          {userId ? (
            <AcceptInvitationForm
              token={params.token}
              partyId={invitation.partyId}
              maxParticipants={invitation.party.maxParticipants ?? undefined}
              currentGuests={
                invitation.party.participants.length +
                invitation.party.participants.reduce(
                  (sum, p) => sum + p.numGuests,
                  0
                ) +
                1 // Add the main participant (the user accepting the invitation)
              }
            />
          ) : (
            <SignInPrompt />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
