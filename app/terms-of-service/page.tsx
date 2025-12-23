import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='container mx-auto px-4 max-w-4xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Terms of Service
          </h1>
          <p className='text-gray-600'>
            <strong>Last Updated:</strong> December 24, 2025
          </p>
        </div>

        <Card className='mb-6'>
          <CardContent className='prose prose-gray max-w-none pt-6'>
            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                1. Acceptance of Terms
              </h2>
              <p className='text-gray-700 mb-4'>
                Welcome to EzLabTesting. By accessing or using our website and
                services, you agree to be bound by these Terms of Service
                ("Terms"). If you do not agree to these Terms, please do not use
                our services.
              </p>
              <p className='text-gray-700 mb-4'>
                These Terms constitute a legally binding agreement between you
                and EzLabTesting, Inc. ("Company," "we," "us," or "our"). We
                reserve the right to modify these Terms at any time, and such
                modifications will be effective immediately upon posting.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                2. Description of Services
              </h2>
              <p className='text-gray-700 mb-4'>
                EzLabTesting provides an online platform for ordering laboratory
                testing services. Our services include:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>
                  Online ordering of lab tests without requiring a physician's
                  prescription
                </li>
                <li>Physician review and approval of test orders</li>
                <li>Generation of lab requisition forms</li>
                <li>Coordination with CLIA-certified laboratory partners</li>
                <li>Secure delivery of test results</li>
                <li>Access to lab center locations</li>
              </ul>
              <p className='text-gray-700 mb-4'>
                We are not a healthcare provider and do not provide medical
                advice, diagnosis, or treatment. Our services are for
                informational purposes only.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                3. Eligibility
              </h2>
              <p className='text-gray-700 mb-4'>
                To use our services, you must:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Be at least 18 years of age</li>
                <li>
                  Have the legal capacity to enter into a binding agreement
                </li>
                <li>Reside in a state where our services are available</li>
                <li>Provide accurate and complete information</li>
                <li>
                  Not be prohibited from using our services under applicable
                  laws
                </li>
              </ul>
              <p className='text-gray-700 mb-4'>
                Tests for minors may be ordered by a parent or legal guardian
                who accepts full responsibility for the test and results.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                4. Account Registration
              </h2>
              <p className='text-gray-700 mb-4'>
                To place orders, you must create an account. You agree to:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
              </ul>
              <p className='text-gray-700 mb-4'>
                We reserve the right to suspend or terminate accounts that
                violate these Terms or engage in fraudulent activity.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                5. Ordering and Payment
              </h2>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                5.1 Order Process
              </h3>
              <p className='text-gray-700 mb-4'>When you place an order:</p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>
                  You submit a request for services that requires our acceptance
                </li>
                <li>We review your order and may accept or reject it</li>
                <li>
                  A licensed physician reviews and approves your test order
                </li>
                <li>
                  Upon approval, you receive a lab requisition form via email
                </li>
                <li>You visit a lab center to have your sample collected</li>
              </ul>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                5.2 Pricing and Payment
              </h3>
              <p className='text-gray-700 mb-4'>
                All prices are in U.S. dollars and are subject to change without
                notice. You agree to pay all charges associated with your order,
                including:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Test fees as displayed at checkout</li>
                <li>Any applicable taxes</li>
                <li>Payment processing fees (if applicable)</li>
              </ul>
              <p className='text-gray-700 mb-4'>
                Payment is due at the time of order. We accept major credit
                cards, debit cards, and HSA/FSA cards. We do not accept
                insurance at this time.
              </p>

              <h3
                className='text-xl font-semibold text-gray-900 mb-3'
                id='refunds'
              >
                5.3 Refunds and Cancellations
              </h3>
              <p className='text-gray-700 mb-4'>
                <strong>Before Lab Visit:</strong> Orders may be cancelled for a
                full refund before your lab visit. Contact us at{" "}
                <a
                  href='mailto:support@ezlabtesting.com'
                  className='text-blue-600 hover:underline'
                >
                  support@ezlabtesting.com
                </a>
              </p>
              <p className='text-gray-700 mb-4'>
                <strong>After Lab Visit:</strong> Once your sample has been
                collected, orders cannot be cancelled or refunded as the
                laboratory has incurred costs to process your test.
              </p>
              <p className='text-gray-700 mb-4'>
                <strong>Order Rejection:</strong> If we reject your order or a
                physician determines a test is not appropriate, you will receive
                a full refund.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                6. Lab Testing Process
              </h2>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                6.1 Lab Visits
              </h3>
              <p className='text-gray-700 mb-4'>You are responsible for:</p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Visiting a lab center to have your sample collected</li>
                <li>Bringing your requisition form and valid photo ID</li>
                <li>Following test preparation instructions</li>
                <li>Complying with lab center policies and procedures</li>
              </ul>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                6.2 Results
              </h3>
              <p className='text-gray-700 mb-4'>
                Test results are typically available within 1-3 business days.
                Results are delivered securely through your account. You are
                responsible for:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Regularly checking your account for results</li>
                <li>Reviewing and understanding your results</li>
                <li>
                  Consulting with a healthcare provider about your results
                </li>
                <li>Taking appropriate action based on your results</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                7. Medical Disclaimer
              </h2>
              <p className='text-gray-700 mb-4'>
                <strong>IMPORTANT:</strong> EzLabTesting is not a substitute for
                professional medical advice, diagnosis, or treatment.
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>
                  We do not provide medical advice or treatment recommendations
                </li>
                <li>
                  Test results should be reviewed with a qualified healthcare
                  provider
                </li>
                <li>
                  Always seek the advice of your physician with any questions
                  about a medical condition
                </li>
                <li>
                  Never disregard professional medical advice or delay seeking
                  it because of information obtained through our services
                </li>
                <li>
                  If you think you have a medical emergency, call 911
                  immediately
                </li>
              </ul>
              <p className='text-gray-700 mb-4'>
                Our physician review service is solely to approve test orders,
                not to provide medical care or advice.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                8. User Responsibilities and Prohibited Conduct
              </h2>
              <p className='text-gray-700 mb-4'>You agree not to:</p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Provide false or misleading information</li>
                <li>Use our services for any illegal purpose</li>
                <li>Share your account credentials with others</li>
                <li>
                  Order tests on behalf of another person without authorization
                </li>
                <li>Attempt to circumvent security measures</li>
                <li>Interfere with the proper functioning of our services</li>
                <li>
                  Copy, modify, or distribute our content without permission
                </li>
                <li>
                  Use automated systems (bots, scrapers) to access our services
                </li>
                <li>Harass, abuse, or harm others</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                9. Intellectual Property
              </h2>
              <p className='text-gray-700 mb-4'>
                All content on our website, including text, graphics, logos,
                images, software, and other materials, is the property of
                EzLabTesting or its licensors and is protected by copyright,
                trademark, and other intellectual property laws.
              </p>
              <p className='text-gray-700 mb-4'>
                You may not reproduce, distribute, modify, create derivative
                works, publicly display, or exploit any content without our
                express written permission.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                10. Privacy and Data Security
              </h2>
              <p className='text-gray-700 mb-4'>
                Your privacy is important to us. Please review our{" "}
                <Link
                  href='/privacy-policy'
                  className='text-blue-600 hover:underline'
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href='/hipaa-notice'
                  className='text-blue-600 hover:underline'
                >
                  HIPAA Notice of Privacy Practices
                </Link>{" "}
                to understand how we collect, use, and protect your information.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                11. Limitation of Liability
              </h2>
              <p className='text-gray-700 mb-4'>
                TO THE FULLEST EXTENT PERMITTED BY LAW, EZLABTESTING SHALL NOT
                BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
                INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE,
                GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
              <p className='text-gray-700 mb-4'>
                Our total liability to you for any claims arising from or
                related to our services shall not exceed the amount you paid us
                in the twelve months preceding the claim.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                12. Disclaimer of Warranties
              </h2>
              <p className='text-gray-700 mb-4'>
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT
                NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
                FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p className='text-gray-700 mb-4'>
                We do not warrant that our services will be uninterrupted,
                error-free, or secure. We do not warrant the accuracy,
                completeness, or reliability of any content or test results.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                13. Indemnification
              </h2>
              <p className='text-gray-700 mb-4'>
                You agree to indemnify, defend, and hold harmless EzLabTesting,
                its affiliates, officers, directors, employees, agents, and
                licensors from any claims, liabilities, damages, losses, costs,
                or expenses (including attorney's fees) arising from:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Your use of our services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Any information you provide</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                14. Dispute Resolution and Arbitration
              </h2>
              <p className='text-gray-700 mb-4'>
                Any dispute arising from these Terms or our services shall be
                resolved through binding arbitration in accordance with the
                American Arbitration Association rules. You waive your right to
                a jury trial and to participate in class action lawsuits.
              </p>
              <p className='text-gray-700 mb-4'>
                This agreement is governed by the laws of the State of
                California, without regard to conflict of law principles.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                15. Termination
              </h2>
              <p className='text-gray-700 mb-4'>
                We may terminate or suspend your account and access to our
                services at any time, with or without cause or notice, including
                if you violate these Terms.
              </p>
              <p className='text-gray-700 mb-4'>
                Upon termination, your right to use our services will cease
                immediately. Sections of these Terms that by their nature should
                survive termination shall survive, including ownership
                provisions, warranty disclaimers, and limitations of liability.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                16. Changes to Services
              </h2>
              <p className='text-gray-700 mb-4'>
                We reserve the right to modify, suspend, or discontinue any
                aspect of our services at any time without notice or liability.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                17. Severability
              </h2>
              <p className='text-gray-700 mb-4'>
                If any provision of these Terms is found to be invalid or
                unenforceable, the remaining provisions will remain in full
                force and effect.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                18. Entire Agreement
              </h2>
              <p className='text-gray-700 mb-4'>
                These Terms, together with our Privacy Policy and any other
                legal notices published by us, constitute the entire agreement
                between you and EzLabTesting regarding our services.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                19. Contact Information
              </h2>
              <p className='text-gray-700 mb-4'>
                For questions about these Terms, contact us:
              </p>
              <div className='bg-gray-100 p-4 rounded-lg'>
                <p className='text-gray-700 mb-2'>
                  <strong>Email:</strong> legal@ezlabtesting.com
                </p>
                <p className='text-gray-700 mb-2'>
                  <strong>Phone:</strong> 1-800-EZLABS (395-2277)
                </p>
                <p className='text-gray-700 mb-2'>
                  <strong>Mail:</strong> EzLabTesting Legal Department
                  <br />
                  123 Healthcare Blvd, Suite 100
                  <br />
                  San Francisco, CA 94105
                </p>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Related Links */}
        <Card className='bg-gray-100'>
          <CardHeader>
            <CardTitle>Related Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-2'>
              <Link
                href='/privacy-policy'
                className='text-blue-600 hover:underline'
              >
                → Privacy Policy
              </Link>
              <Link
                href='/hipaa-notice'
                className='text-blue-600 hover:underline'
              >
                → HIPAA Notice of Privacy Practices
              </Link>
              <Link
                href='/accessibility'
                className='text-blue-600 hover:underline'
              >
                → Accessibility Statement
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
