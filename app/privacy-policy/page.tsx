import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">
            <strong>Last Updated:</strong> December 24, 2025
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="prose prose-gray max-w-none pt-6">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 mb-4">
                At EzLabTesting ("we," "our," or "us"), we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. We are committed to protecting your personal health information in compliance with HIPAA and other applicable privacy laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-700 mb-4">We may collect the following personal information:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Name, email address, phone number</li>
                <li>Date of birth, gender, address</li>
                <li>Payment information (credit card details, billing address)</li>
                <li>Government-issued ID for identity verification</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Health Information</h3>
              <p className="text-gray-700 mb-4">We collect Protected Health Information (PHI) including:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Lab test orders and results</li>
                <li>Medical history relevant to lab testing</li>
                <li>Prescription and medication information</li>
                <li>Any other health-related information you provide</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Information</h3>
              <p className="text-gray-700 mb-4">We automatically collect:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Browser type, device information, IP address</li>
                <li>Pages visited, time spent on pages, links clicked</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Process and fulfill your lab test orders</li>
                <li>Communicate with you about your orders and results</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Process payments and manage billing</li>
                <li>Provide customer support</li>
                <li>Improve our services and user experience</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Comply with legal obligations</li>
                <li>Analyze usage patterns and trends</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Providers</h3>
              <p className="text-gray-700 mb-4">
                We share information with trusted third-party service providers who assist us in operating our website and providing services, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>CLIA-certified laboratories that perform tests</li>
                <li>Payment processors</li>
                <li>Cloud hosting providers</li>
                <li>Email and communication services</li>
                <li>Analytics providers</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information when required by law, such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>To comply with court orders or legal processes</li>
                <li>To respond to government requests</li>
                <li>To protect our rights, property, or safety</li>
                <li>To prevent fraud or illegal activity</li>
                <li>In connection with public health reporting requirements</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Transfers</h3>
              <p className="text-gray-700 mb-4">
                If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Consent</h3>
              <p className="text-gray-700 mb-4">
                We will share your information with other parties only with your explicit written consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Encrypted storage of sensitive data</li>
                <li>Regular security audits and assessments</li>
                <li>Restricted access to personal information</li>
                <li>Employee training on privacy and security</li>
                <li>Secure data centers with physical security controls</li>
              </ul>
              <p className="text-gray-700 mb-4">
                While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li><strong>Access:</strong> Request copies of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your information (subject to legal obligations)</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Object:</strong> Object to processing of your information</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, contact us at{' '}
                <a href="mailto:privacy@ezlabtesting.com" className="text-blue-600 hover:underline">
                  privacy@ezlabtesting.com
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your experience. You can control cookies through your browser settings. However, disabling cookies may limit functionality.
              </p>
              <p className="text-gray-700 mb-4">Types of cookies we use:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your information for as long as necessary to provide services and comply with legal obligations. Lab test results are typically retained for at least 7 years in accordance with healthcare regulations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a prominent notice on our website. Your continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy or our privacy practices, contact us:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@ezlabtesting.com</p>
                <p className="text-gray-700 mb-2"><strong>Phone:</strong> 1-800-EZLABS (395-2277)</p>
                <p className="text-gray-700 mb-2"><strong>Mail:</strong> EzLabTesting Privacy Office<br />
                123 Healthcare Blvd, Suite 100<br />
                San Francisco, CA 94105</p>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Related Links */}
        <Card className="bg-gray-100">
          <CardHeader>
            <CardTitle>Related Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Link href="/terms-of-service" className="text-blue-600 hover:underline">
                → Terms of Service
              </Link>
              <Link href="/hipaa-notice" className="text-blue-600 hover:underline">
                → HIPAA Notice of Privacy Practices
              </Link>
              <Link href="/accessibility" className="text-blue-600 hover:underline">
                → Accessibility Statement
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
