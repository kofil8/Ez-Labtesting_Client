"use client";

import { NotificationsBell } from "@/components/notifications/NotificationsBell";
import { Button } from "@/components/ui/button";
import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { cn } from "@/lib/utils";
import { FlaskConical, LogOut, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CUSTOMER_NAV_ITEMS,
  isCustomerNavActive,
} from "./customer-navigation";
import { CustomerAvatar } from "./CustomerAvatar";

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

  return (
    <header className='sticky top-0 z-30 border-b border-blue-100 bg-white/95 backdrop-blur xl:hidden'>
      <div className='flex items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4'>
        <Link
          href='/dashboard/customer'
          className='flex min-w-0 items-center gap-2'
        >
          <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 text-white shadow-sm'>
            <FlaskConical className='h-4 w-4' />
          </span>
          <span className='min-w-0'>
            <span className='block truncate text-sm font-semibold text-slate-950'>
              Ez LabTesting
            </span>
            <span className='block text-xs text-slate-500'>Records</span>
          </span>
        </Link>

        <div className='flex shrink-0 items-center gap-1.5 sm:gap-2'>
          <Button
            asChild
            size='sm'
            className='hidden bg-blue-600 hover:bg-blue-700 xs:inline-flex'
          >
            <Link href='/tests'>
              <Search className='h-4 w-4' />
              Tests
            </Link>
          </Button>
          <NotificationsBell />
          <Link
            href='/profile'
            aria-label='Open profile'
            className='block h-9 w-9 shrink-0'
          >
            <CustomerAvatar viewer={viewer} className='h-9 w-9 rounded-lg' />
          </Link>
          <button
            type='button'
            onClick={onSignOut}
            disabled={isSigningOut}
            aria-label={isSigningOut ? "Signing out" : "Sign out"}
            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
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
                "inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                active
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-blue-100 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700",
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
