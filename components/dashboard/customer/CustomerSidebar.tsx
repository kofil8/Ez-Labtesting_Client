"use client";

import { Button } from "@/components/ui/button";
import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { cn } from "@/lib/utils";
import { FlaskConical, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CUSTOMER_NAV_ITEMS,
  isCustomerNavActive,
} from "./customer-navigation";
import {
  buildCustomerName,
  buildInitials,
  formatMemberSince,
} from "./dashboard-helpers";

export function CustomerSidebar({
  viewer,
  onSignOut,
  isSigningOut,
}: {
  viewer?: CustomerDashboardViewer | null;
  onSignOut: () => void;
  isSigningOut: boolean;
}) {
  const pathname = usePathname();
  const initials = buildInitials(
    viewer?.firstName,
    viewer?.lastName,
    viewer?.email,
  );
  const name = buildCustomerName(viewer);

  return (
    <aside className='sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white px-4 py-5 xl:flex xl:flex-col 2xl:w-[272px]'>
      <Link
        href='/dashboard/customer'
        className='flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-slate-50'
      >
        <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-sky-700 text-white'>
          <FlaskConical className='h-5 w-5' />
        </span>
        <span>
          <span className='block text-sm font-semibold text-slate-950'>
            Ez LabTesting
          </span>
          <span className='block text-xs font-medium text-slate-500'>
            Customer portal
          </span>
        </span>
      </Link>

      <div className='mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-3'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-semibold text-sky-800 ring-1 ring-slate-200'>
            {initials}
          </div>
          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold text-slate-950'>
              {name}
            </p>
            <p className='truncate text-xs text-slate-500'>{viewer?.email}</p>
          </div>
        </div>
        <div className='mt-3 grid grid-cols-2 gap-2 text-xs'>
          <div className='rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200'>
            <p className='font-medium text-slate-500'>Status</p>
            <p className='mt-1 font-semibold text-slate-900'>
              {viewer?.isVerified ? "Verified" : "Pending"}
            </p>
          </div>
          <div className='rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200'>
            <p className='font-medium text-slate-500'>Member</p>
            <p className='mt-1 font-semibold text-slate-900'>
              {formatMemberSince(viewer?.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className='mt-5 rounded-2xl border border-slate-200 bg-white px-3 py-3'>
        <div className='flex items-center gap-2 text-sm font-medium text-slate-700'>
          <ShieldCheck className='h-4 w-4 text-sky-700' />
          {viewer?.mfaEnabled ? "MFA enabled" : "Standard security"}
        </div>
      </div>

      <nav className='mt-6 space-y-1'>
        {CUSTOMER_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isCustomerNavActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2",
                active
                  ? "bg-sky-50 text-sky-800 ring-1 ring-sky-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              )}
            >
              <Icon className='h-4 w-4' />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className='mt-auto space-y-3 pt-6'>
        <div className='rounded-2xl border border-slate-200 bg-slate-50 p-3'>
          <p className='text-sm font-semibold text-slate-950'>
            Need to order labs?
          </p>
          <p className='mt-1 text-xs leading-5 text-slate-600'>
            Browse clinical tests or locate a nearby collection center.
          </p>
          <div className='mt-3 grid gap-2'>
            <Button asChild size='sm' className='bg-sky-700 hover:bg-sky-800'>
              <Link href='/tests'>Browse Tests</Link>
            </Button>
            <Button asChild size='sm' variant='outline'>
              <Link href='/find-lab-center'>Find Lab Center</Link>
            </Button>
          </div>
        </div>

        <Button
          type='button'
          variant='ghost'
          onClick={onSignOut}
          disabled={isSigningOut}
          className='w-full justify-start rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-950'
        >
          <LogOut className='h-4 w-4' />
          {isSigningOut ? "Signing out..." : "Sign out"}
        </Button>
      </div>
    </aside>
  );
}
