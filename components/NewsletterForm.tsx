'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { FormTextField } from '@/components/forms/form-text-field';
import { FormCheckboxField } from '@/components/forms/form-checkbox-field';
import Link from 'next/link';
import { toast } from '@/lib/toast';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  consent: z.boolean().refine(val => val, {
    message: 'You must accept the Terms and Privacy Policy',
  }),
});

type FormData = z.infer<typeof formSchema>;

export function NewsletterForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      consent: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      toast.success('Success!', 'Successfully subscribed to the newsletter!');
      form.reset();
    } catch (error) {
      toast.error('Error', 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-semibold">Stay Updated</h3>
      <p className="text-sm text-muted-foreground mt-2 mb-4">
        Subscribe to get the latest recipes and updates.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormTextField
            name="email"
            type="email"
            placeholder="your@email.com"
            className="w-full bg-background"
          />
          <div className="space-y-4">
            <FormCheckboxField name="consent">
              <div className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Link
                  href="/terms-of-use"
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  Terms of Use
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy-policy"
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </div>
            </FormCheckboxField>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe to Newsletter'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
