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
    <section id='health-goals' className='scroll-mt-24 bg-[linear-gradient(180deg,#ffffff_0%,#f4f9fd_100%)] py-14 dark:bg-slate-950 sm:py-18 lg:py-20'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='mx-auto mb-10 max-w-3xl text-center'>
          <p className='mb-3 inline-flex rounded-full border border-sky-200 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-700 shadow-2xs dark:border-sky-900/60 dark:bg-slate-900 dark:text-sky-300'>
            Start with How You Feel
          </p>
          <h2 className='text-3xl font-extrabold tracking-tight text-slate-950 font-heading dark:text-white sm:text-4xl'>
            Don&apos;t Know the Exact Test Name?
          </h2>
          <p className='mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300'>
            Most people don&apos;t know clinical test names like &ldquo;CMP&rdquo; or &ldquo;TSH&rdquo;. Choose your symptom or health goal below, and we&apos;ll point you to the doctor-recommended tests.
          </p>
        </div>

        <div className='rounded-3xl border border-slate-200/90 bg-white p-5 shadow-lg shadow-sky-950/5 dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:p-8'>
          <div className='mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <p className='text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400'>
                Popular Health Goals &amp; Symptoms
              </p>
              <p className='mt-0.5 text-sm text-slate-500 dark:text-slate-400'>
                Click any category to view matching diagnostic tests and upfront pricing.
              </p>
            </div>
            <Button
              asChild
              variant='outline'
              className='w-full rounded-xl border-slate-200 bg-white font-bold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 sm:w-auto'
            >
              <Link href='/tests'>View All 500+ Tests</Link>
            </Button>
          </div>

          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {homepageGoalCards.map((goal) => {
              const Icon = icons[goal.icon as keyof typeof icons] || Sparkles;
              const tone =
                toneClasses[goal.tone as keyof typeof toneClasses] ||
                toneClasses.sky;
              return (
                <Link
                  key={goal.title}
                  href={`/tests?search=${encodeURIComponent(goal.search)}`}
                  className='group flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:bg-white hover:shadow-md hover:shadow-sky-100/50 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-sky-700 dark:hover:bg-slate-900 dark:hover:shadow-none'
                >
                  <div>
                    <div className='mb-4 flex items-start justify-between gap-3'>
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-2xs ${tone}`}
                      >
                        <Icon className='h-5 w-5' />
                      </span>
                      {"badge" in goal && goal.badge && (
                        <span className='rounded-full border border-sky-100 bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300'>
                          {goal.badge}
                        </span>
                      )}
                    </div>
                    <h3 className='text-base font-bold text-slate-900 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-300'>
                      {goal.title}
                    </h3>
                    <p className='mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
                      {goal.description}
                    </p>
                    <div className='mt-3.5 flex flex-wrap gap-1.5'>
                      {goal.examples.map((example) => (
                        <span
                          key={example}
                          className='rounded-md border border-slate-200/80 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-850 dark:bg-slate-900 dark:text-slate-300'
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className='mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-850'>
                    <span className='text-xs font-bold text-sky-600 group-hover:text-sky-700 dark:text-sky-400'>
                      See tests &amp; cash pricing
                    </span>
                    <ArrowRight className='h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-sky-600 dark:text-slate-600 dark:group-hover:text-sky-400' />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
