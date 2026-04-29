import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Globe, Zap } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quest Diagnostics | Lab Partners | Ez LabTesting",
  description:
    "Learn about Quest Diagnostics - the nation's leading diagnostic information service provider.",
};

export default function QuestDiagnosticsPage() {
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
          Quest Diagnostics
        </h1>
        <p className='text-xl text-muted-foreground'>
          The nation's leading diagnostic information service
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
        <Card className='border-blue-100'>
          <CardHeader>
            <Globe className='w-8 h-8 text-blue-600 mb-2' />
            <CardTitle>Global Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-slate-600'>
              Nationwide network of patient service centers providing convenient
              access to testing locations.
            </p>
          </CardContent>
        </Card>

        <Card className='border-blue-100'>
          <CardHeader>
            <Zap className='w-8 h-8 text-blue-600 mb-2' />
            <CardTitle>Fast Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-slate-600'>
              Quick turnaround times on test results with advanced laboratory
              technology.
            </p>
          </CardContent>
        </Card>

        <Card className='border-blue-100'>
          <CardHeader>
            <CheckCircle2 className='w-8 h-8 text-blue-600 mb-2' />
            <CardTitle>Expertise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-slate-600'>
              Derived from the world's largest database of clinical lab results
              and insights.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='bg-blue-50 rounded-2xl p-8 md:p-12 mb-12'>
        <h2 className='text-2xl font-bold text-blue-950 mb-4'>About Quest</h2>
        <p className='text-lg text-blue-800/80 mb-4'>
          Quest Diagnostics is an American clinical laboratory company and a
          leading provider of diagnostic testing, information and services. The
          company offers a comprehensive range of tests that help detect, treat
          and monitor diseases and conditions.
        </p>
        <p className='text-lg text-blue-800/80'>
          Quest Diagnostics empowers people to take action to improve health
          outcomes. Derived from the world's largest database of clinical lab
          results, our diagnostic insights reveal new avenues to identify and
          treat disease, inspire healthy behaviors and improve health care
          management.
        </p>
      </div>

      <div className='mb-12'>
        <h2 className='text-2xl font-bold text-foreground mb-6'>
          Key Features
        </h2>
        <ul className='space-y-3'>
          {[
            "Nationwide network of patient service centers",
            "Advanced laboratory technology and equipment",
            "Fast and accurate test results",
            "Extensive menu of diagnostic tests",
            "State-of-the-art facilities",
            "Experienced laboratory professionals",
            "CLIA-certified and CAP-accredited",
            "Commitment to patient privacy and data security",
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
          Our Commitment to You
        </h2>
        <p className='text-slate-700 mb-4'>
          At Ez LabTesting, we've partnered with Quest Diagnostics because of
          their unwavering commitment to quality and accuracy. Their extensive
          network ensures that you can access testing services conveniently, and
          their advanced technology guarantees reliable results.
        </p>
        <p className='text-slate-700'>
          Whether you're looking for routine health screening or specialized
          diagnostic testing, Quest Diagnostics provides the expertise and
          infrastructure needed to serve your healthcare needs.
        </p>
      </div>
    </div>
  );
}
