import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, CheckCircle2, Globe, Zap } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Labcorp | Lab Partners | Ez LabTesting",
  description:
    "Learn about Labcorp - one of the world's largest clinical laboratory networks.",
};

export default function LabcorpPage() {
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
          Labcorp
        </h1>
        <p className='text-xl text-muted-foreground'>
          The Laboratory Corporation of America - A Global Leader in Diagnostics
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
        <Card className='border-blue-100'>
          <CardHeader>
            <Building2 className='w-8 h-8 text-blue-600 mb-2' />
            <CardTitle>Global Network</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-slate-600'>
              One of the largest clinical laboratory networks worldwide with 36
              primary laboratories in the United States.
            </p>
          </CardContent>
        </Card>

        <Card className='border-blue-100'>
          <CardHeader>
            <Zap className='w-8 h-8 text-blue-600 mb-2' />
            <CardTitle>Innovation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-slate-600'>
              Continuous investment in cutting-edge diagnostic technology and
              research.
            </p>
          </CardContent>
        </Card>

        <Card className='border-blue-100'>
          <CardHeader>
            <Globe className='w-8 h-8 text-blue-600 mb-2' />
            <CardTitle>Comprehensive</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-slate-600'>
              Extensive range of diagnostic tests and services for all
              healthcare needs.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='bg-blue-50 rounded-2xl p-8 md:p-12 mb-12'>
        <h2 className='text-2xl font-bold text-blue-950 mb-4'>About Labcorp</h2>
        <p className='text-lg text-blue-800/80 mb-4'>
          Laboratory Corporation of America Holdings (Labcorp) is one of the
          largest and most comprehensive clinical laboratory networks in the
          United States. With a network of 36 primary laboratories and thousands
          of patient service centers, Labcorp provides diagnostic testing and
          information services to patients, physicians, employers, and
          healthcare institutions.
        </p>
        <p className='text-lg text-blue-800/80'>
          Labcorp is a healthcare and life sciences company that combines
          diagnostic information with patient engagement to help physicians make
          better clinical decisions and empower patients to act on their
          healthcare. Labcorp offers a comprehensive portfolio of diagnostic,
          drug development and technology-enabled services across the globe.
        </p>
      </div>

      <div className='mb-12'>
        <h2 className='text-2xl font-bold text-foreground mb-6'>
          Why Choose Labcorp
        </h2>
        <ul className='space-y-3'>
          {[
            "One of the largest clinical laboratory networks globally",
            "Convenient patient service centers nationwide",
            "Advanced diagnostic technology and equipment",
            "Comprehensive menu of laboratory tests",
            "Fast and reliable test results",
            "Expert laboratory professionals",
            "CLIA-certified and CAP-accredited",
            "Commitment to innovation in diagnostics",
            "Patient-focused care and services",
            "Strong emphasis on data security and privacy",
          ].map((feature, i) => (
            <li key={i} className='flex items-start gap-3 text-slate-700'>
              <CheckCircle2 className='w-5 h-5 text-blue-600 shrink-0 mt-0.5' />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className='border-t pt-8'>
        <h2 className='text-2xl font-bold text-foreground mb-4'>
          Our Partnership
        </h2>
        <p className='text-slate-700 mb-4'>
          Ez LabTesting is proud to partner with Labcorp, one of the most
          respected names in diagnostic laboratory services. With their
          extensive network and advanced technology, they are well-positioned to
          serve your diagnostic testing needs with precision and care.
        </p>
        <p className='text-slate-700'>
          Whether you need routine health screenings, specialized testing, or
          complex diagnostic services, Labcorp's experienced professionals and
          state-of-the-art facilities ensure you receive accurate results and
          exceptional service.
        </p>
      </div>
    </div>
  );
}
