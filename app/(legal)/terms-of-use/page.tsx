import Link from 'next/link';
import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(
  'Terms of Use',
  'Terms of Use for Dishyy - Your party planning companion'
);

export default function TermsOfUsePage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-8">
        <div className="space-y-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center"
          >
            ← Back to home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Terms of Use</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            Welcome to Dishyy. These Terms of Use govern your use of our website
            and services. By accessing or using Dishyy, you agree to be bound by
            these Terms. If you do not agree to these Terms, please do not use
            our service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Description of Service</h2>
          <p>
            Dishyy is a party planning platform that allows users to create and
            manage parties, dishes, and contributions. We provide tools for
            organizing and coordinating events with friends and family. Our
            service may change from time to time, and we reserve the right to
            modify, suspend, or discontinue any part of our service at any time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. User Accounts</h2>
          <p>
            To use certain features of our service, you may need to create an
            account. You are responsible for maintaining the confidentiality of
            your account information, including your password. You agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Provide accurate and complete information when creating your
              account
            </li>
            <li>Update your information to keep it accurate and current</li>
            <li>
              Be responsible for all activities that occur under your account
            </li>
            <li>
              Notify us immediately of any unauthorized use of your account
            </li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these Terms or for any other reason at our sole discretion.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. User Content</h2>
          <p>
            Our service allows you to create, upload, and share content such as
            party details, dishes, and comments. You retain ownership of your
            content, but by submitting content to our service, you grant us a
            worldwide, non-exclusive, royalty-free license to use, reproduce,
            modify, adapt, publish, and display such content in connection with
            providing and promoting our service.
          </p>
          <p>
            You are solely responsible for the content you submit. You agree not
            to submit content that is illegal, harmful, threatening, abusive,
            defamatory, or otherwise objectionable. We reserve the right to
            remove any content that violates these Terms or that we find
            objectionable for any reason.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Use our service for any illegal purpose or in violation of any
              laws
            </li>
            <li>Harass, abuse, or harm another person</li>
            <li>Impersonate any person or entity</li>
            <li>Interfere with or disrupt our service or servers</li>
            <li>
              Attempt to gain unauthorized access to our service or other users'
              accounts
            </li>
            <li>Use our service to collect or harvest users' information</li>
            <li>Upload viruses or other malicious code</li>
            <li>Use our service for commercial purposes without our consent</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
          <p>
            Our service and its original content, features, and functionality
            are owned by Dishyy and are protected by international copyright,
            trademark, patent, trade secret, and other intellectual property
            laws. You may not copy, modify, create derivative works, publicly
            display, publicly perform, republish, or distribute our content
            without our prior written consent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">7. Disclaimer of Warranties</h2>
          <p>
            Our service is provided "as is" and "as available" without any
            warranties of any kind, either express or implied. We do not
            guarantee that our service will be uninterrupted, timely, secure, or
            error-free. We do not warrant that the results that may be obtained
            from the use of the service will be accurate or reliable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we shall not be liable for
            any indirect, incidental, special, consequential, or punitive
            damages, including but not limited to loss of profits, data, use, or
            other intangible losses, resulting from your use of our service or
            any other claims related to our service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">9. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. The updated version will be
            indicated by an updated "Last Updated" date. It is your
            responsibility to check these Terms periodically for changes. Your
            continued use of our service following the posting of revised Terms
            means that you accept and agree to the changes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            <a
              href="mailto:support@dishyy.com"
              className="text-primary hover:underline"
            >
              support@dishyy.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
