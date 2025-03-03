import { Metadata } from 'next';
import {
  MessageSquare,
  Lightbulb,
  Wrench,
  Bug,
  Mail,
  Facebook,
} from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ContactForm } from '@/components/forms/contact-form';

export const metadata: Metadata = {
  title: 'Contact Dishyy - Get Support & Share Feedback',
  description:
    'Get in touch with the Dishyy team for support, suggestions, or bug reports. We value your feedback and are here to help make your food gatherings better!',
  keywords: [
    'contact Dishyy',
    'Dishyy support',
    'feedback',
    'bug report',
    'suggestions',
    'customer service',
    'help',
    'get in touch',
  ],
  openGraph: {
    title: 'Contact Dishyy - Get Support & Share Feedback',
    description:
      'Get in touch with the Dishyy team for support, suggestions, or bug reports. We value your feedback and are here to help!',
    type: 'website',
    siteName: 'Dishyy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Dishyy - Get Support & Share Feedback',
    description: "Get in touch with the Dishyy team. We're here to help!",
  },
};

const contactCategories = [
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'General Inquiry',
    description: "Have a question? We're here to help!",
    value: 'general',
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: 'Suggestions',
    description: 'Share your ideas to help us improve',
    value: 'suggestion',
  },
  {
    icon: <Wrench className="h-6 w-6" />,
    title: 'Service Request',
    description: 'Need a specific feature or service?',
    value: 'service',
  },
  {
    icon: <Bug className="h-6 w-6" />,
    title: 'Bug Report',
    description: "Help us fix any issues you've found",
    value: 'bug',
  },
];

const socialLinks = [
  {
    icon: <Mail className="h-5 w-5" />,
    label: 'Email',
    href: 'mailto:support@dishyy.com',
  },
  {
    icon: <Facebook className="h-5 w-5" />,
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61573495006114',
  },
];

export default function ContactPage() {
  // JSON-LD structured data for Contact Page
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Dishyy',
    description: 'Get in touch with the Dishyy team for support and feedback',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@dishyy.com',
      contactType: 'customer support',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dishyy',
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo-black.png`,
    sameAs: ['https://www.facebook.com/profile.php?id=61573495006114'],
  };

  return (
    <>
      {/* Add structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section
          className="relative py-12 sm:py-20 bg-gradient-to-b from-primary/5 to-background"
          aria-labelledby="contact-heading"
        >
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1
                id="contact-heading"
                className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl mb-6"
              >
                Get in Touch
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                We'd love to hear from you! Whether you have a question,
                suggestion, or found a bug, your feedback helps us improve.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Categories */}
        <section
          className="py-8 sm:py-12"
          aria-labelledby="contact-categories-heading"
        >
          <div className="container px-4 mx-auto">
            <h2 id="contact-categories-heading" className="sr-only">
              Contact Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {contactCategories.map(category => (
                <Card
                  key={category.value}
                  className="border-2 hover:border-primary/50 transition-colors"
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      {category.icon}
                    </div>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section
          className="py-8 sm:py-12 bg-gradient-to-t from-primary/5 to-background"
          aria-labelledby="contact-form-heading"
        >
          <div className="container px-4 mx-auto">
            <h2 id="contact-form-heading" className="sr-only">
              Contact Form
            </h2>
            <div className="max-w-2xl mx-auto">
              <ContactForm
                categories={contactCategories.map(({ title, value }) => ({
                  title,
                  value,
                }))}
              />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section
          className="py-8 sm:py-12"
          aria-labelledby="social-links-heading"
        >
          <div className="container px-4 mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h2
                id="social-links-heading"
                className="text-xl sm:text-2xl font-bold mb-6"
              >
                Connect With Us
              </h2>
              <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                {socialLinks.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors p-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Connect with us on ${link.label}`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
