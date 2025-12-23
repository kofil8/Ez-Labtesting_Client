import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Heart,
  Monitor,
  Keyboard,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

export default function AccessibilityPage() {
  const accessibilityFeatures = [
    {
      icon: Monitor,
      title: "Screen Reader Compatibility",
      description:
        "Our website is designed to work with popular screen readers like JAWS, NVDA, and VoiceOver.",
    },
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description:
        "All website functionality is accessible using only a keyboard, without requiring a mouse.",
    },
    {
      icon: Heart,
      title: "Color Contrast",
      description:
        "We maintain high color contrast ratios to ensure readability for users with visual impairments.",
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='container mx-auto px-4 max-w-4xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Accessibility Statement
          </h1>
          <p className='text-gray-600'>
            <strong>Last Updated:</strong> December 24, 2025
          </p>
        </div>

        {/* Commitment Banner */}
        <Alert className='mb-8 border-blue-200 bg-blue-50'>
          <Heart className='h-4 w-4 text-blue-600' />
          <AlertDescription className='text-gray-700'>
            <strong>Our Commitment:</strong> EzLabTesting is committed to
            ensuring digital accessibility for people with disabilities. We are
            continually improving the user experience for everyone and applying
            the relevant accessibility standards.
          </AlertDescription>
        </Alert>

        <Card className='mb-6'>
          <CardContent className='prose prose-gray max-w-none pt-6'>
            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Our Commitment to Accessibility
              </h2>
              <p className='text-gray-700 mb-4'>
                At EzLabTesting, we believe that healthcare services should be
                accessible to everyone, including individuals with disabilities.
                We are committed to providing a website that is accessible to
                the widest possible audience, regardless of technology or
                ability.
              </p>
              <p className='text-gray-700 mb-4'>
                We strive to adhere to the Web Content Accessibility Guidelines
                (WCAG) 2.1 Level AA standards, issued by the World Wide Web
                Consortium (W3C). These guidelines explain how to make web
                content more accessible for people with disabilities and more
                user-friendly for everyone.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Accessibility Standards
              </h2>
              <p className='text-gray-700 mb-4'>
                Our website is designed to conform to the following standards:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>
                  Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
                </li>
                <li>Section 508 of the Rehabilitation Act</li>
                <li>Americans with Disabilities Act (ADA) Title III</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Accessibility Features
              </h2>
              <p className='text-gray-700 mb-4'>
                We have implemented numerous features to make our website
                accessible:
              </p>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Navigation and Interface
              </h3>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Clear and consistent navigation structure</li>
                <li>Descriptive page titles and headings</li>
                <li>Skip navigation links to bypass repetitive content</li>
                <li>Keyboard-accessible dropdown menus and forms</li>
                <li>Focus indicators for keyboard navigation</li>
                <li>Logical tab order throughout the site</li>
              </ul>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Visual Design
              </h3>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>
                  High contrast color schemes (minimum 4.5:1 ratio for normal
                  text)
                </li>
                <li>
                  Text can be resized up to 200% without loss of functionality
                </li>
                <li>No reliance on color alone to convey information</li>
                <li>Readable fonts and appropriate text spacing</li>
                <li>
                  Responsive design that works on various devices and screen
                  sizes
                </li>
              </ul>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Content
              </h3>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Descriptive alternative text (alt text) for images</li>
                <li>Captions and transcripts for audio and video content</li>
                <li>Clear and simple language</li>
                <li>Descriptive link text (avoiding "click here")</li>
                <li>
                  Form labels and error messages that are clear and specific
                </li>
              </ul>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Technical
              </h3>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Semantic HTML5 markup</li>
                <li>
                  ARIA (Accessible Rich Internet Applications) landmarks and
                  labels
                </li>
                <li>
                  Compatible with assistive technologies like screen readers
                </li>
                <li>No time limits on reading or interacting with content</li>
                <li>
                  No content that flashes more than three times per second
                </li>
              </ul>
            </section>
          </CardContent>
        </Card>

        {/* Accessibility Features Cards */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-gray-900 mb-6'>
            Key Accessibility Features
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {accessibilityFeatures.map((feature) => (
              <Card
                key={feature.title}
                className='hover:shadow-lg transition-shadow'
              >
                <CardHeader>
                  <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                    <feature.icon className='h-6 w-6 text-blue-600' />
                  </div>
                  <CardTitle className='text-lg'>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-gray-600'>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className='mb-6'>
          <CardContent className='prose prose-gray max-w-none pt-6'>
            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Assistive Technologies
              </h2>
              <p className='text-gray-700 mb-4'>
                Our website is compatible with the following assistive
                technologies:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>
                  <strong>Screen Readers:</strong> JAWS, NVDA, VoiceOver
                  (macOS/iOS), TalkBack (Android)
                </li>
                <li>
                  <strong>Browser Extensions:</strong> Read&Write, ReadSpeaker,
                  Natural Reader
                </li>
                <li>
                  <strong>Screen Magnification:</strong> ZoomText, Windows
                  Magnifier, macOS Zoom
                </li>
                <li>
                  <strong>Speech Recognition:</strong> Dragon NaturallySpeaking,
                  Windows Speech Recognition
                </li>
                <li>
                  <strong>Alternative Input Devices:</strong> Switch devices,
                  eye-tracking systems, mouth sticks
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Browser Compatibility
              </h2>
              <p className='text-gray-700 mb-4'>
                For the best accessibility experience, we recommend using the
                latest versions of:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Google Chrome</li>
                <li>Mozilla Firefox</li>
                <li>Safari (macOS and iOS)</li>
                <li>Microsoft Edge</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Keyboard Navigation
              </h2>
              <p className='text-gray-700 mb-4'>
                You can navigate our website using the following keyboard
                shortcuts:
              </p>
              <div className='bg-gray-100 p-4 rounded-lg mb-4'>
                <ul className='space-y-2 text-gray-700'>
                  <li>
                    <strong>Tab:</strong> Move forward through interactive
                    elements
                  </li>
                  <li>
                    <strong>Shift + Tab:</strong> Move backward through
                    interactive elements
                  </li>
                  <li>
                    <strong>Enter or Space:</strong> Activate links and buttons
                  </li>
                  <li>
                    <strong>Arrow Keys:</strong> Navigate within menus and
                    dropdowns
                  </li>
                  <li>
                    <strong>Esc:</strong> Close modal dialogs and menus
                  </li>
                </ul>
              </div>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Third-Party Content
              </h2>
              <p className='text-gray-700 mb-4'>
                While we strive to ensure that all content on our website is
                accessible, some third-party content (such as embedded videos or
                payment processors) may not be fully under our control. We work
                with our partners to ensure they also meet accessibility
                standards.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Ongoing Efforts
              </h2>
              <p className='text-gray-700 mb-4'>
                Accessibility is an ongoing effort. We continuously work to
                improve the accessibility of our website through:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Regular accessibility audits and testing</li>
                <li>
                  User testing with individuals who use assistive technologies
                </li>
                <li>Training our team on accessibility best practices</li>
                <li>
                  Incorporating accessibility into our development process
                </li>
                <li>
                  Staying current with evolving accessibility standards and
                  guidelines
                </li>
                <li>Addressing reported accessibility issues promptly</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Known Limitations
              </h2>
              <p className='text-gray-700 mb-4'>
                Despite our best efforts, some areas of our website may not yet
                be fully accessible. We are aware of the following limitations
                and are working to address them:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>Some older PDF documents may not be fully accessible</li>
                <li>
                  Certain complex data visualizations may have limited
                  accessibility
                </li>
                <li>
                  Some third-party embedded content may not meet accessibility
                  standards
                </li>
              </ul>
              <p className='text-gray-700 mb-4'>
                If you encounter any accessibility barriers, please contact us
                so we can provide alternative access or resolve the issue.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Alternative Access Methods
              </h2>
              <p className='text-gray-700 mb-4'>
                If you have difficulty accessing any content on our website, we
                offer the following alternatives:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-gray-700 mb-4'>
                <li>
                  Phone support to place orders or access information:
                  1-800-EZLABS (395-2277)
                </li>
                <li>Email support: accessibility@ezlabtesting.com</li>
                <li>
                  Alternative formats for documents (large print, audio, etc.)
                </li>
                <li>Assistance from our customer service team</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Feedback and Contact
              </h2>
              <p className='text-gray-700 mb-4'>
                We welcome your feedback on the accessibility of our website. If
                you encounter accessibility barriers or have suggestions for
                improvement, please contact us:
              </p>
            </section>
          </CardContent>
        </Card>

        {/* Contact Methods */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <Card className='hover:shadow-lg transition-shadow'>
            <CardHeader>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                <Mail className='h-6 w-6 text-blue-600' />
              </div>
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href='mailto:accessibility@ezlabtesting.com'
                className='text-blue-600 hover:underline'
              >
                accessibility@ezlabtesting.com
              </a>
              <p className='text-sm text-gray-500 mt-2'>
                Response within 48 hours
              </p>
            </CardContent>
          </Card>

          <Card className='hover:shadow-lg transition-shadow'>
            <CardHeader>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4'>
                <Phone className='h-6 w-6 text-green-600' />
              </div>
              <CardTitle>Phone</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href='tel:1-800-EZLABS'
                className='text-blue-600 hover:underline'
              >
                1-800-EZLABS (395-2277)
              </a>
              <p className='text-sm text-gray-500 mt-2'>Mon-Fri: 8am-8pm EST</p>
            </CardContent>
          </Card>

          <Card className='hover:shadow-lg transition-shadow'>
            <CardHeader>
              <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
                <MessageCircle className='h-6 w-6 text-purple-600' />
              </div>
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <button className='text-blue-600 hover:underline'>
                Start Chat
              </button>
              <p className='text-sm text-gray-500 mt-2'>
                Available during business hours
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className='mb-6'>
          <CardContent className='prose prose-gray max-w-none pt-6'>
            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Formal Complaints
              </h2>
              <p className='text-gray-700 mb-4'>
                If you are not satisfied with our response to your accessibility
                concerns, you may file a formal complaint with:
              </p>
              <div className='bg-gray-100 p-4 rounded-lg'>
                <p className='text-gray-700 mb-2'>
                  <strong>U.S. Department of Health and Human Services</strong>
                </p>
                <p className='text-gray-700 mb-2'>Office for Civil Rights</p>
                <p className='text-gray-700 mb-2'>
                  200 Independence Avenue, S.W.
                </p>
                <p className='text-gray-700 mb-2'>Washington, D.C. 20201</p>
                <p className='text-gray-700 mb-2'>Phone: 1-800-368-1019</p>
                <p className='text-gray-700'>
                  Website:{" "}
                  <a
                    href='https://www.hhs.gov/ocr'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    www.hhs.gov/ocr
                  </a>
                </p>
              </div>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Updates to This Statement
              </h2>
              <p className='text-gray-700 mb-4'>
                We may update this Accessibility Statement from time to time to
                reflect changes to our website or accessibility practices.
                Please check this page periodically for updates.
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
                href='/hipaa-notice'
                className='text-blue-600 hover:underline'
              >
                → HIPAA Notice of Privacy Practices
              </Link>
              <Link
                href='/help-center'
                className='text-blue-600 hover:underline'
              >
                → Help Center
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
