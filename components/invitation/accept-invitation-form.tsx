'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormTextarea } from '@/components/forms/form-textarea';
import { useRouter } from 'next/navigation';
import { Loader2, Check, Copy, AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GuestSelection } from '@/components/forms/guest-selection';
import { toast } from '@/lib/toast';

const formSchema = z.object({
  numGuests: z.number().min(0, 'Number of guests cannot be negative'),
  message: z.string().optional(),
});

interface AcceptInvitationFormProps {
  token: string;
  partyId: string;
  maxParticipants?: number;
  currentGuests?: number;
}

interface ErrorResponse {
  error: string;
  type?: string;
  maxParticipants?: number;
  currentGuests?: number;
}

export function AcceptInvitationForm({
  token,
  partyId,
  maxParticipants,
  currentGuests = 0,
}: AcceptInvitationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numGuests: 0,
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/invitations/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data);
        return;
      }

      setIsSuccess(true);
      toast.success(
        'Success!',
        'You have been added to the party! Redirecting you...'
      );

      // Wait a moment to show the success state
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirect to the party page
      router.push(`/parties/${partyId}`);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error(
        'Error',
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold">
          Successfully joined the party!
        </h3>
        <p className="text-muted-foreground">
          Redirecting you to the party page...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.error}</AlertDescription>
        </Alert>
        {error.type === 'ALREADY_PARTICIPANT' && (
          <Button
            onClick={() => router.push(`/parties/${partyId}`)}
            className="mt-4 gap-2"
          >
            View Party
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        {error.type === 'CAPACITY_EXCEEDED' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You can try again with fewer guests or contact the host to discuss
              the party capacity.
            </p>
            <Button
              onClick={() => {
                setError(null);
                form.reset();
              }}
              className="mt-4 gap-2"
            >
              Try Again with Different Guest Count
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <GuestSelection
          value={form.watch('numGuests')}
          onChange={value => form.setValue('numGuests', value)}
          maxGuests={maxParticipants}
          currentGuests={currentGuests}
        />
        <FormTextarea
          name="message"
          label="Message (Optional)"
          description="Add a personal message to the host"
          placeholder="Thank you for the invitation! I'm looking forward to it!"
        />
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/parties')}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Decline
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accepting...
              </>
            ) : (
              'Accept Invitation'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
