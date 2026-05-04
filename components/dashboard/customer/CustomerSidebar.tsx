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
import { CustomerNavLinks } from "./CustomerNavLinks";

export function CustomerSidebar({
  viewer,
  onSignOut,
  isSigningOut,
  isPanelHidden,
  onTogglePanel,
  onPreloadRoute,
}: {
  viewer?: CustomerDashboardViewer | null;
  onSignOut: () => void;
  isSigningOut: boolean;
  isPanelHidden: boolean;
  onTogglePanel: () => void;
  onPreloadRoute: (href: string) => void;
}) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden h-screen shrink-0 overflow-hidden border-r border-slate-200 bg-white px-3 py-4 shadow-sm lg:flex lg:flex-col xl:px-4 xl:py-5 min-[1680px]:left-[calc((100vw-1680px)/2)]",
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
          onMouseEnter={() => onPreloadRoute("/dashboard/customer")}
          onFocus={() => onPreloadRoute("/dashboard/customer")}
          onTouchStart={() => onPreloadRoute("/dashboard/customer")}
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

      <div className={cn("mt-5", !isPanelHidden && "mt-6")}>
        <CustomerNavLinks
          collapsed={isPanelHidden}
          onPreloadRoute={onPreloadRoute}
          viewer={viewer}
        />
      </div>

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
