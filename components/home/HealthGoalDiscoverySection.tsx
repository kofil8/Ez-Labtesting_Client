import { Button } from "@/components/ui/button";
import { homepageGoalCards } from "@/lib/copyContent";
import {
  Activity,
  ArrowRight,
  Droplet,
  HeartPulse,
  Microscope,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

const icons = {
  activity: Activity,
  droplet: Droplet,
  heart: HeartPulse,
  microscope: Microscope,
  sparkles: Sparkles,
  stethoscope: Stethoscope,
};

const toneClasses = {
  amber:
    "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/35 dark:text-amber-300 dark:border-amber-900/50",
  blue:
    "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/35 dark:text-blue-300 dark:border-blue-900/50",
  emerald:
    "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/35 dark:text-emerald-300 dark:border-emerald-900/50",
  rose:
    "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/35 dark:text-rose-300 dark:border-rose-900/50",
  sky:
    "bg-sky-50 text-sky-700 border-sky-100 dark:bg-cyan-950/35 dark:text-cyan-300 dark:border-cyan-900/50",
  violet:
    "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/35 dark:text-violet-300 dark:border-violet-900/50",
};

export function HealthGoalDiscoverySection() {
  return (
    <section id='health-goals' className='scroll-mt-24 bg-[linear-gradient(180deg,#ffffff_0%,#f5fbff_100%)] py-14 dark:bg-slate-950 sm:py-18 lg:py-20'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='mx-auto mb-9 max-w-3xl text-center'>
          <div>
            <p className='mb-3 inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-sm dark:border-sky-900/60 dark:bg-slate-900 dark:text-sky-300'>
              Quick health quiz
            </p>
            <h2 className='text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl'>
              Start with what you want to understand
            </h2>
            <p className='mt-4 text-base leading-7 text-slate-600 dark:text-slate-300'>
              You do not need to know the exact test name. Pick the closest goal
              and we will send you to matching lab options.
            </p>
          </div>
        </div>

        <div className='rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_30px_80px_-55px_rgba(14,165,233,0.45)] dark:border-slate-800 dark:bg-slate-900 sm:p-5 lg:p-6'>
          <div className='mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-sky-300'>
                Browse by concern
              </p>
              <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                Pick a common starting point and jump into the matching catalog.
              </p>
            </div>
          <Button
            asChild
            variant='outline'
              className='w-full rounded-full bg-white font-semibold shadow-sm dark:bg-slate-950 sm:w-auto'
          >
            <Link href='/tests'>Browse all tests</Link>
          </Button>
          </div>

          <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
            {homepageGoalCards.map((goal) => {
              const Icon = icons[goal.icon as keyof typeof icons] || Sparkles;
              const tone =
                toneClasses[goal.tone as keyof typeof toneClasses] ||
                toneClasses.sky;
              return (
                <Link
                  key={goal.title}
                  href={`/tests?search=${encodeURIComponent(goal.search)}`}
                  className='group flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-colors hover:border-sky-300 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-800'
                >
                  <div className='mb-4 flex items-start justify-between gap-4'>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${tone}`}
                    >
                      <Icon className='h-5 w-5' />
                    </span>
                    <ArrowRight className='mt-2 h-5 w-5 text-slate-300 transition-colors group-hover:text-sky-700 dark:text-slate-700 dark:group-hover:text-sky-300' />
                  </div>
                  <h3 className='text-base font-bold leading-snug text-slate-950 dark:text-white'>
                    {goal.title}
                  </h3>
                  <p className='mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                    {goal.description}
                  </p>
                  <div className='mt-4 flex flex-wrap gap-2'>
                    {goal.examples.map((example) => (
                      <span
                        key={example}
                        className='rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                  <span className='mt-auto pt-5 text-sm font-semibold text-sky-700 group-hover:text-sky-800 dark:text-sky-300'>
                    See matching tests
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
