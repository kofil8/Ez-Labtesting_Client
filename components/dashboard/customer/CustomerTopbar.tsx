"use client";

import { NotificationsBell } from "@/components/notifications/NotificationsBell";
import { Button } from "@/components/ui/button";
import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { cn } from "@/lib/utils";
import { FlaskConical, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CUSTOMER_NAV_ITEMS,
  isCustomerNavActive,
} from "./customer-navigation";
import { buildInitials } from "./dashboard-helpers";

export function CustomerTopbar({
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

  return (
    <header className='sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur xl:hidden'>
      <div className='flex items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4'>
        <Link
          href='/dashboard/customer'
          className='flex min-w-0 items-center gap-2'
        >
          <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-sky-700 text-white'>
            <FlaskConical className='h-4 w-4' />
          </span>
          <span className='min-w-0'>
            <span className='block truncate text-sm font-semibold text-slate-950'>
              Ez LabTesting
            </span>
            <span className='block text-xs text-slate-500'>Portal</span>
          </span>
        </Link>

        <div className='flex shrink-0 items-center gap-1.5 sm:gap-2'>
          <Button
            asChild
            size='sm'
            className='hidden bg-sky-700 hover:bg-sky-800 xs:inline-flex'
          >
            <Link href='/tests'>Browse Tests</Link>
          </Button>
          <NotificationsBell />
          <Link
            href='/profile'
            aria-label='Open profile'
            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-800 ring-1 ring-slate-200'
          >
            {initials}
          </Link>
          <button
            type='button'
            onClick={onSignOut}
            disabled={isSigningOut}
            aria-label={isSigningOut ? "Signing out" : "Sign out"}
            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600'
          >
            <LogOut className='h-4 w-4' />
          </button>
        </div>
      </div>

      <nav className='scrollbar-hide flex gap-2 overflow-x-auto px-3 pb-3 sm:px-4'>
        {CUSTOMER_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isCustomerNavActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600",
                active
                  ? "border-sky-200 bg-sky-50 text-sky-800"
                  : "border-slate-200 bg-white text-slate-600",
              )}
            >
              <Icon className='h-4 w-4' />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
