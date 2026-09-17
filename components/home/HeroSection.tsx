"use client";

import { QuickHealthQuizDialog } from "@/components/home/QuickHealthQuizDialog";
import { ZipSearchForm } from "@/components/shared/ZipSearchForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackEzLabEvent } from "@/lib/analytics";
import { homepageHeroCopy } from "@/lib/copyContent";
import {
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  MapPinned,
  Search,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

const journeySteps = [
  {
    label: "Search",
    text: "Find tests by health goal, marker, condition, or partner network.",
    icon: Search,
  },
  {
    label: "Check",
    text: "Confirm state and ZIP availability before checkout.",
    icon: MapPinned,
  },
  {
    label: "Review",
    text: "Compare price, specimen notes, timing, and result access.",
    icon: Stethoscope,
  },
];

const labPartners = [
  { name: "ACCESS", status: "Active" },
  { name: "Labcorp", status: "Network" },
  { name: "CPL", status: "Network" },
  { name: "Quest", status: "Network" },
];

export function HeroSection() {
  return (
    <section className='relative overflow-hidden border-b border-sky-100 bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_50%,#f0f9ff_100%)] pb-12 pt-8 dark:border-slate-800 dark:bg-slate-950 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-16'>
      {/* Subtle background glow */}
      <div
        className='pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-[56rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-sky-200/40 via-blue-100/30 to-emerald-100/30 blur-3xl dark:from-sky-950/20 dark:to-emerald-950/20'
        aria-hidden='true'
      />

      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='grid min-w-0 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14'>
          {/* Left Column: Human Hook, Value Prop, Search & Trust */}
          <div className='min-w-0 space-y-6'>
            <div className='inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/95 px-3.5 py-1.5 shadow-sm dark:border-sky-800 dark:bg-slate-900'>
              <span className='flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
              <span className='text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300'>
                {homepageHeroCopy.eyebrow}
              </span>
            </div>

            <div className='space-y-4'>
              <h1 className='text-4xl font-extrabold tracking-tight text-slate-950 font-heading dark:text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1] [text-wrap:balance]'>
                Doctor-Approved Lab Tests.{" "}
                <span className='bg-gradient-to-r from-sky-600 via-blue-600 to-teal-600 bg-clip-text text-transparent dark:from-sky-400 dark:to-teal-300'>
                  On Your Own Terms.
                </span>
              </h1>
              <p className='max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-lg'>
                {homepageHeroCopy.description}
              </p>
            </div>

            {/* Reassurance Checklist Pills */}
            <div className='grid grid-cols-2 gap-2.5 pt-1 sm:grid-cols-4'>
              {[
                { title: "No Doctor Visit", sub: "Physician order included" },
                { title: "No Insurance Needed", sub: "Upfront cash pricing" },
                { title: "4,000+ Draw Labs", sub: "Quest, Labcorp & ACCESS" },
                { title: "Fast 24-72h Results", sub: "Confidential & secure" },
              ].map((item) => (
                <div
                  key={item.title}
                  className='rounded-xl border border-sky-100 bg-white/90 p-2.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80'
                >
                  <div className='flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white'>
                    <CheckCircle2 className='h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400' />
                    <span>{item.title}</span>
                  </div>
                  <p className='mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 pl-5'>
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* ZIP & Search Action Box */}
            <div
              className='rounded-2xl border border-slate-200/90 bg-white p-5 shadow-lg shadow-sky-950/5 dark:border-slate-800 dark:bg-slate-900'
              onClickCapture={(event) => {
                const target = event.target as HTMLElement;
                if (target.closest("button")) {
                  trackEzLabEvent("hero_zip_cta_click", {
                    placement: "hero",
                  });
                }
              }}
            >
              <p className='mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                Check lab availability near you:
              </p>
              <ZipSearchForm
                buttonLabel='Find Local Labs'
                buttonClassName='bg-blue-600 hover:bg-blue-700 font-semibold'
                helperText={homepageHeroCopy.helperText}
              />
            </div>

            {/* CTAs */}
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
              <QuickHealthQuizDialog />
              <Button
                asChild
                variant='outline'
                className='h-12 rounded-xl border-slate-300 bg-white px-6 font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
              >
                <Link href='/tests'>
                  {homepageHeroCopy.secondaryCta}
                  <ArrowRight className='ml-2 h-4 w-4 text-blue-600' />
                </Link>
              </Button>
            </div>

            {/* Social Proof Strip */}
            <div className='flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-600 dark:text-slate-400'>
              <div className='flex items-center gap-1 text-amber-500'>
                {"★".repeat(5)}
                <span className='ml-1 font-bold text-slate-900 dark:text-white'>4.9/5</span>
              </div>
              <span className='text-slate-300 dark:text-slate-700'>•</span>
              <span className='font-semibold text-slate-700 dark:text-slate-300'>
                Over 50,000+ Tests Completed Across the USA
              </span>
            </div>
          </div>

          {/* Right Column: Visual Human Reassurance Card (Result Experience Preview) */}
          <div className='relative min-w-0'>
            <div className='relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-sky-900/10 dark:border-slate-800 dark:bg-slate-900 sm:p-7'>
              {/* Header */}
              <div className='flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800'>
                <div className='flex items-center gap-2.5'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'>
                    <FlaskConical className='h-5 w-5' />
                  </div>
                  <div>
                    <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
                      Patient Requisition & Results
                    </h3>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>
                      Sample Patient Portal View
                    </p>
                  </div>
                </div>
                <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300'>
                  <CheckCircle2 className='h-3.5 w-3.5 text-emerald-600' /> Verified CLIA Lab
                </span>
              </div>

              {/* Sample Lab Marker Cards */}
              <div className='mt-5 space-y-3'>
                <div className='rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/60'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs font-semibold text-slate-900 dark:text-white'>
                        Vitamin D, 25-Hydroxy
                      </p>
                      <p className='text-[11px] text-slate-400 dark:text-slate-500'>Optimal Range: 30 - 100 ng/mL</p>
                    </div>
                    <div className='text-right'>
                      <span className='inline-flex items-center rounded-md border border-emerald-200/70 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/60 dark:text-emerald-300'>
                        48.2 ng/mL (Normal)
                      </span>
                    </div>
                  </div>
                  <div className='mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800'>
                    <div className='h-full w-[52%] rounded-full bg-emerald-500' />
                  </div>
                </div>

                <div className='rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/60'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs font-semibold text-slate-900 dark:text-white'>
                        TSH (Thyroid Stimulating Hormone)
                      </p>
                      <p className='text-[11px] text-slate-400 dark:text-slate-500'>Standard Range: 0.45 - 4.50 uIU/mL</p>
                    </div>
                    <div className='text-right'>
                      <span className='inline-flex items-center rounded-md border border-emerald-200/70 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/60 dark:text-emerald-300'>
                        1.85 uIU/mL (Optimal)
                      </span>
                    </div>
                  </div>
                  <div className='mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800'>
                    <div className='h-full w-[45%] rounded-full bg-emerald-500' />
                  </div>
                </div>

                <div className='rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/60'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs font-semibold text-slate-900 dark:text-white'>
                        Total Cholesterol / Lipid Panel
                      </p>
                      <p className='text-[11px] text-slate-400 dark:text-slate-500'>Desirable: &lt; 200 mg/dL</p>
                    </div>
                    <div className='text-right'>
                      <span className='inline-flex items-center rounded-md border border-sky-200/70 bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-800 dark:border-sky-900/50 dark:bg-sky-950/60 dark:text-sky-300'>
                        182 mg/dL (Normal)
                      </span>
                    </div>
                  </div>
                  <div className='mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800'>
                    <div className='h-full w-[60%] rounded-full bg-sky-500' />
                  </div>
                </div>
              </div>

              {/* Bottom Quick Benefits Callout */}
              <div className='mt-5 flex items-center justify-between rounded-xl bg-gradient-to-r from-sky-50 to-teal-50 p-3.5 dark:from-slate-800 dark:to-slate-850'>
                <div className='flex items-center gap-2'>
                  <Stethoscope className='h-4 w-4 text-teal-600 dark:text-teal-400' />
                  <span className='text-xs font-semibold text-slate-800 dark:text-slate-200'>
                    Doctor order generated immediately upon checkout
                  </span>
                </div>
                <Link
                  href='/tests'
                  className='text-xs font-bold text-sky-700 hover:underline dark:text-sky-400'
                >
                  See Tests →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
