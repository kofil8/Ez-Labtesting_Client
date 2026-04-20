"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HealthReadyCTA() {
  return (
    <section className='py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-blue-50'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className='rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-blue-50/40 to-cyan-50/30 overflow-hidden shadow-lg'
        >
          {/* Optional decorative background */}
          <div className='absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-cyan-600/5 pointer-events-none'></div>

          <div className='relative px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20'>
            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='space-y-6 sm:space-y-8'
            >
              {/* Header */}
              <div className='space-y-3 max-w-3xl'>
                <p className='text-xs font-bold uppercase tracking-wider text-blue-600'>
                  Take Control
                </p>
                <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight'>
                  Take Control of Your Health Today
                </h2>
                <p className='text-lg sm:text-xl text-slate-600 leading-relaxed'>
                  Shop medical lab tests online with clear pricing, secure
                  checkout, and nationwide draw center access. No insurance
                  required.
                </p>
              </div>

              <div className='flex flex-wrap items-center gap-2'>
                <span className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>
                  HIPAA-secure checkout
                </span>
                <span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700'>
                  CLIA-certified labs
                </span>
                <span className='rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700'>
                  Transparent pricing
                </span>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className='flex flex-col sm:flex-row gap-3 pt-2'
              >
                <Button
                  asChild
                  size='lg'
                  className='rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto'
                >
                  <Link
                    href='/tests'
                    className='inline-flex items-center gap-2'
                  >
                    Browse All Tests
                    <ArrowRight className='h-4 w-4' />
                  </Link>
                </Button>

                <Button
                  asChild
                  size='lg'
                  variant='outline'
                  className='rounded-lg border-slate-300 bg-white text-slate-800 hover:bg-slate-100 w-full sm:w-auto'
                >
                  <Link href='/panels'>Compare Test Panels</Link>
                </Button>

                <Button
                  asChild
                  size='lg'
                  variant='outline'
                  className='rounded-lg border-slate-300 bg-white text-slate-800 hover:bg-slate-100 w-full sm:w-auto'
                >
                  <Link href='/find-lab-center'>Find Lab Center</Link>
                </Button>

                <Button
                  asChild
                  size='lg'
                  variant='outline'
                  className='rounded-lg border-slate-300 bg-white text-slate-800 hover:bg-slate-100 w-full sm:w-auto'
                >
                  <Link href='/faqs'>Read FAQs</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
