"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  ClipboardCheck,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";

const STEPS = [
  {
    title: "Order Confirmed",
    description: "We validate your details and prepare your lab requisition.",
    icon: ShieldCheck,
  },
  {
    title: "Schedule or Walk In",
    description: "Choose a nearby lab or visit at your convenience.",
    icon: CalendarCheck,
  },
  {
    title: "At the Lab",
    description:
      "Present your ID and requisition; the visit is quick and guided.",
    icon: ClipboardCheck,
  },
  {
    title: "Results Delivered",
    description:
      "We process your sample in a CLIA-certified lab and notify you securely.",
    icon: FlaskConical,
  },
];

interface WhatHappensNextProps {
  className?: string;
}

export function WhatHappensNext({ className }: WhatHappensNextProps) {
  return (
    <Card
      className={cn(
        "w-full border-2 bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 p-4 sm:p-5",
        className,
      )}
    >
      <div className='mb-4 sm:mb-5'>
        <p className='text-xs font-semibold text-primary uppercase tracking-wide'>
          What happens next
        </p>
        <h3 className='text-lg sm:text-xl font-semibold text-foreground mt-1'>
          A calm, guided experience
        </h3>
        <p className='text-sm text-muted-foreground mt-1'>
          Clear steps so you know exactly what to expect after payment.
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className='flex items-start gap-3 rounded-lg border bg-card/70 backdrop-blur-sm px-3 py-3'
            >
              <div className='mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20'>
                <Icon className='h-5 w-5' />
              </div>
              <div className='space-y-0.5'>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <span className='font-semibold text-foreground'>
                    Step {index + 1}
                  </span>
                </div>
                <p className='text-sm font-semibold text-foreground'>
                  {step.title}
                </p>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
