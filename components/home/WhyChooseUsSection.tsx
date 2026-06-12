"use client";

import { motion } from "framer-motion";
import {
  Clock,
  DollarSign,
  Lock,
  MapPin,
  ShieldCheck,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "85% cheaper than many walk-in prices",
    description:
      "The price you see is the price you pay. No co-pay surprises, hidden processing fees, or insurance pre-authorization delays.",
  },
  {
    icon: ShieldCheck,
    title: "Same quality labs physicians use",
    description:
      "Tests are processed by CLIA-certified laboratories, including partner Access Medical Laboratories.",
  },
  {
    icon: Clock,
    title: "Results in plain English",
    description:
      "Most results are available within 1 to 3 business days, with secure online access and context you can bring to your doctor.",
  },
  {
    icon: Lock,
    title: "Private from order to results",
    description:
      "Your results are accessible only to you. We never share health data with employers or insurance companies.",
  },
  {
    icon: Zap,
    title: "No insurance needed",
    description:
      "Order eligible tests directly with clear cash pricing, no referral requirement, and no pre-authorization wait.",
  },
  {
    icon: MapPin,
    title: "Book in 60 seconds",
    description:
      "Find nearby partner draw centers and choose a convenient visit path. Many locations support walk-ins or flexible windows.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className='bg-white py-16 dark:bg-slate-950 sm:py-20 lg:py-24'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className='mx-auto mb-12 max-w-2xl text-center lg:mb-16'
        >
          <p className='mb-3 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-cyan-300'>
            Why Ez LabTesting
          </p>
          <h2 className='mb-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl'>
            Built for answers, not surprise bills
          </h2>
          <p className='text-sm leading-relaxed text-slate-500 dark:text-slate-300 sm:text-base'>
            The difference is not only certification. It is clearer prices,
            easier booking, secure access, and results you can actually use.
          </p>
        </motion.div>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                className='flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-cyan-800 dark:hover:bg-slate-900'
              >
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100/50 bg-blue-50 dark:border-cyan-900/60 dark:bg-cyan-950/30'>
                  <Icon className='h-4 w-4 text-blue-600 dark:text-cyan-300' />
                </div>
                <div>
                  <h3 className='mb-1.5 text-sm font-semibold text-slate-900 dark:text-white'>
                    {feature.title}
                  </h3>
                  <p className='text-sm leading-relaxed text-slate-500 dark:text-slate-400'>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
