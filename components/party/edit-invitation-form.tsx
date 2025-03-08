'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormTextField } from '@/components/forms/form-text-field';
import { FormNumberField } from '@/components/forms/form-number-field';
import { FormDateField } from '@/components/forms/form-date-field';
import { Loader2 } from 'lucide-react';

const editInvitationSchema = z.object({
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

interface EditInvitationFormProps {
  invitation: {
    id: string;
    maxUses: number;
    expiresAt: string | null;
    name: string | null;
  };
  partyId: string;
  onSuccess: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function EditInvitationForm({
  invitation,
  partyId,
  onSuccess,
  onCancel,
  isSaving,
}: EditInvitationFormProps) {
  const form = useForm<z.infer<typeof editInvitationSchema>>({
    resolver: zodResolver(editInvitationSchema),
    defaultValues: {
      maxUses: invitation.maxUses,
      expiresAt: invitation.expiresAt
        ? new Date(invitation.expiresAt)
        : undefined,
      name: invitation.name || undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof editInvitationSchema>) {
    try {
      // Format the data for submission
      const submissionData = {
        maxUses: values.maxUses,
        expiresAt: values.expiresAt?.toISOString() || null,
        name: values.name || null,
      };

      const response = await fetch(
        `/api/parties/${partyId}/invitations/${invitation.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update invitation');
      }

      onSuccess();
    } catch (error) {
      console.error('Error updating invitation:', error);
      throw error;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
