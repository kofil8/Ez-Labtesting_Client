"use client";

import { CompactTrustBadges } from "@/components/shared/CompactTrustBadges";
import { SiteMetrics } from "@/components/shared/SiteMetrics";
import { ZipSearchForm } from "@/components/shared/ZipSearchForm";
import { trackEzLabEvent } from "@/lib/analytics";
import { homepageFinalCtaCopy } from "@/lib/copyContent";
import Link from "next/link";

export function HealthReadyCTA() {
  return (
    <section className='bg-white py-14 dark:bg-slate-950 sm:py-20'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white sm:p-8 lg:p-10'>
          <div className='grid gap-8 lg:grid-cols-[1fr_0.88fr] lg:items-center'>
            <div>
              <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300'>
                {homepageFinalCtaCopy.eyebrow}
              </p>
              <h2 className='text-2xl font-bold tracking-tight sm:text-4xl'>
                {homepageFinalCtaCopy.title}
              </h2>
              <p className='mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8'>
                {homepageFinalCtaCopy.description}
              </p>
              <div className='mt-5 flex flex-wrap gap-2'>
                {homepageFinalCtaCopy.chips.map((item) => (
                  <span
                    key={item}
                    className='rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300'
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div
              className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-5'
              onClickCapture={(event) => {
                const target = event.target as HTMLElement;
                if (target.closest("button")) {
                  trackEzLabEvent("hero_zip_cta_click", {
                    placement: "final-cta",
                  });
                }
              }}
            >
              <ZipSearchForm
                buttonLabel='Check Availability'
                helperText='Availability varies by location and test. ACCESS is the current active partner for eligible orders.'
              />
              <CompactTrustBadges placement='final-cta' className='mt-4' />
              <SiteMetrics className='mt-3' />
              <Link
                href='/tests'
                className='mt-4 inline-flex text-sm font-semibold text-sky-700 hover:text-sky-800 dark:text-sky-300'
              >
                Browse Tests
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
