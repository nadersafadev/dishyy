'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormNumberField } from '@/components/forms/form-number-field';
import { FormDateField } from '@/components/forms/form-date-field';
import { FormTextField } from '@/components/forms/form-text-field';
import { useRouter } from 'next/navigation';
import { Loader2, Check, Copy, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/lib/toast';

const formSchema = z.object({
  maxUses: z.number().min(1, 'Maximum uses must be at least 1'),
  expiresAt: z
    .date()
    .optional()
    .refine(val => {
      if (!val) return true; // Allow empty for optional field
      return val > new Date();
    }, 'Expiration date must be in the future'),
  name: z.string().optional(),
});

interface PartyInvitation {
  id: string;
  token: string;
  maxUses: number;
  currentUses: number;
  expiresAt: string | null;
  name: string | null;
  createdAt: string;
}

interface ErrorResponse {
  error: string;
}

interface InvitationFormProps {
  partyId: string;
  onSuccess?: () => void;
}

export function InvitationForm({ partyId, onSuccess }: InvitationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxUses: 1,
      expiresAt: undefined,
      name: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      // Format the data for submission
      const submissionData = {
        maxUses: values.maxUses,
        expiresAt: values.expiresAt ? values.expiresAt.toISOString() : null,
        name: values.name || null,
      };

      const response = await fetch(`/api/parties/${partyId}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = (await response.json()) as PartyInvitation | ErrorResponse;

      if (!response.ok) {
        throw new Error(
          'error' in data ? data.error : 'Failed to create invitation'
        );
      }

      const invitation = data as PartyInvitation;
      const url =
        typeof window !== 'undefined'
          ? `${window.location.origin}/invite/${invitation.token}`
          : '';
      setInvitationUrl(url);

      // Copy to clipboard if available
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(url);
          setIsCopied(true);
        } catch (error) {
          console.error('Failed to copy to clipboard:', error);
        }
      }

      toast.success('Success!', 'Invitation created and copied to clipboard!');

      setIsSuccess(true);
      form.reset();
      onSuccess?.();
      router.refresh();

      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Form submission error:', error);
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
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2 text-green-600">
          <Check className="h-5 w-5" />
          <span className="font-medium">Invitation created successfully!</span>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-md border bg-muted/50 p-2">
                <code className="text-sm break-all w-full sm:max-w-[calc(100%-3rem)]">
                  {invitationUrl}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 self-end sm:self-auto hover:bg-transparent hover:ring-0"
                  onClick={() => {
                    if (
                      typeof navigator !== 'undefined' &&
                      navigator.clipboard &&
                      invitationUrl
                    ) {
                      try {
                        navigator.clipboard.writeText(invitationUrl);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      } catch (error) {
                        console.error('Failed to copy to clipboard:', error);
                      }
                    }
                  }}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Share this link with your guests
              </p>
            </div>
          </CardContent>
        </Card>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => {
            setIsSuccess(false);
            setInvitationUrl(null);
          }}
        >
          Create Another Invitation
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <p className="text-sm">Configure your invitation link</p>
          </div>
          <FormTextField
            name="name"
            label="Name"
            placeholder="Enter invitation name"
            optional
          />
          <FormNumberField
            name="maxUses"
            label="Maximum Uses"
            min={1}
            step="1"
            description="Number of times this invitation can be used"
          />
          <FormDateField
            name="expiresAt"
            label="Expires At"
            optional
            placeholder="Select expiration date"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Invitation'
          )}
        </Button>
      </form>
    </Form>
  );
}
