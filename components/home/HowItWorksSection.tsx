import { homepageHowItWorksSteps } from "@/lib/copyContent";
import {
  Building2,
  CheckCircle2,
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
      className='scroll-mt-24 border-y border-sky-100/80 bg-white py-14 dark:border-slate-800 dark:bg-slate-950 sm:py-20'
    >
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='mx-auto mb-12 max-w-3xl text-center sm:mb-14'>
          <p className='mb-3 inline-flex rounded-full border border-sky-200 bg-sky-50/50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-700 dark:border-sky-900/60 dark:bg-slate-900 dark:text-sky-300'>
            Simple 3-Step Process
          </p>
          <h2 className='text-3xl font-extrabold tracking-tight text-slate-950 font-heading dark:text-white sm:text-4xl'>
            How Online Lab Testing Works
          </h2>
          <p className='mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300'>
            Skip the clinical bureaucracy. We provide the doctor&apos;s authorization and partner with nationwide certified laboratories so you can test quickly and privately.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          {homepageHowItWorksSteps.map((item, index) => {
            const Icon = icons[item.icon as keyof typeof icons] || Search;
            return (
              <div
                key={item.title}
                className='relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/60 p-6 shadow-sm transition-all duration-200 hover:border-sky-300 hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 sm:p-7'
              >
                <div>
                  <div className='mb-5 flex items-center justify-between'>
                    <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 shadow-2xs dark:bg-sky-950 dark:text-sky-300'>
                      <Icon className='h-6 w-6' />
                    </span>
                    <span className='text-3xl font-black text-slate-200 dark:text-slate-800'>
                      {item.step}
                    </span>
                  </div>

                  <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
                    {item.title}
                  </h3>
                  <p className='mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
                    {item.description}
                  </p>
                </div>

                <div className='mt-6 border-t border-slate-100 pt-4 dark:border-slate-800'>
                  <div className='flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400'>
                    <CheckCircle2 className='h-4 w-4 shrink-0' />
                    <span>{item.highlight}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassuring footer note */}
        <div className='mt-8 rounded-2xl border border-sky-100 bg-sky-50/50 p-4 text-center text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400'>
          <span className='font-bold text-slate-800 dark:text-slate-200'>
            No doctor&apos;s visit required:
          </span>{" "}
          Orders are reviewed and authorized by an affiliated independent physician network.
          Valid for patients 18+ in supported U.S. states.
        </div>
      </div>
    </section>
  );
}
