"use client";

import { QuickHealthQuizDialog } from "@/components/home/QuickHealthQuizDialog";
import { CompactTrustBadges } from "@/components/shared/CompactTrustBadges";
import { ZipSearchForm } from "@/components/shared/ZipSearchForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackEzLabEvent } from "@/lib/analytics";
import { homepageHeroCopy } from "@/lib/copyContent";
import {
  ArrowRight,
  Beaker,
  CheckCircle2,
  FileCheck2,
  MapPinned,
  Search,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

const assuranceCards = [
  {
    icon: ShieldCheck,
    title: "Availability first",
    label: "Check state and ZIP eligibility before the order path.",
  },
  {
    icon: Beaker,
    title: "Clear catalog",
    label: "Compare test names, specimen notes, timing, and price.",
  },
  {
    icon: FileCheck2,
    title: "Result guidance",
    label: "Secure account access with educational context.",
  },
];

const journeySteps = [
  {
    label: "Search",
    text: "Find tests by health goal, marker, or condition.",
    icon: Search,
  },
  {
    label: "Check",
    text: "Confirm local ordering availability before checkout.",
    icon: MapPinned,
  },
  {
    label: "Review",
    text: "Open pricing, specimen, and result timing details.",
    icon: Stethoscope,
  },
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

            <CompactTrustBadges placement='hero' className='max-w-3xl' />

            <div className='grid max-w-3xl gap-3 sm:grid-cols-3'>
              {assuranceCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className='rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900'
                  >
                    <span className='mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'>
                      <Icon className='h-5 w-5' />
                    </span>
                    <h2 className='text-sm font-semibold text-slate-950 dark:text-white'>
                      {card.title}
                    </h2>
                    <p className='mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400'>
                      {card.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className='relative min-w-0'>
            <div className='overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_32px_70px_-45px_rgba(14,116,144,0.45)] dark:border-slate-800 dark:bg-slate-900'>
              <div className='border-b border-slate-200 bg-gradient-to-r from-white via-sky-50 to-cyan-50 px-5 py-5 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:px-6'>
                <div className='flex min-w-0 flex-wrap items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300'>
                      Care journey
                    </p>
                    <h2 className='mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white'>
                      From question to test
                    </h2>
                  </div>
                  <span className='rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'>
                    ACCESS active
                  </span>
                </div>
              </div>

              <div className='space-y-4 p-5 sm:p-6'>
                {journeySteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.label}
                      className='grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950'
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

                <div className='rounded-[1.5rem] border border-sky-100 bg-sky-50/80 p-4 dark:border-sky-900/60 dark:bg-sky-950/20'>
                  <div className='flex items-start gap-3'>
                    <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-300'>
                      <CheckCircle2 className='h-5 w-5' />
                    </span>
                    <div>
                      <p className='text-sm font-bold text-slate-950 dark:text-white'>
                        Simple next step
                      </p>
                      <p className='mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                        Browse individual tests or panels, then review details before checkout.
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
