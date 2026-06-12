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
    <section className='relative overflow-hidden border-b border-sky-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_56%,#f3faff_100%)] pb-10 pt-8 dark:border-slate-800 dark:bg-slate-950 sm:pb-14 sm:pt-10 lg:pb-16 lg:pt-14'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='grid min-w-0 items-center gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:gap-12'>
          <div className='min-w-0 space-y-5 lg:space-y-6'>
            <Badge className='border border-sky-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700 shadow-sm hover:bg-white dark:border-sky-900/60 dark:bg-slate-900 dark:text-sky-300'>
              {homepageHeroCopy.eyebrow}
            </Badge>

            <div className='space-y-3 sm:space-y-4'>
              <h1 className='max-w-3xl text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-[3.55rem] lg:leading-[1.05]'>
                Find the right lab test
                <span className='block text-sky-700 dark:text-sky-300'>
                  for what you want to understand.
                </span>
              </h1>
              <p className='max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg'>
                {homepageHeroCopy.description}
              </p>
            </div>

            <div
              className='max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-45px_rgba(14,116,144,0.5)] dark:border-slate-800 dark:bg-slate-900'
              onClickCapture={(event) => {
                const target = event.target as HTMLElement;
                if (target.closest("button")) {
                  trackEzLabEvent("hero_zip_cta_click", {
                    placement: "hero",
                  });
                }
              }}
            >
              <ZipSearchForm
                buttonLabel='Check ZIP'
                helperText={homepageHeroCopy.helperText}
              />
            </div>

            <div className='flex max-w-2xl flex-col gap-3 sm:flex-row'>
              <QuickHealthQuizDialog />
              <Button
                asChild
                variant='outline'
                className='h-12 w-full rounded-full border-slate-300 bg-white px-6 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900 sm:w-auto'
              >
                <Link href='/tests'>
                  {homepageHeroCopy.secondaryCta}
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </div>
          </div>

          <div className='relative min-w-0'>
            <div className='relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_32px_70px_-45px_rgba(14,116,144,0.45)] dark:border-slate-800 dark:bg-slate-900'>
              <div
                className='absolute inset-0 bg-[url("/images/Pipetting.jpeg")] bg-cover bg-center opacity-15 dark:opacity-10'
                aria-hidden='true'
              />
              <div
                className='absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(240,249,255,0.94)_48%,rgba(236,253,245,0.9)_100%)] dark:bg-[linear-gradient(135deg,rgba(2,6,23,0.96)_0%,rgba(15,23,42,0.93)_58%,rgba(8,47,73,0.9)_100%)]'
                aria-hidden='true'
              />

              <div className='relative border-b border-slate-200/80 px-5 py-5 dark:border-slate-800/80 sm:px-6'>
                <div className='flex min-w-0 flex-wrap items-start justify-between gap-4'>
                  <div className='min-w-0'>
                    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300'>
                      Care journey
                    </p>
                    <h2 className='mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white'>
                      From question to test
                    </h2>
                    <p className='mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300'>
                      One flow for eligibility, partner selection, checkout, and secure results.
                    </p>
                  </div>
                  <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300'>
                    <CheckCircle2 className='h-3.5 w-3.5' />
                    ACCESS active
                  </span>
                </div>
              </div>

              <div className='relative space-y-4 p-5 sm:p-6'>
                <div className='rounded-[1.5rem] border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/65'>
                  <div className='flex items-center gap-3'>
                    <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'>
                      <FlaskConical className='h-5 w-5' />
                    </span>
                    <div className='min-w-0'>
                      <p className='text-sm font-bold text-slate-950 dark:text-white'>
                        Partner lab options
                      </p>
                      <p className='text-xs leading-5 text-slate-600 dark:text-slate-400'>
                        Availability is checked by test, ZIP, and state rules.
                      </p>
                    </div>
                  </div>
                  <div className='mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4'>
                    {labPartners.map((partner) => (
                      <div
                        key={partner.name}
                        className='rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80'
                      >
                        <p className='text-sm font-bold text-slate-950 dark:text-white'>
                          {partner.name}
                        </p>
                        <p className='mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300'>
                          {partner.status}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {journeySteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.label}
                      className='grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/65'
                    >
                      <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-300'>
                        <Icon className='h-5 w-5' />
                      </span>
                      <div>
                        <div className='flex items-center justify-between gap-3'>
                          <h3 className='text-sm font-bold text-slate-950 dark:text-white'>
                            {step.label}
                          </h3>
                          <span className='text-xs font-semibold text-slate-400 dark:text-slate-600'>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <p className='mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                          {step.text}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div className='rounded-[1.5rem] border border-sky-100 bg-sky-50/85 p-4 shadow-sm backdrop-blur dark:border-sky-900/60 dark:bg-sky-950/35'>
                  <div className='flex items-start gap-3'>
                    <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-300'>
                      <CheckCircle2 className='h-5 w-5' />
                    </span>
                    <div>
                      <p className='text-sm font-bold text-slate-950 dark:text-white'>
                        Simple next step
                      </p>
                      <p className='mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                        Browse tests or panels, confirm availability, then review details before checkout.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
