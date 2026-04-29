"use client";

import { Button } from "@/components/ui/button";
import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { cn } from "@/lib/utils";
import {
  FlaskConical,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CUSTOMER_NAV_ITEMS, isCustomerNavActive } from "./customer-navigation";
import { CustomerAvatar } from "./CustomerAvatar";

export function CustomerSidebar({
  viewer,
  onSignOut,
  isSigningOut,
  isPanelHidden,
  onTogglePanel,
}: {
  viewer?: CustomerDashboardViewer | null;
  onSignOut: () => void;
  isSigningOut: boolean;
  isPanelHidden: boolean;
  onTogglePanel: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden h-screen shrink-0 overflow-hidden border-r border-blue-100 bg-white px-3 py-4 shadow-sm lg:flex lg:flex-col xl:px-4 xl:py-5 min-[1680px]:left-[calc((100vw-1680px)/2)]",
        isPanelHidden ? "w-[76px] xl:w-[84px]" : "w-[244px] xl:w-[268px]",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          isPanelHidden ? "justify-center" : "justify-between",
        )}
      >
        <Link
          href='/dashboard/customer'
          aria-label='Open customer dashboard'
          className={cn(
            "flex min-w-0 items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-slate-50",
            isPanelHidden && "justify-center",
          )}
        >
          <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 text-white shadow-md shadow-blue-200/50'>
            <FlaskConical className='h-5 w-5' />
          </span>
          {!isPanelHidden && (
            <span className='min-w-0'>
              <span className='block truncate text-sm font-semibold text-slate-950'>
                Ez LabTesting
              </span>
              <span className='block truncate text-xs font-medium text-slate-500'>
                Customer Dashboard
              </span>
            </span>
          )}
        </Link>

        {!isPanelHidden && (
          <button
            type='button'
            onClick={onTogglePanel}
            aria-label='Hide dashboard panel'
            title='Hide panel'
            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
          >
            <PanelLeftClose className='h-4 w-4' />
          </button>
        )}
      </div>

      {isPanelHidden && (
        <button
          type='button'
          onClick={onTogglePanel}
          aria-label='Show dashboard panel'
          title='Show panel'
          className='mt-4 flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
        >
          <PanelLeftOpen className='h-4 w-4' />
        </button>
      )}

      <nav className={cn("space-y-1", isPanelHidden ? "mt-5" : "mt-6")}>
        {CUSTOMER_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isCustomerNavActive(pathname, href);
          const isProfileItem = href === "/dashboard/customer/profile";

          return (
            <Link
              key={href}
              href={href}
              title={isPanelHidden ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                isPanelHidden && "justify-center px-0",
                active
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-100"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
              )}
            >
              {isProfileItem ? (
                <CustomerAvatar
                  viewer={viewer}
                  className={cn(
                    "h-5 w-5 rounded-md border-current/20",
                    isPanelHidden && "h-10 w-10 rounded-lg",
                  )}
                />
              ) : (
                <Icon className='h-4 w-4' />
              )}
              {!isPanelHidden && label}
            </Link>
          );
        })}
      </nav>

      <div className='mt-auto pt-6'>
        <Button
          type='button'
          variant='ghost'
          onClick={onSignOut}
          disabled={isSigningOut}
          title={isSigningOut ? "Signing out" : "Sign out"}
          className={cn(
            "w-full rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-950",
            isPanelHidden ? "justify-center px-0" : "justify-start",
          )}
        >
          <LogOut className='h-4 w-4' />
          {!isPanelHidden && (isSigningOut ? "Signing out..." : "Sign out")}
        </Button>
      </div>
    </aside>
  );
}
