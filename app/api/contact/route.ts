import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import ContactFormEmail from '@/emails/contact-form-email';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Get the form data
    const { name, email, category, message } = await request.json();

    // Validate the data
    if (!name || !email || !category || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send the email
    const data = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Update this with your verified domain
      to: ['nader.safa.dev@gmail.com'], // Update this with your email
      subject: `New Contact Form Submission from ${name}`,
      react: ContactFormEmail({
        name,
        email,
        category,
        message,
      }),
      replyTo: email,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
