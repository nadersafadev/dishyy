import Link from 'next/link';
import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(
  'Terms of Use',
  'Terms of Use for Dishyy - Your party planning companion'
);

export default function TermsOfUsePage() {
  return (
    <div className="container max-w-4xl py-12 mx-auto">
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
          <h2 className="text-xl font-semibold">1. Agreement to Terms</h2>
          <p>
            Welcome to Dishyy. These Terms of Use constitute a legally binding
            agreement made between you and Dishyy ("we," "us," or "our"). By
            accessing or using our website and services, you agree to be bound
            by these Terms and our Privacy Policy. If you do not agree to these
            Terms, you must not access or use our service.
          </p>
          <p>
            We reserve the right to change these Terms at any time. We will
            notify you of any material changes by posting the new Terms on this
            page and updating the "Last updated" date. Your continued use of the
            Service after such changes constitutes your acceptance of the new
            Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Service Description</h2>
          <p>
            Dishyy is a party planning platform that helps users organize and
            coordinate food-related events. Our service includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Party planning and organization tools</li>
            <li>Guest list management</li>
            <li>Dish coordination and assignment</li>
            <li>Communication features between hosts and guests</li>
            <li>Recipe sharing and management</li>
          </ul>
          <p className="mt-4">
            We reserve the right to modify, suspend, or discontinue any part of
            our service at any time, with or without notice. We will not be
            liable if any part of the service becomes unavailable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            3. User Accounts and Registration
          </h2>
          <p>
            To access certain features, you must register for an account. When
            you register, you agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and update your information</li>
            <li>Keep your password secure and confidential</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized access</li>
          </ul>
          <p className="mt-4">
            We reserve the right to disable any account if we reasonably believe
            you have violated these Terms or if we determine the account has
            been inactive for an extended period.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. User Content and Conduct</h2>
          <p>
            Our service allows you to post, share, and store content. You retain
            ownership of your content, but grant us a worldwide, non-exclusive,
            royalty-free license to use, reproduce, modify, and distribute your
            content for the purpose of operating and improving our services.
          </p>
          <p className="mt-4">You agree not to post content that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Is false, misleading, or deceptive</li>
            <li>Infringes on intellectual property rights</li>
            <li>Contains harmful code or malware</li>
            <li>Violates any applicable law or regulation</li>
            <li>Is hateful, harassing, or discriminatory</li>
            <li>
              Contains personal or sensitive information about others without
              their consent
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            5. Privacy and Data Protection
          </h2>
          <p>
            Your privacy is important to us. Our Privacy Policy explains how we
            collect, use, and protect your personal information. By using our
            service, you agree to our Privacy Policy and consent to our data
            practices described therein.
          </p>
          <p className="mt-4">You acknowledge that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Your personal information will be processed as described in our
              Privacy Policy
            </li>
            <li>You have read and understand our Privacy Policy</li>
            <li>You have the right to withdraw consent at any time</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            6. Intellectual Property Rights
          </h2>
          <p>
            The Service and its original content (excluding user-generated
            content) are and will remain the exclusive property of Dishyy and
            its licensors. Our trademarks, service marks, logos, and trade names
            are not granted to you under any license or right to use them.
          </p>
          <p className="mt-4">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Copy, modify, or create derivative works of our service</li>
            <li>
              Decompile, reverse engineer, or attempt to extract our source code
            </li>
            <li>Remove any copyright or proprietary notices</li>
            <li>
              Use our intellectual property without express written permission
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            7. Third-Party Services and Links
          </h2>
          <p>
            Our service may contain links to third-party websites or services
            that are not owned or controlled by Dishyy. We have no control over,
            and assume no responsibility for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              The content, privacy policies, or practices of third-party sites
            </li>
            <li>
              Any damage or loss caused by third-party content or services
            </li>
            <li>Any transactions between you and third-party providers</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">8. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We provide the service "as is" without any warranty</li>
            <li>
              We are not liable for any indirect, incidental, special, or
              consequential damages
            </li>
            <li>
              As this is a free service, our total liability for any claims
              shall be limited to fixing or replacing the affected service
              feature
            </li>
            <li>We are not liable for any user-generated content or conduct</li>
            <li>
              We do not guarantee continuous, uninterrupted access to our
              services, and operation of our website may be interfered with by
              numerous factors outside of our control
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">9. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Dishyy and its
            officers, directors, employees, and agents from any claims, damages,
            losses, liabilities, costs, or expenses (including reasonable
            attorneys' fees) arising from:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your use of the service</li>
            <li>Your violation of these Terms</li>
            <li>Your user content</li>
            <li>Your interaction with other users</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">10. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the service
            immediately, without prior notice or liability, for any reason,
            including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violation of these Terms</li>
            <li>Conduct that risks harm to other users</li>
            <li>Fraudulent or illegal activities</li>
            <li>Extended periods of inactivity</li>
          </ul>
          <p className="mt-4">
            Upon termination, your right to use the service will immediately
            cease. All provisions of the Terms which by their nature should
            survive termination shall survive.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of Egypt, without regard to its conflict of law provisions.
          </p>
          <p className="mt-4">
            Any disputes arising from these Terms or your use of the service
            shall be subject to the exclusive jurisdiction of the courts of
            Egypt.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">12. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us:</p>
          <ul className="list-none space-y-2 mt-4">
            <li>
              Email:{' '}
              <a
                href="mailto:legal@dishyy.com"
                className="text-primary hover:underline"
              >
                legal@dishyy.com
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
