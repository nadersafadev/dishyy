'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { useToast } from '@/hooks/use-toast';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      toast({
        title: 'Success!',
        description: 'Successfully subscribed to the newsletter!',
      });
      setEmail('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to subscribe. Please try again.',
      });
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
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full bg-background"
          aria-label="Email address for newsletter"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe to Newsletter'}
        </Button>
      </form>
    </div>
  );
}
