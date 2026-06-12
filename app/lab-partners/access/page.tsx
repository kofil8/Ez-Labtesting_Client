import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle2,
  HeartHandshake,
  Lightbulb,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ACCESS Medical Laboratories | Lab Partners | Ez LabTesting",
  description:
    "Learn about ACCESS Medical Laboratories - innovative full-service diagnostic testing laboratory.",
};

export default function ACCESSPage() {
  return (
    <div className='container mx-auto px-4 py-16 max-w-4xl'>
      <Link href='/lab-partners'>
        <Button variant='ghost' className='mb-8'>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back to Lab Partners
        </Button>
      </Link>

      <div className='mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4'>
          ACCESS Medical Laboratories
        </h1>
        <p className='text-xl text-muted-foreground'>
          Innovation and Excellence in Diagnostic Testing
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
        <Card className='border-blue-100'>
          <CardHeader>
            <Lightbulb className='w-8 h-8 text-blue-600 mb-2' />
            <CardTitle>Innovation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-slate-600'>
              Full-service medical laboratory offering the latest innovations in
              diagnostic testing technology.
            </p>
          </CardContent>
        </Card>

        <Card className='border-blue-100'>
          <CardHeader>
            <Zap className='w-8 h-8 text-blue-600 mb-2' />
            <CardTitle>Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-slate-600'>
              Committed to delivering accurate, reliable results with rigorous
              quality control measures.
            </p>
          </CardContent>
        </Card>

        <Card className='border-blue-100'>
          <CardHeader>
            <HeartHandshake className='w-8 h-8 text-blue-600 mb-2' />
            <CardTitle>Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-slate-600'>
              Exceptional customer service dedicated to patient satisfaction and
              care.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='bg-blue-50 rounded-2xl p-8 md:p-12 mb-12'>
        <h2 className='text-2xl font-bold text-blue-950 mb-4'>
          About ACCESS Medical Laboratories
        </h2>
        <p className='text-lg text-blue-800/80 mb-4'>
          ACCESS Medical Laboratories is a full-service medical laboratory
          dedicated to providing patients and healthcare providers with
          comprehensive diagnostic testing services. With a strong focus on
          innovation and quality, ACCESS has established itself as a leader in
          the diagnostic testing industry.
        </p>
        <p className='text-lg text-blue-800/80'>
          ACCESS Medical Laboratories combines state-of-the-art technology with
          experienced laboratory professionals to deliver fast, accurate, and
          reliable test results. Their commitment to innovation ensures that
          patients have access to the latest diagnostic methodologies available
          in the industry.
        </p>
      </div>

      <div className='mb-12'>
        <h2 className='text-2xl font-bold text-foreground mb-6'>
          Why ACCESS Stands Out
        </h2>
        <ul className='space-y-3'>
          {[
            "Full-service medical laboratory capabilities",
            "Latest innovations in diagnostic testing",
            "Accurate and reliable test results",
            "Commitment to excellence in patient care",
            "Experienced laboratory professionals",
            "State-of-the-art testing equipment",
            "CLIA-certified and CAP-accredited",
            "Exceptional customer service",
            "Fast turnaround times on results",
            "Comprehensive range of diagnostic tests",
            "Strong focus on continuous improvement",
            "Patient privacy and data security",
          ].map((feature, i) => (
            <li key={i} className='flex items-start gap-3 text-slate-700'>
              <CheckCircle2 className='w-5 h-5 text-blue-600 shrink-0 mt-0.5' />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
        <Card className='border-slate-200'>
          <CardHeader>
            <CardTitle>Testing Services</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-slate-700'>
              <li>• Routine health screenings</li>
              <li>• Specialized diagnostic tests</li>
              <li>• Drug screening and toxicology</li>
              <li>• Pathology services</li>
              <li>• And much more</li>
            </ul>
          </CardContent>
        </Card>

        <Card className='border-slate-200'>
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-slate-700'>
              <li>✓ Accuracy and precision</li>
              <li>✓ Innovation and improvement</li>
              <li>✓ Patient-centered care</li>
              <li>✓ Professional excellence</li>
              <li>✓ Ethical operations</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className='border-t pt-8'>
        <h2 className='text-2xl font-bold text-foreground mb-4'>
          Partnership with Ez LabTesting
        </h2>
        <p className='text-slate-700 mb-4'>
          Ez LabTesting is proud to partner with ACCESS Medical Laboratories,
          whose commitment to innovation and quality aligns with our mission to
          provide accessible and affordable laboratory testing services.
        </p>
        <p className='text-slate-700 mb-4'>
          With ACCESS as one of our trusted lab partners, we ensure that our
          patients receive accurate diagnostic results using the latest
          technologies available in the industry.
        </p>
        <p className='text-slate-700'>
          Whether you need routine health screening or specialized diagnostic
          testing, ACCESS Medical Laboratories brings innovation, accuracy, and
          exceptional service to every test.
        </p>
      </div>
    </div>
  );
}
