import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Lab Partners | Ez LabTesting",
  description:
    "Learn more about our trusted lab partners including ACCESS, CPL, Quest Diagnostics, and Labcorp.",
};

const partners = [
  {
    name: "Quest Diagnostics",
    slug: "quest-diagnostics",
    description:
      "The nation's leading diagnostic information service, empowering people to take action to improve health outcomes.",
  },
  {
    name: "Labcorp",
    slug: "labcorp",
    description:
      "One of the largest clinical laboratory networks in the world with state-of-the-art facilities.",
  },
  {
    name: "CPL (Clinical Pathology Laboratories)",
    slug: "cpl",
    description:
      "Serving the medical community for over 70 years with the highest quality laboratory services.",
  },
  {
    name: "ACCESS Medical Laboratories",
    slug: "access",
    description:
      "A full-service medical laboratory offering the latest innovations in diagnostic testing.",
  },
];

export default function LabPartnersPage() {
  return (
    <div className='container mx-auto px-4 py-16 max-w-7xl'>
      <div className='text-center mb-16'>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4'>
          Our Trusted Lab Partners
        </h1>
        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
          We partner with the nation's leading and most accredited laboratories
          to ensure you receive accurate, reliable, and swift test results.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-16'>
        {partners.map((partner) => (
          <Link
            key={partner.slug}
            href={`/lab-partners/${partner.slug}`}
            className='hover:no-underline'
          >
            <Card className='flex flex-col h-full border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <CardHeader>
                <CardTitle className='text-2xl text-blue-900'>
                  {partner.name}
                </CardTitle>
                <CardDescription className='text-base text-slate-600 mt-2'>
                  {partner.description}
                </CardDescription>
              </CardHeader>
              <CardContent className='mt-auto pt-6'>
                <div className='flex items-center gap-2 text-blue-600 font-semibold'>
                  Learn More
                  <ArrowRight className='w-4 h-4' />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className='mt-16 bg-blue-50 rounded-2xl p-8 md:p-12 text-center'>
        <h2 className='text-2xl md:text-3xl font-bold text-blue-950 mb-4'>
          Quality You Can Trust
        </h2>
        <p className='text-lg text-blue-800/80 max-w-3xl mx-auto mb-8'>
          All our partner laboratories are CLIA-certified and CAP-accredited,
          adhering to the strictest medical and privacy standards in the
          industry. Your health data is always secure, and your test results are
          processed with the utmost precision.
        </p>
      </div>
    </div>
  );
}
