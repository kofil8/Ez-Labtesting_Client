"use client";

import { Button } from "@/components/ui/button";
import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { FlaskConical, LogOut, PanelLeftClose } from "lucide-react";
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
      id='customer-dashboard-panel'
      className='fixed inset-y-0 right-0 z-40 hidden h-screen w-[clamp(13.75rem,20vw,15.5rem)] shrink-0 overflow-hidden border-l border-slate-200 bg-white px-4 py-5 shadow-2xl shadow-slate-900/10 lg:flex lg:flex-col xl:w-[clamp(15rem,18vw,17.5rem)] xl:px-5 xl:py-6 min-[1680px]:right-[calc((100vw-1680px)/2)]'
    >
      <div className='flex items-center justify-between gap-3 border-b border-slate-200 pb-4'>
        <Link
          href='/dashboard/customer'
          aria-label='Open customer dashboard'
          onMouseEnter={() => onPreloadRoute("/dashboard/customer")}
          onFocus={() => onPreloadRoute("/dashboard/customer")}
          onTouchStart={() => onPreloadRoute("/dashboard/customer")}
          className='flex min-w-0 items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 hover:bg-slate-50'
        >
          <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-700 via-cyan-600 to-teal-600 text-white shadow-md shadow-blue-200/50'>
            <FlaskConical className='h-5 w-5' />
          </span>
          <span className='min-w-0'>
            <span className='block truncate text-sm font-semibold text-slate-950'>
              Ez LabTesting
            </span>
            <span className='block truncate text-xs font-medium text-slate-500'>
              Customer Dashboard
            </span>
          </span>
        </Link>

        <button
          type='button'
          onClick={onTogglePanel}
          aria-label='Hide dashboard panel'
          aria-controls='customer-dashboard-panel'
          aria-expanded={!isPanelHidden}
          title='Hide panel'
          className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
        >
          <PanelLeftClose className='h-4 w-4' />
        </button>
      </div>

      <div className='mt-6'>
        <CustomerNavLinks onPreloadRoute={onPreloadRoute} viewer={viewer} />
      </div>

      <div className='mt-auto pt-6'>
        <Button
          type='button'
          variant='ghost'
          onClick={onSignOut}
          disabled={isSigningOut}
          title={isSigningOut ? "Signing out" : "Sign out"}
          className='w-full justify-start rounded-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        >
          <LogOut className='h-4 w-4' />
          {isSigningOut ? "Signing out..." : "Sign out"}
        </Button>
      </div>
    </aside>
  );
}
