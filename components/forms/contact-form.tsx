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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  category: z.string({
    required_error: 'Please select a category',
  }),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

interface ContactFormProps {
  categories: {
    title: string;
    value: string;
  }[];
}

export function ContactForm({ categories }: ContactFormProps) {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      category: '',
      message: '',
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
      toast({
        title: 'Message Sent',
        description: "Thank you for your message. We'll get back to you soon!",
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message. Please try again.',
      });
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
            <Button type="submit" className="w-full" size="lg">
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
