import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  CreditCard,
  FileLock2,
  FlaskConical,
  MapPinned,
  ShieldCheck,
} from "lucide-react";

const cards = [
  {
    icon: CreditCard,
    title: "100% Upfront Pricing",
    description: "The price you see is what you pay. Zero hidden lab processing fees or surprise hospital bills.",
  },
  {
    icon: ShieldCheck,
    title: "Doctor's Order Included",
    description: "Every test is physician-approved by our licensed clinical network—no doctor appointment required.",
  },
  {
    icon: FileLock2,
    title: "HIPAA-Protected Privacy",
    description: "Your health records are strictly confidential and encrypted with 256-bit bank-grade security.",
  },
  {
    icon: MapPinned,
    title: "Nationwide Lab Network",
    description: "Walk into authorized patient service centers (Quest, Labcorp, ACCESS) across 45+ states.",
  },
  {
    icon: FlaskConical,
    title: "CLIA & CAP Accredited",
    description: "Samples are analyzed exclusively in certified, high-complexity diagnostic clinical laboratories.",
  },
  {
    icon: AlertTriangle,
    title: "Routine & Wellness Use",
    description: "For diagnostic screening and monitoring. If experiencing a medical emergency, please call 911.",
  },
];

export function ComplianceBanner() {
  return (
    <section id='not-for-emergency-use' className='bg-white py-14 dark:bg-slate-950 sm:py-20'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='mb-10 max-w-3xl'>
          <p className='mb-3 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300'>
            Patient Bill of Rights &amp; Standards
          </p>
          <h2 className='text-3xl font-extrabold tracking-tight text-slate-950 font-heading dark:text-white sm:text-4xl'>
            Transparent, Regulated, &amp; Patient-First
          </h2>
          <p className='mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300'>
            We believe you deserve full control over your health data with complete transparency around pricing, clinical oversight, and privacy.
          </p>
        </div>

        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className='group min-h-0 rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-colors hover:border-sky-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800'>
                <CardContent className='p-5'>
                  <div className='mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sky-700 shadow-sm dark:bg-slate-950 dark:text-sky-300'>
                    <Icon className='h-5 w-5' />
                  </div>
                  <h3 className='text-lg font-bold text-slate-950 dark:text-white'>{card.title}</h3>
                  <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400'>{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
