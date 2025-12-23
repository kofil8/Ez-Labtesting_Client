import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Eye, FileText, Lock, Shield, UserCheck } from "lucide-react";
import Link from "next/link";

export default function HIPAANoticePage() {
  const yourRights = [
    {
      icon: Eye,
      title: "Right to Access",
      description:
        "You have the right to view and obtain copies of your health information.",
    },
    {
      icon: FileText,
      title: "Right to Amend",
      description:
        "You can request corrections to your health information if you believe it is incorrect or incomplete.",
    },
    {
      icon: Bell,
      title: "Right to an Accounting",
      description:
        "You can request a list of disclosures we have made of your health information.",
    },
    {
      icon: Lock,
      title: "Right to Request Restrictions",
      description:
        "You can ask us to limit how we use or share your health information.",
    },
    {
      icon: UserCheck,
      title: "Right to Confidential Communications",
      description:
        "You can request that we communicate with you in a specific way or at a certain location.",
    },
    {
      icon: Shield,
      title: "Right to Notification",
      description:
        "You have the right to be notified of any breach of your health information.",
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='container mx-auto px-4 max-w-4xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            HIPAA Notice of Privacy Practices
          </h1>
          <p className='text-gray-600'>
            <strong>Effective Date:</strong> December 24, 2025
          </p>
        </div>

        {/* Important Notice */}
        <Alert className='mb-8 border-blue-200 bg-blue-50'>
          <Shield className='h-4 w-4 text-blue-600' />
          <AlertDescription className='text-gray-700'>
            <strong>Your Health Information Rights:</strong> This notice
            describes how medical information about you may be used and
            disclosed and how you can access this information. Please review it
            carefully.
          </AlertDescription>
        </Alert>

        <Card className='mb-6'>
          <CardContent className='prose prose-gray max-w-none pt-6'>
            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Our Commitment to Your Privacy
              </h2>
              <p className='text-gray-700 mb-4'>
                EzLabTesting is committed to protecting the privacy of your
                health information. This Notice of Privacy Practices describes
                how we may use and disclose your Protected Health Information
                (PHI) to carry out treatment, payment, or healthcare operations,
                and for other purposes permitted or required by law.
              </p>
              <p className='text-gray-700 mb-4'>We are required by law to:</p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Maintain the privacy and security of your PHI</li>
                <li>
                  Provide you with this notice of our legal duties and privacy
                  practices
                </li>
                <li>Follow the terms of the notice currently in effect</li>
                <li>
                  Notify you if we are unable to agree to a requested
                  restriction
                </li>
                <li>
                  Notify you in the event of a breach of your unsecured PHI
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                What is Protected Health Information (PHI)?
              </h2>
              <p className='text-gray-700 mb-4'>
                PHI is information about you, including demographic information,
                that may identify you and relates to:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>
                  Your past, present, or future physical or mental health
                  condition
                </li>
                <li>The provision of healthcare to you</li>
                <li>Payment for the provision of healthcare to you</li>
              </ul>
              <p className='text-gray-700 mb-4'>
                Examples include your lab test orders, results, medical history,
                and payment information.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                How We May Use and Disclose Your Health Information
              </h2>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                For Treatment
              </h3>
              <p className='text-gray-700 mb-4'>
                We may use and disclose your PHI to provide, coordinate, or
                manage your healthcare and related services. This includes:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>
                  Coordinating with CLIA-certified laboratories to perform your
                  tests
                </li>
                <li>Having physicians review and approve your test orders</li>
                <li>
                  Providing test results to you and, with your permission, to
                  your healthcare providers
                </li>
              </ul>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                For Payment
              </h3>
              <p className='text-gray-700 mb-4'>
                We may use and disclose your PHI to bill for services and
                collect payment, including:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Processing credit card payments</li>
                <li>Verifying HSA/FSA eligibility</li>
                <li>Collecting outstanding balances</li>
                <li>Responding to payment disputes or chargebacks</li>
              </ul>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                For Healthcare Operations
              </h3>
              <p className='text-gray-700 mb-4'>
                We may use and disclose your PHI for healthcare operations, such
                as:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Quality assessment and improvement activities</li>
                <li>
                  Reviewing the competence or qualifications of healthcare
                  professionals
                </li>
                <li>
                  Conducting or arranging for medical review, legal services,
                  and auditing functions
                </li>
                <li>Business planning and development</li>
                <li>Training programs</li>
              </ul>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Business Associates
              </h3>
              <p className='text-gray-700 mb-4'>
                We may disclose your PHI to business associates who perform
                services on our behalf (such as laboratories, payment
                processors, and IT service providers). We require them to
                appropriately safeguard your information through written
                contracts.
              </p>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                As Required by Law
              </h3>
              <p className='text-gray-700 mb-4'>
                We may use or disclose your PHI when required to do so by
                federal, state, or local law, including:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Public health activities (e.g., disease reporting)</li>
                <li>
                  Health oversight activities (e.g., audits, investigations)
                </li>
                <li>Judicial and administrative proceedings</li>
                <li>Law enforcement purposes</li>
                <li>Preventing serious threats to health or safety</li>
                <li>Workers' compensation claims</li>
                <li>Coroners, medical examiners, and funeral directors</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Uses and Disclosures Requiring Your Authorization
              </h2>
              <p className='text-gray-700 mb-4'>
                Other uses and disclosures of your PHI not covered by this
                notice or applicable laws will be made only with your written
                authorization. You may revoke such authorization in writing at
                any time, except to the extent that we have already acted in
                reliance on your authorization.
              </p>
              <p className='text-gray-700 mb-4'>
                Specifically, we will obtain your authorization before using or
                disclosing your PHI for:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Marketing purposes</li>
                <li>Sale of PHI</li>
                <li>
                  Most uses and disclosures of psychotherapy notes (if
                  applicable)
                </li>
              </ul>
            </section>
          </CardContent>
        </Card>

        {/* Your Rights Section */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-gray-900 mb-6'>
            Your Rights Regarding Your Health Information
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {yourRights.map((right) => (
              <Card
                key={right.title}
                className='hover:shadow-lg transition-shadow'
              >
                <CardHeader>
                  <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <right.icon className='h-6 w-6 text-blue-600' />
                    </div>
                    <div>
                      <CardTitle className='text-lg mb-2'>
                        {right.title}
                      </CardTitle>
                      <p className='text-sm text-gray-600'>
                        {right.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <Card className='mb-6'>
          <CardContent className='prose prose-gray max-w-none pt-6'>
            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                How to Exercise Your Rights
              </h2>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Right to Inspect and Copy
              </h3>
              <p className='text-gray-700 mb-4'>
                You have the right to inspect and obtain a copy of your PHI. To
                request copies of your information, submit a written request to
                our Privacy Officer. We may charge a reasonable fee for copying
                and mailing costs.
              </p>
              <p className='text-gray-700 mb-4'>
                We may deny your request in certain limited circumstances. If we
                deny your request, we will provide you with a written
                explanation and information about your right to have the denial
                reviewed.
              </p>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Right to Amend
              </h3>
              <p className='text-gray-700 mb-4'>
                If you believe that information in your health record is
                incorrect or incomplete, you may request an amendment. Your
                request must be in writing and provide a reason for the
                amendment.
              </p>
              <p className='text-gray-700 mb-4'>
                We may deny your request if the information:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Was not created by us</li>
                <li>Is not part of the records kept by us</li>
                <li>Is not available for inspection</li>
                <li>Is accurate and complete</li>
              </ul>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Right to an Accounting of Disclosures
              </h3>
              <p className='text-gray-700 mb-4'>
                You have the right to request an "accounting of disclosures,"
                which is a list of certain disclosures we have made of your PHI.
                The first accounting in any 12-month period is free; we may
                charge a reasonable fee for additional requests.
              </p>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Right to Request Restrictions
              </h3>
              <p className='text-gray-700 mb-4'>
                You have the right to request restrictions on how we use or
                disclose your PHI. We are not required to agree to your request,
                but if we do, we will comply with your request unless the
                information is needed for emergency treatment.
              </p>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Right to Request Confidential Communications
              </h3>
              <p className='text-gray-700 mb-4'>
                You have the right to request that we communicate with you about
                your health information in a certain way or at a certain
                location. For example, you may ask that we contact you only at
                work or by mail. We will accommodate reasonable requests.
              </p>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Right to a Paper Copy of This Notice
              </h3>
              <p className='text-gray-700 mb-4'>
                You have the right to receive a paper copy of this notice, even
                if you have agreed to receive it electronically. You may request
                a copy at any time.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Changes to This Notice
              </h2>
              <p className='text-gray-700 mb-4'>
                We reserve the right to change this notice and make the new
                notice apply to health information we already have as well as
                any information we receive in the future. We will post a copy of
                the current notice on our website with the effective date.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Complaints
              </h2>
              <p className='text-gray-700 mb-4'>
                If you believe your privacy rights have been violated, you may
                file a complaint with us or with the Secretary of the Department
                of Health and Human Services. You will not be penalized or
                retaliated against for filing a complaint.
              </p>
              <p className='text-gray-700 mb-4'>
                To file a complaint with us, contact:
              </p>
              <div className='bg-gray-100 p-4 rounded-lg'>
                <p className='text-gray-700 mb-2'>
                  <strong>Privacy Officer</strong>
                </p>
                <p className='text-gray-700 mb-2'>
                  <strong>Email:</strong> privacy@ezlabtesting.com
                </p>
                <p className='text-gray-700 mb-2'>
                  <strong>Phone:</strong> 1-800-EZLABS (395-2277)
                </p>
                <p className='text-gray-700 mb-2'>
                  <strong>Mail:</strong> EzLabTesting Privacy Officer
                  <br />
                  123 Healthcare Blvd, Suite 100
                  <br />
                  San Francisco, CA 94105
                </p>
              </div>
              <p className='text-gray-700 mt-4'>
                To file a complaint with the Department of Health and Human
                Services:
              </p>
              <div className='bg-gray-100 p-4 rounded-lg mt-2'>
                <p className='text-gray-700 mb-2'>Office for Civil Rights</p>
                <p className='text-gray-700 mb-2'>
                  U.S. Department of Health and Human Services
                </p>
                <p className='text-gray-700 mb-2'>
                  200 Independence Avenue, S.W.
                </p>
                <p className='text-gray-700 mb-2'>Washington, D.C. 20201</p>
                <p className='text-gray-700'>
                  Phone: 1-877-696-6775 | Website:{" "}
                  <a
                    href='https://www.hhs.gov/ocr/privacy'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    www.hhs.gov/ocr/privacy
                  </a>
                </p>
              </div>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Contact Information
              </h2>
              <p className='text-gray-700 mb-4'>
                For questions about this notice or to exercise your rights,
                contact our Privacy Officer using the information above.
              </p>
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
                href='/terms-of-service'
                className='text-blue-600 hover:underline'
              >
                → Terms of Service
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
