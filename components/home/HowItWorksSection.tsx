import { homepageHowItWorksSteps } from "@/lib/copyContent";
import {
  Building2,
  FileCheck2,
  LockKeyhole,
  MapPinned,
  Search,
} from "lucide-react";

const icons = {
  building: Building2,
  file: FileCheck2,
  lock: LockKeyhole,
  map: MapPinned,
  search: Search,
};

export function HowItWorksSection() {
  return (
    <section
      id='how-it-works'
      className='scroll-mt-24 border-y border-sky-100 bg-white py-14 dark:border-slate-800 dark:bg-slate-950 sm:py-20'
    >
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='mx-auto mb-10 max-w-3xl text-center sm:mb-12'>
          <p className='mb-3 inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-sm dark:border-sky-900/60 dark:bg-slate-900 dark:text-sky-300'>
            How it works
          </p>
          <h2 className='text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl'>
            A clearer path from question to result
          </h2>
          <p className='mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base'>
            EzLabTesting keeps the online part simple. Authorized partner labs
            handle collection and testing when your order is eligible.
          </p>
        </div>

        <div className='rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f6fbff_100%)] p-4 shadow-[0_30px_80px_-55px_rgba(14,165,233,0.45)] dark:border-slate-800 dark:bg-slate-900 sm:p-5 lg:p-6'>
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
            {homepageHowItWorksSteps.map((step, index) => {
              const Icon = icons[step.icon as keyof typeof icons] || Search;
              return (
                <div
                  key={step.title}
                  className='group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950'
                >
                  <div className='mb-4 flex items-center justify-between gap-3'>
                    <span className='relative z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'>
                      <Icon className='h-5 w-5' />
                    </span>
                    <span className='text-sm font-semibold text-slate-400 dark:text-slate-600'>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className='text-base font-bold leading-snug text-slate-950 dark:text-white'>
                    {step.title}
                  </h3>
                  <p className='mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          <p className='mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-200'>
            Availability, partner locations, and turnaround times vary by state,
            ZIP code, test type, and lab partner.
          </p>
        </div>
      </div>
    </section>
  );
}
