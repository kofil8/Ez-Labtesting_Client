"use client";

import { NotificationsBell } from "@/components/notifications/NotificationsBell";
import { Button } from "@/components/ui/button";
import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { cn } from "@/lib/utils";
import {
  FlaskConical,
  LogOut,
  MapPinned,
  Menu,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeNavItem =
    CUSTOMER_NAV_ITEMS.find(({ href }) => isCustomerNavActive(pathname, href)) ||
    CUSTOMER_NAV_ITEMS[0];
  const ActiveIcon = activeNavItem.icon;

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const handleSignOut = () => {
    setIsMenuOpen(false);
    onSignOut();
  };

  return (
    <>
      <header className='sticky top-0 z-40 border-b border-blue-100 bg-white/95 backdrop-blur xl:hidden'>
        <div className='flex items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4'>
          <button
            type='button'
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label={
              isMenuOpen ? "Close dashboard menu" : "Open dashboard menu"
            }
            aria-controls='customer-mobile-dashboard-menu'
            aria-expanded={isMenuOpen}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
          >
            {isMenuOpen ? (
              <X className='h-5 w-5' />
            ) : (
              <Menu className='h-5 w-5' />
            )}
          </button>

          <Link
            href='/dashboard/customer'
            className='flex min-w-0 flex-1 items-center gap-2'
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
            <NotificationsBell />
            <Link
              href='/dashboard/customer/profile'
              aria-label='Open profile'
              className='block h-9 w-9 shrink-0'
            >
              <CustomerAvatar viewer={viewer} className='h-9 w-9 rounded-lg' />
            </Link>
          </div>
        </div>

        <button
          type='button'
          onClick={() => setIsMenuOpen(true)}
          className='flex w-full items-center justify-between border-t border-blue-50 px-3 py-2 text-left sm:px-4'
        >
          <span className='inline-flex min-w-0 items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700'>
            <ActiveIcon className='h-4 w-4 shrink-0' />
            <span className='truncate'>{activeNavItem.label}</span>
          </span>
          <span className='text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'>
            Menu
          </span>
        </button>
      </header>

      {isMenuOpen && (
        <div className='xl:hidden'>
          <button
            type='button'
            aria-label='Close dashboard menu'
            className='fixed inset-0 z-[90] bg-slate-950/40 backdrop-blur-sm'
            onClick={() => setIsMenuOpen(false)}
          />
          <aside
            id='customer-mobile-dashboard-menu'
            role='dialog'
            aria-modal='true'
            aria-label='Dashboard menu'
            className='fixed inset-y-0 left-0 z-[100] flex w-[min(22rem,calc(100vw-1.5rem))] flex-col overflow-y-auto border-r border-blue-100 bg-white shadow-2xl shadow-slate-900/20'
          >
            <div className='flex items-center justify-between gap-3 border-b border-blue-100 px-4 py-4'>
              <Link
                href='/dashboard/customer'
                className='flex min-w-0 items-center gap-3'
                onClick={() => setIsMenuOpen(false)}
              >
                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 text-white shadow-md shadow-blue-100'>
                  <FlaskConical className='h-5 w-5' />
                </span>
                <span className='min-w-0'>
                  <span className='block truncate text-sm font-semibold text-slate-950'>
                    Ez LabTesting
                  </span>
                  <span className='block text-xs text-slate-500'>
                    Medical records
                  </span>
                </span>
              </Link>
              <button
                type='button'
                onClick={() => setIsMenuOpen(false)}
                aria-label='Close dashboard menu'
                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-4'>
              <Link
                href='/dashboard/customer/profile'
                className='flex items-center gap-3 rounded-xl bg-white/80 p-3 shadow-sm'
                onClick={() => setIsMenuOpen(false)}
              >
                <CustomerAvatar viewer={viewer} className='h-11 w-11 rounded-xl' />
                <span className='min-w-0'>
                  <span className='block truncate text-sm font-semibold text-slate-950'>
                    {viewer?.firstName || "Customer"} {viewer?.lastName || ""}
                  </span>
                  <span className='block truncate text-xs text-slate-500'>
                    {viewer?.email || "Account profile"}
                  </span>
                </span>
              </Link>
            </div>

            <div className='flex-1 px-4 py-4'>
              <p className='px-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
                Dashboard
              </p>
              <nav className='mt-3 grid gap-2'>
                {CUSTOMER_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                  const active = isCustomerNavActive(pathname, href);

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                        active
                          ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100"
                          : "border-blue-100 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                      )}
                    >
                      <Icon className='h-4 w-4' />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              <p className='mt-6 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
                Quick actions
              </p>
              <div className='mt-3 grid gap-2'>
                <Button asChild className='w-full bg-blue-600 hover:bg-blue-700'>
                  <Link href='/tests' onClick={() => setIsMenuOpen(false)}>
                    <Search className='h-4 w-4' />
                    Browse Tests
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  className='w-full border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                >
                  <Link
                    href='/find-lab-center'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MapPinned className='h-4 w-4' />
                    Find Lab Center
                  </Link>
                </Button>
              </div>
            </div>

            <div className='border-t border-blue-100 p-4'>
              <Button
                type='button'
                variant='ghost'
                onClick={handleSignOut}
                disabled={isSigningOut}
                className='w-full justify-start rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              >
                <LogOut className='h-4 w-4' />
                {isSigningOut ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
