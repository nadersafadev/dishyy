import Link from 'next/link';
import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(
  'Privacy Policy',
  'Privacy Policy for Dishyy - Your party planning companion'
);

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p>
            Welcome to Dishyy ("we," "our," or "us"). We are committed to
            protecting your privacy and providing you with a safe experience
            when using our application. This Privacy Policy explains how we
            collect, use, and safeguard your information when you use our
            service.
          </p>
          <p>
            By accessing or using Dishyy, you agree to this Privacy Policy. If
            you do not agree with our policies and practices, please do not use
            our service. We encourage you to read this Privacy Policy carefully
            to understand our practices regarding your information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Information We Collect</h2>
          <h3 className="text-lg font-medium">2.1 Personal Information</h3>
          <p>
            We collect personal information that you provide directly to us when
            you:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create an account or update your profile</li>
            <li>Create or join a party event</li>
            <li>Submit a contact form or support request</li>
            <li>Subscribe to our newsletter</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          <p>This information may include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact information (email address, phone number)</li>
            <li>Profile information and preferences</li>
            <li>Party details and dietary preferences</li>
            <li>Communications with us</li>
            <li>User-generated content (recipes, comments, reviews)</li>
          </ul>

          <h3 className="text-lg font-medium mt-6">2.2 Usage Information</h3>
          <p>
            We automatically collect certain information about your device and
            how you interact with our service:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Device information (type, operating system, browser)</li>
            <li>IP address and location data</li>
            <li>Usage patterns and preferences</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h3 className="text-lg font-medium mt-6">2.3 Cookies and Tracking</h3>
          <p>
            We use cookies and similar tracking technologies to enhance your
            experience:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Essential cookies for site functionality</li>
            <li>Analytics cookies to understand usage</li>
            <li>Preference cookies to remember your settings</li>
          </ul>
          <p>
            You can control cookies through your browser settings. Disabling
            certain cookies may limit some features of our service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            3. How We Use Your Information
          </h2>
          <p>We use your information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Core Service Functionality:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Creating and managing your account</li>
                <li>Processing party planning features</li>
                <li>Facilitating communication between party participants</li>
                <li>Providing customer support</li>
              </ul>
            </li>
            <li>
              <strong>Service Improvement:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Analyzing usage patterns to improve features</li>
                <li>Debugging and fixing issues</li>
                <li>Developing new features</li>
              </ul>
            </li>
            <li>
              <strong>Communications:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Sending essential service updates</li>
                <li>Providing party reminders and notifications</li>
                <li>Sending marketing communications (with consent)</li>
                <li>Responding to your requests</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Your Privacy Rights</h2>
          <p>
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing</li>
            <li>Export your data in a portable format</li>
            <li>Withdraw consent for optional processing</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, contact us at{' '}
            <a
              href="mailto:privacy@dishyy.com"
              className="text-primary hover:underline"
            >
              privacy@dishyy.com
            </a>
            . We will respond to your request within 30 days.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            5. Data Sharing and Third Parties
          </h2>
          <p>We share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Service Providers:</strong> Companies that help us provide
              our services (hosting, email, analytics)
            </li>
            <li>
              <strong>Other Users:</strong> When you participate in parties or
              public features (limited to necessary information)
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to
              protect rights
            </li>
          </ul>
          <p className="mt-4">
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Employee training on data protection</li>
          </ul>
          <p className="mt-4">
            While we take reasonable steps to protect your data, no system is
            completely secure. We cannot guarantee the absolute security of your
            information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">7. Data Retention</h2>
          <p>
            We retain your information for as long as necessary to provide our
            services and comply with legal obligations. Specifically:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account information: While your account is active</li>
            <li>Party data: 90 days after party completion</li>
            <li>Communication records: 2 years</li>
            <li>Usage data: 1 year</li>
          </ul>
          <p className="mt-4">
            You can request deletion of your data at any time through your
            account settings or by contacting us.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">8. Marketing Communications</h2>
          <p>
            We may send you marketing communications about our services with
            your consent. These may include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Weekly newsletters with recipes and tips</li>
            <li>Party planning ideas and inspiration</li>
            <li>Product updates and new features</li>
            <li>Special offers and promotions</li>
          </ul>
          <p className="mt-4">
            You can opt out of marketing communications at any time:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Click the unsubscribe link in any email</li>
            <li>Update your preferences in account settings</li>
            <li>Contact us directly</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">9. Children's Privacy</h2>
          <p>
            Our service is not directed to children under 13. We do not
            knowingly collect personal information from children under 13. If
            you believe we have collected information from a child under 13,
            please contact us immediately.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            10. International Data Transfers
          </h2>
          <p>
            Our services are operated from Egypt. We may transfer your
            information to countries other than where you live, particularly for
            cloud hosting and other technical infrastructure. When we do, we
            ensure appropriate safeguards are in place to protect your data and
            comply with applicable data protection laws. By using our service,
            you consent to your information being collected, processed, and
            stored in Egypt and other countries as needed to provide you with
            our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any material changes by:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Posting the new policy on our website</li>
            <li>Sending an email to registered users</li>
            <li>Displaying a notice in our application</li>
          </ul>
          <p className="mt-4">
            Your continued use of our service after changes indicates your
            acceptance of the updated policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">12. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our privacy
            practices, please contact us:
          </p>
          <ul className="list-none space-y-2 mt-4">
            <li>
              Email:{' '}
              <a
                href="mailto:privacy@dishyy.com"
                className="text-primary hover:underline"
              >
                privacy@dishyy.com
              </a>
            </li>
            <li>
              Data Protection Officer:{' '}
              <a
                href="mailto:dpo@dishyy.com"
                className="text-primary hover:underline"
              >
                dpo@dishyy.com
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
