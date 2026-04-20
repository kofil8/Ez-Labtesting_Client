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
    title: "Transparent Pricing",
    description:
      "The price you see is the price you pay. No hidden fees, no surprise bills. Our cash prices are up to 85% less than typical retail lab costs.",
  },
  {
    icon: ShieldCheck,
    title: "CLIA-Certified Labs",
    description:
      "All tests are processed by CLIA-certified laboratories, including our partner Access Medical Laboratories. The same quality labs trusted by physicians.",
  },
  {
    icon: Clock,
    title: "Fast Results (1–3 Days)",
    description:
      "Most results are available within 1 to 3 business days. Access your results securely online as soon as they are ready.",
  },
  {
    icon: Lock,
    title: "100% Confidential",
    description:
      "Your results are private and accessible only to you. We never share your health data with employers or insurance companies.",
  },
  {
    icon: Zap,
    title: "No Insurance Needed",
    description:
      "Skip the insurance hassle entirely. Our cash-pay model means anyone can order tests directly — no referrals, no pre-authorization, no waiting.",
  },
  {
    icon: MapPin,
    title: "4,000+ Draw Centers",
    description:
      "Visit any of our nationwide partner draw centers. Most locations accept walk-ins so you can get your blood drawn at your convenience.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className='py-16 sm:py-20 lg:py-24 bg-white'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className='mx-auto max-w-2xl text-center mb-12 lg:mb-16'
        >
          <p className='mb-3 text-xs font-semibold uppercase tracking-wider text-blue-600'>
            Why Ez LabTesting
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-4'>
            Why Thousands Choose Us
          </h2>
          <p className='text-sm sm:text-base text-slate-500 leading-relaxed'>
            We make lab testing accessible, affordable, and private.
          </p>
        </motion.div>

        {/* Feature Grid */}
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
                className='flex gap-4 p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300'
              >
                <div className='shrink-0 w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center'>
                  <Icon className='h-4 w-4 text-blue-600' />
                </div>
                <div>
                  <h3 className='text-sm font-semibold text-slate-900 mb-1.5'>
                    {feature.title}
                  </h3>
                  <p className='text-sm text-slate-500 leading-relaxed'>
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
