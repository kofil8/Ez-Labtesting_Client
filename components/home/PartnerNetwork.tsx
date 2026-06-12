import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Building2, Clock3 } from "lucide-react";

const partners = [
  {
    name: "ACCESS",
    badge: "Currently active",
    active: true,
    description: "Active partner coverage for eligible orders.",
  },
  {
    name: "CPL",
    badge: "Planned",
    active: false,
    description: "Additional network expansion planned.",
  },
  {
    name: "Labcorp",
    badge: "Planned",
    active: false,
    description: "Additional network expansion planned.",
  },
  {
    name: "Quest",
    badge: "Planned",
    active: false,
    description: "Additional network expansion planned.",
  },
];

export function PartnerNetwork() {
  return (
    <section id='partner-lab-disclosure' className='bg-white py-14 dark:bg-slate-950 sm:py-20'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='mb-10 max-w-3xl'>
          <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300'>
            Partner lab network
          </p>
          <h2 className='text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl'>
            Your order connects to authorized lab partners
          </h2>
          <p className='mt-3 text-base leading-7 text-slate-600 dark:text-slate-300'>
            EzLabTesting handles the online experience. Authorized partner
            laboratories handle sample collection, processing, and testing when
            your order is eligible.
          </p>
        </div>

        <div className='grid gap-3 lg:grid-cols-[1.15fr_0.95fr_0.95fr_0.95fr]'>
          {partners.map((partner) => {
            const Icon = partner.active ? BadgeCheck : Clock3;
            return (
            <Card
              key={partner.name}
              className={`min-h-0 rounded-xl border shadow-sm transition-colors ${
                partner.active
                  ? "border-emerald-300 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/20"
                  : "border-slate-200 bg-slate-50 opacity-90 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              <CardContent className={partner.active ? "p-5" : "p-5"}>
                <div className={`mb-5 flex items-center justify-between gap-3 ${partner.active ? "" : "lg:block"}`}>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sky-700 shadow-sm dark:bg-slate-950 dark:text-sky-300'>
                    <Building2 className='h-5 w-5' />
                  </div>
                  <Icon className={partner.active ? "h-6 w-6 text-emerald-600" : "hidden h-5 w-5 text-slate-400 lg:mt-4 lg:block"} />
                </div>
                <div className='flex items-center justify-between gap-3'>
                  <h3 className={partner.active ? "text-2xl font-bold text-slate-950 dark:text-white" : "text-xl font-bold text-slate-900 dark:text-white"}>{partner.name}</h3>
                  <Badge
                    className={
                      partner.active
                        ? "rounded-full bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-600"
                        : "rounded-full border border-slate-300 bg-white px-3 py-1 text-slate-600 hover:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                    }
                  >
                    {partner.badge}
                  </Badge>
                </div>
                <p className='mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400'>{partner.description}</p>
              </CardContent>
            </Card>
            );
          })}
        </div>

        <p className='mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'>
          Planned partner networks are not available for ordering until enabled in your ZIP code and shown during checkout.
        </p>
      </div>
    </section>
  );
}
