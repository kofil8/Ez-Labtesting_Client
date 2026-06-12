"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, CreditCard, ReceiptText, ShieldCheck } from "lucide-react";
import Link from "next/link";

const examples = [
  { test: "Vitamin D Test", price: "$64", compare: "typical retail can be $200+" },
  { test: "Lipid Panel", price: "$36", compare: "typical retail can be $150+" },
  { test: "STD Screen", price: "$150", compare: "typical retail can be $400+" },
];

const included = [
  "Lab processing and secure results included",
  "No hidden checkout fees",
  "No insurance required",
  "Major cards plus eligible HSA/FSA accepted",
];

export function PricingTransparencySection() {
  return (
    <section className='bg-slate-50 py-10 dark:bg-slate-900/70 sm:py-12'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='grid gap-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8'>
          <div>
            <div className='mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-cyan-950/40 dark:text-cyan-300'>
              <ReceiptText className='h-5 w-5' />
            </div>
            <p className='text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300'>
              Price Clarity
            </p>
            <h2 className='mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl'>
              True pricing, no surprises.
            </h2>
            <p className='mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300'>
              See cash-pay pricing before checkout. You do not need an insurance referral or pre-authorization to order eligible tests online.
            </p>
            <div className='mt-5 flex flex-col gap-3 sm:flex-row'>
              <Button asChild className='rounded-lg bg-blue-600 text-white hover:bg-blue-700'>
                <Link href='/tests'>
                  View tests and prices
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </Button>
              <Button asChild variant='outline' className='rounded-lg bg-white dark:bg-slate-900'>
                <Link href='/help-center'>Pricing help</Link>
              </Button>
            </div>
          </div>

          <div className='grid gap-4 lg:grid-cols-2'>
            <div className='rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70'>
              <h3 className='mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white'>
                <CreditCard className='h-4 w-4 text-blue-600 dark:text-cyan-300' />
                Cash price examples
              </h3>
              <div className='space-y-3'>
                {examples.map((item) => (
                  <div key={item.test} className='flex items-start justify-between gap-3 border-b border-slate-200 pb-3 last:border-0 last:pb-0 dark:border-slate-800'>
                    <div>
                      <p className='text-sm font-semibold text-slate-900 dark:text-white'>{item.test}</p>
                      <p className='text-xs text-slate-500 dark:text-slate-400'>{item.compare}</p>
                    </div>
                    <p className='text-sm font-bold text-slate-900 dark:text-white'>{item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className='rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30'>
              <h3 className='mb-3 flex items-center gap-2 text-sm font-bold text-emerald-950 dark:text-emerald-100'>
                <ShieldCheck className='h-4 w-4 text-emerald-700 dark:text-emerald-300' />
                Included at checkout
              </h3>
              <div className='space-y-2.5'>
                {included.map((item) => (
                  <div key={item} className='flex items-start gap-2 text-sm text-emerald-900 dark:text-emerald-200'>
                    <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300' />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
