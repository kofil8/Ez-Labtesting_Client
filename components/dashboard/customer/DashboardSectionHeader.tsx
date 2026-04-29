import type { ComponentType } from "react";

export function DashboardSectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <section className='rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-5 py-6 shadow-xl shadow-blue-100/25 sm:px-6 lg:px-7'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='min-w-0'>
          <p className='text-xs font-bold uppercase tracking-[0.18em] text-blue-600'>
            {eyebrow}
          </p>
          <h1 className='mt-2 break-words text-2xl font-extrabold tracking-normal text-slate-950 sm:text-3xl'>
            {title}
          </h1>
          <p className='mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base'>
            {description}
          </p>
        </div>
        {Icon ? (
          <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white/85 text-blue-700 shadow-sm'>
            <Icon className='h-5 w-5' />
          </span>
        ) : null}
      </div>
    </section>
  );
}
