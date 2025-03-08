'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormTextField } from '@/components/forms/form-text-field';
import { FormSingleSelect } from '@/components/forms/form-single-select';
import { FormTextAreaField } from '@/components/forms/form-textarea-field';
import { FormCheckboxField } from '@/components/forms/form-checkbox-field';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Send } from 'lucide-react';
import { toast } from '@/lib/toast';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  category: z.string({
    required_error: 'Please select a category',
  }),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  consent: z.boolean().refine(val => val, {
    message: 'You must accept the Terms and Privacy Policy',
  }),
}) satisfies z.ZodType<any>;

type FormData = z.infer<typeof formSchema>;

interface ContactFormProps {
  categories: Array<{
    title: string;
    value: string;
  }>;
}

export function ContactForm({ categories }: ContactFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      category: '',
      message: '',
      consent: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      form.reset();
      toast.success(
        'Message Sent',
        "Thank you for your message. We'll get back to you soon!"
      );
    } catch (error) {
      toast.error('Error', 'Failed to send message. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send us a Message</CardTitle>
        <CardDescription>
          Fill out the form below and we'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormTextField name="name" label="Name" placeholder="Your name" />
            <FormTextField
              name="email"
              label="Email"
              type="email"
              placeholder="your@email.com"
            />
            <FormSingleSelect
              name="category"
              label="Category"
              placeholder="Select a category"
              options={categories.map(cat => ({
                label: cat.title,
                value: cat.value,
              }))}
            />
            <FormTextAreaField
              name="message"
              label="Message"
              placeholder="Your message here..."
              rows={6}
              className="resize-none"
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

              <Button type="submit" className="w-full" size="lg">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
