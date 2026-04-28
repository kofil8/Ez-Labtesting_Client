import { Button } from "@/components/ui/button";
import { NotificationsBell } from "@/components/notifications/NotificationsBell";
import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { MapPinned, Search } from "lucide-react";
import Link from "next/link";
import { buildCustomerName, buildInitials } from "./dashboard-helpers";

export function DashboardWelcome({
  viewer,
}: {
  viewer: CustomerDashboardViewer;
}) {
  const firstName = viewer.firstName?.trim() || buildCustomerName(viewer);
  const initials = buildInitials(viewer.firstName, viewer.lastName, viewer.email);

  return (
    <section className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
      <div className='flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between'>
        <div className='min-w-0'>
          <p className='text-sm font-medium text-sky-700'>Customer portal</p>
          <h1 className='mt-2 break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl'>
            Welcome back, {firstName}
          </h1>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base'>
            Manage your lab tests, orders, and results from one secure place.
          </p>
        </div>

        <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center'>
          <Button asChild className='w-full bg-sky-700 hover:bg-sky-800 sm:w-auto'>
            <Link href='/tests'>
              <Search className='h-4 w-4' />
              Browse Tests
            </Link>
          </Button>
          <Button asChild variant='outline' className='w-full sm:w-auto'>
            <Link href='/find-lab-center'>
              <MapPinned className='h-4 w-4' />
              Find Lab Center
            </Link>
          </Button>
          <div className='hidden xl:block'>
            <NotificationsBell />
          </div>
          <Link
            href='/profile'
            aria-label='Open profile'
            className='hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 xl:flex'
          >
            {initials}
          </Link>
        </div>
      </div>
    </section>
  );
}
