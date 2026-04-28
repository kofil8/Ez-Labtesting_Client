import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { CheckCircle2, Circle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import {
  buildProfileChecklist,
  getProfileReadinessPercent,
} from "./dashboard-helpers";

export function ProfileReadiness({
  viewer,
}: {
  viewer: CustomerDashboardViewer;
}) {
  const checklist = buildProfileChecklist(viewer);
  const readiness = getProfileReadinessPercent(viewer);

  return (
    <section className='rounded-2xl border border-blue-100 bg-white p-5 shadow-lg shadow-blue-100/25 sm:p-6'>
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <p className='text-xs font-bold uppercase tracking-[0.16em] text-blue-600'>
            Patient summary
          </p>
          <h2 className='mt-1 text-lg font-semibold text-slate-950'>
            Profile Readiness
          </h2>
        </div>
        <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600'>
          <ShieldCheck className='h-5 w-5' />
        </span>
      </div>

      <div className='mt-5'>
        <div className='flex items-center justify-between text-sm'>
          <span className='font-medium text-slate-700'>Completion</span>
          <span className='font-semibold text-slate-950'>{readiness}%</span>
        </div>
        <Progress value={readiness} className='mt-2 h-2 bg-slate-100' />
      </div>

      <div className='mt-5 space-y-2'>
        {checklist.map((item) => {
          const Icon = item.ready ? CheckCircle2 : Circle;

          return (
            <Link
              key={item.label}
              href={item.href}
              className='flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
            >
              <Icon
                className={
                  item.ready
                    ? "mt-0.5 h-5 w-5 shrink-0 text-teal-600"
                    : "mt-0.5 h-5 w-5 shrink-0 text-slate-400"
                }
              />
              <span className='min-w-0'>
                <span className='block text-sm font-medium text-slate-950'>
                  {item.label}
                </span>
                <span className='mt-0.5 block text-sm leading-5 text-slate-600'>
                  {item.helper}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <Button asChild variant='outline' className='mt-5 w-full border-blue-200 hover:bg-blue-50 hover:text-blue-700'>
        <Link href='/profile'>Update Profile</Link>
      </Button>
    </section>
  );
}
