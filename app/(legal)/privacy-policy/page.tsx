import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Dishyy',
  description: 'Privacy Policy for Dishyy - Your party planning companion',
};

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
            our service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Information We Collect</h2>
          <h3 className="text-lg font-medium">2.1 Personal Information</h3>
          <p>
            We may collect personal information that you provide directly to us,
            including but not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact information (email address, phone number)</li>
            <li>
              Account credentials (excluding passwords, which are handled
              securely)
            </li>
            <li>Profile information (including preferences and settings)</li>
            <li>
              Content you create, upload, or share through our service (such as
              party details and dishes)
            </li>
          </ul>

          <h3 className="text-lg font-medium">2.2 Usage Information</h3>
          <p>
            We may automatically collect certain information about how you
            access and use our service, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Device information (such as device type, operating system)</li>
            <li>
              Log information (such as IP address, browser type, pages visited)
            </li>
            <li>
              Usage patterns (such as features used, time spent on the service)
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            3. How We Use Your Information
          </h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process and complete transactions</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Develop new products and services</li>
            <li>
              Protect against, identify, and prevent fraud and other harmful
              activities
            </li>
            <li>Comply with our legal obligations</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Sharing of Information</h2>
          <p>We may share your information in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              With third-party service providers who perform services on our
              behalf
            </li>
            <li>
              With other users (as directed by you when using interactive
              features)
            </li>
            <li>To comply with applicable law, regulation, or legal process</li>
            <li>
              To protect the rights, property, or safety of Dishyy, our users,
              or others
            </li>
            <li>
              In connection with a business transaction, such as a merger or
              acquisition
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Data Security</h2>
          <p>
            We take reasonable measures to help protect your personal
            information from loss, theft, misuse, and unauthorized access,
            disclosure, alteration, and destruction. However, no system is
            completely secure, and we cannot guarantee the security of your
            information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Your Choices</h2>
          <p>
            You can access, update, or delete your account information by
            logging into your account and updating your profile. You may also
            contact us directly to request access to, correction of, or deletion
            of personal information we hold about you.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            7. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. The updated
            version will be indicated by an updated "Last Updated" date and the
            updated version will be effective as soon as it is accessible.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">8. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please
            contact us at:
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
