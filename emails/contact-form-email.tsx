import * as React from 'react';
import {
  Html,
  Body,
  Head,
  Heading,
  Container,
  Preview,
  Section,
  Text,
  Link,
  Img,
} from '@react-email/components';

interface ContactFormEmailProps {
  name: string;
  email: string;
  category: string;
  message: string;
}

export const ContactFormEmail = ({
  name,
  email,
  category,
  message,
}: ContactFormEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New message from {name} via Dishyy Contact Form</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={logoSection}>
            <Img
              src={`${process.env.NEXT_PUBLIC_APP_URL}/logo-black.png`}
              width="140"
              height="40"
              alt="Dishyy"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={section}>
            <Heading style={h1}>New Contact Message</Heading>
            <Text style={subheading}>
              You have received a new message through the contact form.
            </Text>

            {/* Sender Info */}
            <Section style={infoSection}>
              <Text style={label}>From</Text>
              <Text style={value}>{name}</Text>
              <Text style={emailText}>{email}</Text>
            </Section>

            {/* Category */}
            <Section style={infoSection}>
              <Text style={label}>Category</Text>
              <Text style={value}>{category}</Text>
            </Section>

            {/* Message */}
            <Section style={messageSection}>
              <Text style={label}>Message</Text>
              <Text style={messageText}>{message}</Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This email was sent from the contact form on{' '}
              <Link style={link} href={process.env.NEXT_PUBLIC_APP_URL}>
                Dishyy
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const logoSection = {
  padding: '24px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
  display: 'block',
  objectFit: 'contain' as const,
};

const section = {
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '8px',
  border: '1px solid #e6ebf1',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.5',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const subheading = {
  color: '#666666',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 24px',
  textAlign: 'center' as const,
};

const infoSection = {
  margin: '24px 0',
  padding: '16px',
  backgroundColor: '#f8fafc',
  borderRadius: '6px',
};

const messageSection = {
  margin: '24px 0',
  padding: '16px',
  backgroundColor: '#f8fafc',
  borderRadius: '6px',
};

const label = {
  color: '#666666',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  margin: '0 0 8px',
};

const value = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 4px',
};

const emailText = {
  color: '#666666',
  fontSize: '14px',
  margin: '0',
};

const messageText = {
  color: '#1a1a1a',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const footer = {
  textAlign: 'center' as const,
  padding: '24px 0 0',
};

const footerText = {
  color: '#666666',
  fontSize: '14px',
  margin: '0',
};

const link = {
  color: '#0070f3',
  textDecoration: 'none',
};

export default ContactFormEmail;
