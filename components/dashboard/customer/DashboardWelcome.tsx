"use client";

import { NotificationsBell } from "@/components/notifications/NotificationsBell";
import { Button } from "@/components/ui/button";
import { useCartSidebar } from "@/lib/cart-sidebar-context";
import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { useCartStore } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  ClipboardList,
  MapPinned,
  Menu,
  Search,
  ShieldCheck,
  ShoppingCart,
  UserRoundCheck,
} from "lucide-react";
import Link from "next/link";
import { CustomerAvatar } from "./CustomerAvatar";
import { useCustomerPanel } from "./CustomerPanelContext";
import {
  buildCustomerName,
  formatMemberSince,
  getProfileReadinessPercent,
} from "./dashboard-helpers";

function formatAccountStatus(status?: string) {
  const normalized = status?.trim().toUpperCase() || "ACTIVE";

  return normalized
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getAccountStatusClasses(status?: string) {
  const normalized = status?.trim().toUpperCase() || "ACTIVE";

  if (normalized === "ACTIVE") {
    return "border-emerald-100 bg-emerald-50/80 text-emerald-700";
  }

  if (normalized === "DISABLED") {
    return "border-amber-100 bg-amber-50/80 text-amber-700";
  }

  if (normalized === "BLOCKED") {
    return "border-rose-100 bg-rose-50/80 text-rose-700";
  }

  return "border-blue-100 bg-white/85 text-slate-950";
}

export function DashboardWelcome({
  viewer,
  isPanelHidden: isPanelHiddenProp,
  onTogglePanel: onTogglePanelProp,
}: {
  viewer: CustomerDashboardViewer;
  isPanelHidden?: boolean;
  onTogglePanel?: () => void;
}) {
  const name = buildCustomerName(viewer);
  const readiness = getProfileReadinessPercent(viewer);
  const { openCart } = useCartSidebar();
  const cartCount = useCartStore((state) => state.getItemCount());
  const panelContext = useCustomerPanel();
  const isPanelHidden =
    panelContext?.isPanelHidden ?? isPanelHiddenProp ?? false;
  const onTogglePanel =
    panelContext?.togglePanel ?? onTogglePanelProp ?? (() => {});

  return (
    <section className='overflow-hidden rounded-xl border border-blue-100 bg-white shadow-lg shadow-blue-100/25 sm:rounded-2xl'>
      <div className='grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(240px,300px)] 2xl:grid-cols-[minmax(0,1fr)_320px]'>
        <div className='relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 sm:p-5 md:p-6 xl:p-7'>
          <div className='pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-200/30 blur-3xl' />
          <div className='pointer-events-none absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-blue-200/30 blur-3xl' />
          <div className='flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between'>
            <div className='min-w-0'>
              <p className='relative text-xs font-bold uppercase tracking-[0.18em] text-blue-600'>
                Medical record dashboard
              </p>
              <h1 className='relative mt-3 break-words text-2xl font-extrabold tracking-normal text-slate-950 sm:text-3xl lg:text-[2rem]'>
                {name}
              </h1>
              <p className='relative mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base lg:text-sm xl:text-base'>
                Review orders, requisitions, results, appointments, and patient
                profile readiness from one secure portal.
              </p>
            </div>

            <Link
              href='/dashboard/customer/profile'
              aria-label='Open profile'
              className='relative block h-14 w-14 shrink-0 self-start shadow-lg shadow-blue-100/60'
            >
              <CustomerAvatar
                viewer={viewer}
                className='h-14 w-14 rounded-xl'
              />
            </Link>
          </div>

          <div className='mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
            <div className='rounded-xl border border-blue-100 bg-white/85 px-3 py-3 shadow-sm sm:px-4'>
              <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'>
                <UserRoundCheck className='h-4 w-4 text-teal-600' />
                Profile
              </div>
              <div className='mt-2 flex items-center justify-between gap-3'>
                <p className='text-sm font-semibold text-slate-950'>
                  {readiness}% complete
                </p>
                {readiness < 100 ? (
                  <Link
                    href='/dashboard/customer/profile'
                    className='shrink-0 text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline'
                  >
                    Complete now
                  </Link>
                ) : null}
              </div>
              <div className='mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100'>
                <div
                  className='h-full rounded-full bg-gradient-to-r from-blue-600 to-teal-500'
                  style={{ width: `${readiness}%` }}
                />
              </div>
            </div>
            <div className='rounded-xl border border-blue-100 bg-white/85 px-3 py-3 shadow-sm sm:px-4'>
              <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'>
                <CalendarDays className='h-4 w-4 text-cyan-600' />
                Member
              </div>
              <p className='mt-2 text-sm font-semibold text-slate-950'>
                {formatMemberSince(viewer.createdAt)}
              </p>
            </div>
            <div
              className={cn(
                "rounded-xl border px-3 py-3 shadow-sm sm:px-4 sm:col-span-2 xl:col-span-1",
                getAccountStatusClasses(viewer.status),
              )}
            >
              <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'>
                <ShieldCheck className='h-4 w-4 text-current' />
                Account status
              </div>
              <p className='mt-2 text-sm font-semibold'>
                {formatAccountStatus(viewer.status)}
              </p>
            </div>
          </div>
        </div>

        <div className='border-t border-blue-100 bg-white p-4 sm:p-5 lg:border-l lg:border-t-0'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
                Quick actions
              </p>
              <p className='mt-1 text-sm font-medium text-slate-950'>
                Orders and alerts
              </p>
            </div>
            <div className='flex items-center gap-1.5'>
              <button
                type='button'
                onClick={openCart}
                className='relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
                aria-label={
                  cartCount > 0 ? `Open cart, ${cartCount} items` : "Open cart"
                }
              >
                <ShoppingCart className='h-4 w-4' />
                {cartCount > 0 && (
                  <span className='absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold leading-none text-white'>
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
              <NotificationsBell />
              <button
                type='button'
                onClick={onTogglePanel}
                aria-label={
                  isPanelHidden
                    ? "Show dashboard panel"
                    : "Hide dashboard panel"
                }
                aria-controls='customer-dashboard-panel'
                aria-expanded={!isPanelHidden}
                title={
                  isPanelHidden
                    ? "Show dashboard panel"
                    : "Hide dashboard panel"
                }
                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
              >
                <Menu className='h-4 w-4' />
              </button>
            </div>
          </div>

          <div className='mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1'>
            <Button
              asChild
              className='h-11 w-full justify-start bg-blue-700 shadow-md shadow-blue-100 hover:bg-blue-800'
            >
              <Link href='/tests'>
                <Search className='h-4 w-4' />
                Browse Tests
              </Link>
            </Button>
            <Button
              asChild
              variant='outline'
              className='h-11 w-full justify-start border-blue-200 hover:bg-blue-50 hover:text-blue-700'
            >
              <Link href='/find-lab-center'>
                <MapPinned className='h-4 w-4' />
                Find Lab Center
              </Link>
            </Button>
            <Button
              asChild
              variant='ghost'
              className='h-11 w-full justify-start hover:bg-blue-50 hover:text-blue-700 sm:col-span-3 lg:col-span-1'
            >
              <Link href='/dashboard/customer/orders'>
                <ClipboardList className='h-4 w-4' />
                View Orders
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
