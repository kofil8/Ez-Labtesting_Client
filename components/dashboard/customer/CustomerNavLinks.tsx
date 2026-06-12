"use client";

import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CUSTOMER_DASHBOARD_NAV_ITEMS,
  CUSTOMER_SHOPPING_NAV_ITEMS,
  isCustomerNavActive,
} from "./customer-navigation";
import { CustomerAvatar } from "./CustomerAvatar";

interface CustomerNavLinksProps {
  collapsed?: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
  onPreloadRoute: (href: string) => void;
  viewer?: CustomerDashboardViewer | null;
}

const SECTION_LABEL_STYLES =
  "px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500";

export function CustomerNavLinks({
  collapsed = false,
  mobile = false,
  onNavigate,
  onPreloadRoute,
  viewer,
}: CustomerNavLinksProps) {
  const pathname = usePathname();

  const linkStyles = mobile
    ? "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  return (
    <div className='space-y-5'>
      <section>
        {!collapsed ? <p className={SECTION_LABEL_STYLES}>Dashboard</p> : null}
        <nav className={cn("mt-2 grid gap-1.5", collapsed && "mt-0")}>
          {CUSTOMER_DASHBOARD_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isCustomerNavActive(pathname, href);
            const isProfileItem = href === "/dashboard/customer/profile";

            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => onPreloadRoute(href)}
                onFocus={() => onPreloadRoute(href)}
                onTouchStart={() => onPreloadRoute(href)}
                onClick={onNavigate}
                className={cn(
                  linkStyles,
                  collapsed && !mobile && "justify-center px-0",
                  active
                    ? "border-blue-800 bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-md shadow-blue-100"
                    : mobile
                      ? "border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                )}
              >
                {isProfileItem ? (
                  <CustomerAvatar
                    viewer={viewer}
                    className={cn(
                      "h-5 w-5 rounded-md border-current/20",
                      collapsed && !mobile && "h-10 w-10 rounded-lg",
                    )}
                  />
                ) : (
                  <Icon className='h-4 w-4 shrink-0' />
                )}
                {(!collapsed || mobile) && (
                  <span className='truncate'>{label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </section>

      {!collapsed || mobile ? (
        <section>
          <p className={SECTION_LABEL_STYLES}>Shop tests</p>
          <nav className='mt-2 grid gap-1.5'>
            {CUSTOMER_SHOPPING_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = isCustomerNavActive(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => onPreloadRoute(href)}
                  onFocus={() => onPreloadRoute(href)}
                  onTouchStart={() => onPreloadRoute(href)}
                  onClick={onNavigate}
                  className={cn(
                    linkStyles,
                    active
                      ? "border-blue-800 bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-md shadow-blue-100"
                      : mobile
                        ? "border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                  )}
                >
                  <Icon className='h-4 w-4 shrink-0' />
                  <span className='truncate'>{label}</span>
                </Link>
              );
            })}
          </nav>
        </section>
      ) : null}
    </div>
  );
}
