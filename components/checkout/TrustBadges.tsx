"use client";

import { CheckCircle2, Hospital, Lock, ShieldCheck } from "lucide-react";

const BADGES = [
  {
    icon: ShieldCheck,
    title: "HIPAA Compliant",
    description: "Your health data is protected and private",
  },
  {
    icon: Hospital,
    title: "CLIA Certified",
    description: "Tests processed in CLIA-certified labs",
  },
  {
    icon: Lock,
    title: "Secure Payment",
    description: "256-bit SSL encrypted checkout",
  },
  {
    icon: CheckCircle2,
    title: "Quality Assured",
    description: "Trusted by clinicians and patients",
  },
];

export function TrustBadges() {
  return (
    <div className='w-full rounded-xl border bg-card/60 backdrop-blur-sm shadow-sm p-3 sm:p-4 flex flex-col gap-3'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
        {BADGES.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.title}
              className='flex items-start gap-3 rounded-lg border bg-muted/40 px-3 py-2.5'
            >
              <div className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20'>
                <Icon className='h-5 w-5' />
              </div>
              <div className='space-y-0.5'>
                <p className='text-sm font-semibold'>{badge.title}</p>
                <p className='text-xs text-muted-foreground leading-tight'>
                  {badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
