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
    title: "Transparent pricing",
    description: "See your price before checkout.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    description: "Pay online through secure checkout.",
  },
  {
    icon: FileLock2,
    title: "Privacy-aware result access",
    description: "View results from your account.",
  },
  {
    icon: MapPinned,
    title: "State rules apply",
    description: "Availability depends on your state and ZIP.",
  },
  {
    icon: FlaskConical,
    title: "Partner lab fulfillment",
    description: "Collection and testing are handled by authorized partners.",
  },
  {
    icon: AlertTriangle,
    title: "Not for emergencies",
    description: "Severe symptoms? Call 911 or seek urgent care.",
  },
];

export function ComplianceBanner() {
  return (
    <section id='not-for-emergency-use' className='bg-white py-14 dark:bg-slate-950 sm:py-20'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='mb-10 max-w-3xl'>
          <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300'>
            Privacy, pricing & compliance
          </p>
          <h2 className='text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl'>
            Clear before you order
          </h2>
          <p className='mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300'>
            Know the price, privacy basics, and ordering limits before you pay.
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
