"use client";

import { NotificationsBell } from "@/components/notifications/NotificationsBell";
import { Button } from "@/components/ui/button";
import { useCartSidebar } from "@/lib/cart-sidebar-context";
import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { useCartStore } from "@/lib/store/cart-store";
import { FlaskConical, LogOut, Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CUSTOMER_NAV_ITEMS, isCustomerNavActive } from "./customer-navigation";
import { CustomerAvatar } from "./CustomerAvatar";
import { CustomerNavLinks } from "./CustomerNavLinks";

export function CustomerTopbar({
  viewer,
  onSignOut,
  isSigningOut,
  onPreloadRoute,
}: {
  viewer?: CustomerDashboardViewer | null;
  onSignOut: () => void;
  isSigningOut: boolean;
  onPreloadRoute: (href: string) => void;
}) {
  const pathname = usePathname();
  const { openCart } = useCartSidebar();
  const cartCount = useCartStore((state) => state.getItemCount());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const activeNavItem =
    CUSTOMER_NAV_ITEMS.find(({ href }) =>
      isCustomerNavActive(pathname, href),
    ) || CUSTOMER_NAV_ITEMS[0];
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

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    closeButtonRef.current?.focus();
    const menuButton = menuButtonRef.current;

    const getFocusableElements = () => {
      if (!dialogRef.current) return [];

      return Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled"));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      menuButton?.focus();
    };
  }, [isMenuOpen]);

  const handleSignOut = () => {
    setIsMenuOpen(false);
    onSignOut();
  };

  const handleOpenCart = () => {
    setIsMenuOpen(false);
    openCart();
  };

  return (
    <>
      <header className='sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden'>
        <div className='flex items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4'>
          <button
            ref={menuButtonRef}
            type='button'
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label={
              isMenuOpen ? "Close dashboard menu" : "Open dashboard menu"
            }
            aria-controls='customer-mobile-dashboard-menu'
            aria-expanded={isMenuOpen}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
          >
            {isMenuOpen ? (
              <X className='h-5 w-5' />
            ) : (
              <Menu className='h-5 w-5' />
            )}
          </button>

          <Link
            href='/dashboard/customer'
            onMouseEnter={() => onPreloadRoute("/dashboard/customer")}
            onFocus={() => onPreloadRoute("/dashboard/customer")}
            onTouchStart={() => onPreloadRoute("/dashboard/customer")}
            className='flex min-w-0 flex-1 items-center gap-2'
          >
            <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-700 via-cyan-600 to-teal-600 text-white shadow-sm'>
              <FlaskConical className='h-4 w-4' />
            </span>
            <span className='min-w-0'>
              <span className='block truncate text-sm font-semibold text-slate-950'>
                Ez LabTesting
              </span>
              <span className='block text-xs text-slate-500'>Dashboard</span>
            </span>
          </Link>

          <div className='flex shrink-0 items-center gap-1.5 sm:gap-2'>
            <NotificationsBell />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={handleOpenCart}
              className='group relative h-10 w-10 shrink-0 rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950 sm:h-11 sm:w-11'
              aria-label={
                cartCount > 0 ? `Open cart, ${cartCount} items` : "Open cart"
              }
            >
              <ShoppingCart className='h-5 w-5 transition-transform group-hover:scale-105' />
              {cartCount > 0 && (
                <span className='absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold leading-none text-white shadow-sm'>
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>
            <Link
              href='/dashboard/customer/profile'
              aria-label='Open profile'
              onMouseEnter={() => onPreloadRoute("/dashboard/customer/profile")}
              onFocus={() => onPreloadRoute("/dashboard/customer/profile")}
              onTouchStart={() => onPreloadRoute("/dashboard/customer/profile")}
              className='block h-9 w-9 shrink-0'
            >
              <CustomerAvatar viewer={viewer} className='h-9 w-9 rounded-lg' />
            </Link>
          </div>
        </div>

        <button
          type='button'
          onClick={() => setIsMenuOpen(true)}
          onMouseEnter={() => onPreloadRoute(activeNavItem.href)}
          onFocus={() => onPreloadRoute(activeNavItem.href)}
          onTouchStart={() => onPreloadRoute(activeNavItem.href)}
          className='group flex w-full items-center justify-between border-t border-slate-200 px-3 py-2 text-left sm:px-4'
          aria-label='Open dashboard menu'
          aria-controls='customer-mobile-dashboard-menu'
          aria-expanded={isMenuOpen}
        >
          <span className='inline-flex min-w-0 items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700'>
            <ActiveIcon className='h-4 w-4 shrink-0' />
            <span className='truncate'>{activeNavItem.label}</span>
          </span>
          <span className='flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-slate-600 transition-colors group-hover:bg-slate-200'>
            <Menu className='h-3.5 w-3.5' />
            <span className='hidden sm:inline'>Menu</span>
          </span>
        </button>
      </header>

      {isMenuOpen && (
        <div className='lg:hidden'>
          <button
            type='button'
            aria-label='Close dashboard menu'
            className='fixed inset-0 z-[90] bg-slate-950/50 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in'
            onClick={() => setIsMenuOpen(false)}
          />
          <aside
            ref={dialogRef}
            id='customer-mobile-dashboard-menu'
            role='dialog'
            aria-modal='true'
            aria-label='Dashboard menu'
            className='fixed inset-y-0 left-0 z-[100] flex w-[min(22rem,calc(100vw-1.5rem))] flex-col overflow-y-auto border-r border-slate-200 bg-white shadow-2xl shadow-slate-900/20 motion-safe:animate-in motion-safe:slide-in-from-left-4'
          >
            <div className='flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-4'>
              <Link
                href='/dashboard/customer'
                className='flex min-w-0 items-center gap-3'
                onMouseEnter={() => onPreloadRoute("/dashboard/customer")}
                onFocus={() => onPreloadRoute("/dashboard/customer")}
                onTouchStart={() => onPreloadRoute("/dashboard/customer")}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 via-cyan-600 to-teal-600 text-white shadow-md shadow-blue-100'>
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
                ref={closeButtonRef}
                type='button'
                onClick={() => setIsMenuOpen(false)}
                aria-label='Close dashboard menu'
                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-4'>
              <Link
                href='/dashboard/customer/profile'
                className='flex items-center gap-3 rounded-xl bg-white/80 p-3 shadow-sm'
                onMouseEnter={() =>
                  onPreloadRoute("/dashboard/customer/profile")
                }
                onFocus={() => onPreloadRoute("/dashboard/customer/profile")}
                onTouchStart={() =>
                  onPreloadRoute("/dashboard/customer/profile")
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <CustomerAvatar
                  viewer={viewer}
                  className='h-11 w-11 rounded-xl'
                />
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
                Navigation
              </p>
              <div className='mt-3'>
                <CustomerNavLinks
                  mobile
                  onNavigate={() => setIsMenuOpen(false)}
                  onPreloadRoute={onPreloadRoute}
                  viewer={viewer}
                />
              </div>

              <p className='mt-6 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
                Quick actions
              </p>
              <div className='mt-3 grid gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleOpenCart}
                  className='w-full justify-start border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                >
                  <ShoppingCart className='h-4 w-4' />
                  Cart
                  {cartCount > 0 && (
                    <span className='ml-auto rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white'>
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Button>
                <Button
                  asChild
                  className='w-full bg-blue-700 hover:bg-blue-800'
                >
                  <Link
                    href='/dashboard/customer/orders'
                    onMouseEnter={() =>
                      onPreloadRoute("/dashboard/customer/orders")
                    }
                    onFocus={() => onPreloadRoute("/dashboard/customer/orders")}
                    onTouchStart={() =>
                      onPreloadRoute("/dashboard/customer/orders")
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    View Orders
                  </Link>
                </Button>
              </div>
            </div>

            <div className='border-t border-slate-200 p-4'>
              <Button
                type='button'
                variant='ghost'
                onClick={handleSignOut}
                disabled={isSigningOut}
                className='w-full justify-start rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-950'
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
