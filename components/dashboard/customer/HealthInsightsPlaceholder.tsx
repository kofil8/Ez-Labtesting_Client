import { Activity, BarChart3, LockKeyhole, Waves } from "lucide-react";

export function HealthInsightsPlaceholder() {
  return (
    <section className='rounded-2xl border border-blue-100 bg-white p-5 shadow-lg shadow-blue-100/25 sm:p-6'>
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <p className='text-xs font-bold uppercase tracking-[0.16em] text-blue-600'>
            Future insights
          </p>
          <h2 className='mt-1 text-lg font-semibold text-slate-950'>
            Health Trends Coming Soon
          </h2>
        </div>
        <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-100 bg-cyan-50 text-cyan-600'>
          <BarChart3 className='h-5 w-5' />
        </span>
      </div>

      <div className='mt-5 overflow-hidden rounded-xl border border-dashed border-blue-200 bg-gradient-to-b from-blue-50/80 to-cyan-50/60 p-4'>
        <div className='relative h-32'>
          <div className='absolute inset-x-0 top-4 border-t border-slate-200' />
          <div className='absolute inset-x-0 top-14 border-t border-slate-200' />
          <div className='absolute inset-x-0 top-24 border-t border-slate-200' />
          <svg
            viewBox='0 0 320 120'
            className='absolute inset-0 h-full w-full'
            aria-hidden='true'
          >
            <path
              d='M4 78 C 46 42, 78 48, 116 66 S 184 96, 226 56 S 282 34, 316 46'
              fill='none'
              stroke='#2563eb'
              strokeLinecap='round'
              strokeWidth='4'
            />
            <path
              d='M4 92 C 50 76, 78 84, 116 72 S 188 40, 226 66 S 280 92, 316 72'
              fill='none'
              stroke='#0891b2'
              strokeDasharray='8 8'
              strokeLinecap='round'
              strokeWidth='3'
            />
          </svg>
          <div className='absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm'>
            <Waves className='h-3.5 w-3.5 text-blue-600' />
            Awaiting connected lab data
          </div>
        </div>

        <div className='mt-4 flex items-start gap-2 text-sm leading-6 text-slate-600'>
          <LockKeyhole className='mt-0.5 h-4 w-4 shrink-0 text-slate-500' />
          <p>
            This is a visual placeholder for future structured result history.
            No diagnostic values are estimated or fabricated.
          </p>
        </div>
      </div>

      <div className='mt-4 flex items-center gap-2 text-sm font-medium text-slate-700'>
        <Activity className='h-4 w-4 text-teal-600' />
        Connect result feeds to unlock trend analytics
      </div>
    </section>
  );
}
