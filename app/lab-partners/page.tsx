import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeCheck, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Lab Network | EzLabTesting",
  description:
    "Learn how EzLabTesting works with authorized partner laboratories. ACCESS is currently active; CPL, Labcorp, and Quest are planned.",
};

const partners = [
  {
    name: "ACCESS",
    status: "Currently active",
    active: true,
    description: "Active partner coverage for eligible orders.",
  },
  {
    name: "CPL",
    status: "Planned",
    active: false,
    description: "Additional network expansion planned.",
  },
  {
    name: "Labcorp",
    status: "Planned",
    active: false,
    description: "Additional network expansion planned.",
  },
  {
    name: "Quest",
    status: "Planned",
    active: false,
    description: "Additional network expansion planned.",
  },
];

export default function LabPartnersPage() {
  return (
    <main className='container mx-auto max-w-7xl px-4 py-16'>
      <div className='mb-12 max-w-3xl'>
        <p className='mb-3 text-xs font-bold uppercase tracking-wider text-sky-700'>
          Partner lab disclosure
        </p>
        <h1 className='text-4xl font-bold tracking-tight text-foreground md:text-5xl'>
          Partner Lab Network
        </h1>
        <p className='mt-4 text-lg leading-8 text-muted-foreground'>
          EzLabTesting handles online ordering, secure checkout, account management, and result access. Sample collection, lab processing, and clinical testing are performed by authorized partner laboratories.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'>
        {partners.map((partner) => {
          const Icon = partner.active ? BadgeCheck : Clock;
          return (
            <Card
              key={partner.name}
              className={
                partner.active
                  ? "border-emerald-200 bg-emerald-50/60"
                  : "border-slate-200 bg-slate-50 opacity-85"
              }
            >
              <CardHeader>
                <div className='mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-sky-700 shadow-sm'>
                  <Icon className='h-5 w-5' />
                </div>
                <CardTitle className='text-2xl'>{partner.name}</CardTitle>
                <CardDescription>
                  <span
                    className={
                      partner.active
                        ? "font-semibold text-emerald-700"
                        : "font-semibold text-slate-600"
                    }
                  >
                    {partner.status}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-sm leading-6 text-muted-foreground'>
                  {partner.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className='mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-6 text-muted-foreground'>
        Current partner availability, ordering rules, draw center access, and turnaround times may vary by state, ZIP code, test type, and lab partner.
      </div>
    </main>
  );
}
