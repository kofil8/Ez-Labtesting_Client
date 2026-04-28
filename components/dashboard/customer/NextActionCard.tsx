import { Button } from "@/components/ui/button";
import type {
  CustomerDashboardOrder,
  CustomerDashboardViewer,
} from "@/lib/dashboard/customer.server";
import { ArrowRight, FileCheck2, Search, UserCheck } from "lucide-react";
import Link from "next/link";
import {
  formatSafeDate,
  getOrderHref,
  getProfileReadinessPercent,
  getStatusMeta,
} from "./dashboard-helpers";

export function NextActionCard({
  viewer,
  activeOrder,
}: {
  viewer: CustomerDashboardViewer;
  activeOrder?: CustomerDashboardOrder | null;
}) {
  const readiness = getProfileReadinessPercent(viewer);

  if (readiness < 100) {
    return (
      <section className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
        <div className='flex flex-col gap-4 xs:flex-row xs:items-start'>
          <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100'>
            <UserCheck className='h-5 w-5' />
          </span>
          <div className='min-w-0 flex-1'>
            <p className='text-sm font-medium text-sky-700'>Next Step</p>
            <h2 className='mt-1 text-xl font-semibold text-slate-950'>
              Complete your profile
            </h2>
            <p className='mt-2 text-sm leading-6 text-slate-600'>
              A complete profile helps prevent delays during checkout,
              requisition creation, and result access.
            </p>
            <Button asChild className='mt-5 w-full bg-sky-700 hover:bg-sky-800 sm:w-auto'>
              <Link href='/profile'>
                Update Profile
                <ArrowRight className='h-4 w-4' />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (activeOrder) {
    const status = getStatusMeta(activeOrder);

    return (
      <section className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
        <div className='flex flex-col gap-4 xs:flex-row xs:items-start'>
          <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100'>
            <FileCheck2 className='h-5 w-5' />
          </span>
          <div className='min-w-0 flex-1'>
            <p className='text-sm font-medium text-sky-700'>Next Step</p>
            <h2 className='mt-1 text-xl font-semibold text-slate-950'>
              Track {activeOrder.orderNumber}
            </h2>
            <p className='mt-2 text-sm leading-6 text-slate-600'>
              {status.label}. Latest update: {formatSafeDate(activeOrder.updatedAt)}.
            </p>
            <div className='mt-5 flex flex-col gap-3 sm:flex-row'>
              <Button asChild className='w-full bg-sky-700 hover:bg-sky-800 sm:w-auto'>
                <Link href={getOrderHref(activeOrder)}>View Order</Link>
              </Button>
              <Button asChild variant='outline' className='w-full sm:w-auto'>
                <Link href='/help-center'>Get Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
      <div className='flex flex-col gap-4 xs:flex-row xs:items-start'>
        <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100'>
          <Search className='h-5 w-5' />
        </span>
        <div className='min-w-0 flex-1'>
          <p className='text-sm font-medium text-sky-700'>Next Step</p>
          <h2 className='mt-1 text-xl font-semibold text-slate-950'>
            Ready for your next lab test?
          </h2>
          <p className='mt-2 text-sm leading-6 text-slate-600'>
            Browse available tests or find a nearby lab center before ordering.
          </p>
          <div className='mt-5 flex flex-col gap-3 sm:flex-row'>
            <Button asChild className='w-full bg-sky-700 hover:bg-sky-800 sm:w-auto'>
              <Link href='/tests'>Browse Tests</Link>
            </Button>
            <Button asChild variant='outline' className='w-full sm:w-auto'>
              <Link href='/find-lab-center'>Find Lab Center</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
