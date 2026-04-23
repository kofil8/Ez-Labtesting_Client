import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Award, CheckCircle2, Users, Zap } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CPL (Clinical Pathology Laboratories) | Lab Partners | Ez LabTesting",
  description:
    "Learn about CPL - serving the medical community for over 70 years with exceptional laboratory services.",
};

export default function CPLPage() {
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
          CPL (Clinical Pathology Laboratories)
        </h1>
        <p className='text-xl text-muted-foreground'>
          Over 70 Years of Excellence in Diagnostic Laboratory Services
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
        <Card className='border-blue-100'>
          <CardHeader>
            <Award className='w-8 h-8 text-blue-600 mb-2' />
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-slate-600'>
              Serving the medical community with distinction for over 70 years
              with unwavering commitment to quality.
            </p>
          </CardContent>
        </Card>

        <Card className='border-blue-100'>
          <CardHeader>
            <Zap className='w-8 h-8 text-blue-600 mb-2' />
            <CardTitle>Advanced Methodologies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-slate-600'>
              State-of-the-art testing methods combined with regional expertise
              and precision.
            </p>
          </CardContent>
        </Card>

        <Card className='border-blue-100'>
          <CardHeader>
            <Users className='w-8 h-8 text-blue-600 mb-2' />
            <CardTitle>Patient Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-slate-600'>
              Dedicated to providing patient-centered care and exceptional
              service quality.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='bg-blue-50 rounded-2xl p-8 md:p-12 mb-12'>
        <h2 className='text-2xl font-bold text-blue-950 mb-4'>About CPL</h2>
        <p className='text-lg text-blue-800/80 mb-4'>
          Clinical Pathology Laboratories (CPL) has proudly served the medical
          community and patients for over 70 years. As part of Sonic Healthcare,
          a leading provider of diagnostic medical services worldwide, CPL
          continues to uphold the highest standards in laboratory diagnostics.
        </p>
        <p className='text-lg text-blue-800/80 mb-4'>
          CPL combines regional expertise with sophisticated technology to
          deliver accurate and reliable diagnostic results. Their commitment to
          quality and innovation has made them a trusted partner for healthcare
          providers and patients alike.
        </p>
        <p className='text-lg text-blue-800/80'>
          With a focus on patient care and medical excellence, CPL provides
          comprehensive diagnostic services that help physicians make informed
          clinical decisions and improve patient outcomes.
        </p>
      </div>

      <div className='mb-12'>
        <h2 className='text-2xl font-bold text-foreground mb-6'>
          Our Commitment to Excellence
        </h2>
        <ul className='space-y-3'>
          {[
            "Over 70 years of trusted laboratory services",
            "Regional expertise combined with advanced technology",
            "High-quality diagnostic testing across all specialties",
            "Patient-focused approach to healthcare",
            "Comprehensive test menu for diverse medical needs",
            "Experienced and certified laboratory professionals",
            "CLIA-certified and CAP-accredited laboratory",
            "Rigorous quality control and validation processes",
            "Strong commitment to patient confidentiality",
            "Continuous investment in advanced testing methodologies",
          ].map((feature, i) => (
            <li key={i} className='flex items-start gap-3 text-slate-700'>
              <CheckCircle2 className='w-5 h-5 text-blue-600 shrink-0 mt-0.5' />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className='bg-slate-100 rounded-lg p-6 mb-12'>
        <h3 className='font-semibold text-foreground mb-3'>
          Part of Sonic Healthcare
        </h3>
        <p className='text-slate-700'>
          CPL operates as part of Sonic Healthcare, one of the world's leading
          providers of diagnostic medical services. This partnership provides
          access to cutting-edge technology, extensive resources, and best
          practices in diagnostic laboratory services.
        </p>
      </div>

      <div className='border-t pt-8'>
        <h2 className='text-2xl font-bold text-foreground mb-4'>
          Partnering with Ez LabTesting
        </h2>
        <p className='text-slate-700 mb-4'>
          We're honored to partner with CPL, a laboratory with a proven track
          record of excellence spanning over seven decades. Their commitment to
          quality and patient care aligns perfectly with our mission to provide
          accessible, affordable, and reliable laboratory testing.
        </p>
        <p className='text-slate-700'>
          CPL's combination of regional expertise, advanced diagnostic
          methodologies, and genuine patient focus make them an ideal partner
          for delivering the high-quality testing services our patients deserve.
        </p>
      </div>
    </div>
  );
}
