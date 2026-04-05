"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck2,
  FileCheck,
  FlaskConical,
  ScanLine,
} from "lucide-react";

const steps = [
  {
    icon: FlaskConical,
    title: "Choose Tests",
    description:
      "Browse our comprehensive catalog of individual tests and health panels. Filter by health goals or medical needs.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: CalendarCheck2,
    title: "Schedule Visit",
    description:
      "Select a convenient lab location and time slot. Same-day appointments often available.",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: ScanLine,
    title: "Quick Collection",
    description:
      "Visit your chosen lab for a fast, professional sample collection. Takes just 10-15 minutes.",
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-50",
  },
  {
    icon: FileCheck,
    title: "Get Results",
    description:
      "Receive secure, physician-reviewed reports in your patient portal within 24-72 hours.",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
  },
];

const featurePoints = [
  "No hidden fees or surprise charges",
  "24/7 access to your health records",
  "Direct provider referral option",
  "Comprehensive health insights",
];

export function HowItWorksSection() {
  return (
    <section className='py-16 sm:py-20 lg:py-24 bg-white'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className='mx-auto max-w-3xl text-center mb-16 lg:mb-20'
        >
          <p className='mb-3 text-xs font-bold uppercase tracking-wider text-blue-600'>
            Simple Process
          </p>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4'>
            How It Works
          </h2>
          <p className='text-base sm:text-lg text-slate-600 leading-relaxed'>
            A streamlined, patient-centered workflow designed for your health
            and convenience. From test selection to results, we make every step
            clear and effortless.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className='mb-16'>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className='relative group'
                >
                  {/* Connector Arrow (hidden on mobile, visible on lg) */}
                  {!isLast && (
                    <div className='hidden lg:block absolute -right-3 top-12 w-6 h-0.5 bg-gradient-to-r from-slate-200 to-slate-100'></div>
                  )}

                  {/* Card */}
                  <div className='h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300'>
                    {/* Step Number */}
                    <div className='mb-4 flex items-center justify-between'>
                      <div className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 font-bold text-slate-900'>
                        {index + 1}
                      </div>
                      <ArrowRight className='h-4 w-4 text-slate-300 group-hover:text-slate-400' />
                    </div>

                    {/* Icon */}
                    <div
                      className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg ${step.bgColor}`}
                    >
                      <IconComponent
                        className='h-6 w-6'
                        style={{
                          background: `linear-gradient(135deg, ${step.color.split(" ")[0]} 0%, ${step.color.split(" ")[1]} 100%)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      />
                    </div>

                    {/* Content */}
                    <h3 className='mb-2 text-lg font-bold text-slate-900'>
                      {step.title}
                    </h3>
                    <p className='text-sm leading-relaxed text-slate-600'>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className='rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-8 sm:p-10'
        >
          <h3 className='mb-6 text-2xl font-bold text-slate-900'>
            Why Choose EzLabTesting?
          </h3>
          <div className='grid gap-4 sm:grid-cols-2'>
            {featurePoints.map((point, index) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className='flex items-start gap-3'
              >
                <div className='mt-1 flex-shrink-0'>
                  <div className='flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100'>
                    <svg
                      className='h-3 w-3 text-emerald-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={3}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                </div>
                <span className='text-sm font-medium text-slate-700'>
                  {point}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
