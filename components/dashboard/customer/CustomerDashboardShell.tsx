"use client";

import { useAuth } from "@/lib/auth-context";
import { useRestrictionStatus } from "@/lib/context/RestrictionStatusContext";
import {
  preloadCustomerRoute,
  preloadCustomerRouteData,
  useCustomerDashboardPreloader,
} from "@/lib/dashboard/customer-preload.client";
import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { getRestrictedLocationBannerMessage } from "@/lib/restrictions/presentation";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { CUSTOMER_NAV_ITEMS } from "./customer-navigation";
import { CustomerPanelProvider } from "./CustomerPanelContext";
import { CustomerSidebar } from "./CustomerSidebar";
import { CustomerTopbar } from "./CustomerTopbar";

const CUSTOMER_PANEL_STORAGE_KEY = "customer-dashboard-panel-hidden";

function getInitialPanelState() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(CUSTOMER_PANEL_STORAGE_KEY) === "true";
}

export function CustomerDashboardShell({
  children,
  viewer,
}: {
  children: React.ReactNode;
  viewer?: CustomerDashboardViewer | null;
}) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { showRestrictionBanner, status } = useRestrictionStatus();
  const [isSigningOut, startSignOutTransition] = useTransition();
  const [isPanelHidden, setIsPanelHidden] = useState(getInitialPanelState);
  const displayUser = viewer ?? user ?? null;
  const preloadUserId = displayUser?.id;
  const preloadRoutes = useMemo(
    () => CUSTOMER_NAV_ITEMS.map(({ href }) => href),
    [],
  );

  useCustomerDashboardPreloader({
    userId: preloadUserId,
    routes: preloadRoutes,
  });

  const handlePreloadRoute = useCallback(
    (href: string) => {
      preloadCustomerRoute(router, href);
      preloadCustomerRouteData(preloadUserId, href);
    },
    [preloadUserId, router],
  );

  const handleLogout = () => {
    startSignOutTransition(() => {
      void (async () => {
        await logout();
        router.push("/");
      })();
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(
      CUSTOMER_PANEL_STORAGE_KEY,
      String(isPanelHidden),
    );
  }, [isPanelHidden]);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }, []);

  return (
    <div className='min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/20 text-slate-950'>
      <a
        href='#customer-dashboard-main'
        className='fixed left-4 top-4 z-[9999] -translate-y-20 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg transition focus:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400'
      >
        Skip to dashboard content
      </a>
      <div className='mx-auto flex min-h-screen w-full max-w-[1680px]'>
        <CustomerPanelProvider
          isPanelHidden={isPanelHidden}
          togglePanel={() => setIsPanelHidden((current) => !current)}
        >
          <div className='flex min-w-0 flex-1 flex-col'>
            <CustomerTopbar
              viewer={displayUser}
              onSignOut={handleLogout}
              isSigningOut={isSigningOut}
              onPreloadRoute={handlePreloadRoute}
            />

            {showRestrictionBanner ? (
              <div className='border-y border-red-200 bg-red-50/95 text-red-950 backdrop-blur'>
                <div className='mx-auto flex w-full max-w-[1320px] items-start justify-center gap-3 px-3 py-2 text-center text-sm sm:items-center sm:px-4 md:px-5 lg:px-6 xl:px-7'>
                  <AlertTriangle className='h-4 w-4 shrink-0 text-red-700' />
                  <p className='min-w-0 break-words font-medium leading-snug'>
                    {getRestrictedLocationBannerMessage(status)}
                  </p>
                </div>
              </div>
            ) : null}

            <main
              id='customer-dashboard-main'
              tabIndex={-1}
              className='mx-auto w-full min-w-0 max-w-[1320px] flex-1 scroll-mt-24 px-3 py-3 outline-none sm:px-4 sm:py-4 md:px-5 lg:px-6 lg:py-5 xl:px-7 xl:py-6'
            >
              {children}
            </main>
          </div>
        </CustomerPanelProvider>

        {!isPanelHidden && (
          <div
            id='customer-dashboard-panel-spacer'
            className='hidden w-[clamp(13.75rem,20vw,15.5rem)] shrink-0 lg:block xl:w-[clamp(15rem,18vw,17.5rem)]'
            aria-hidden='true'
          />
        )}

        {!isPanelHidden && (
          <CustomerSidebar
            viewer={displayUser}
            onSignOut={handleLogout}
            isSigningOut={isSigningOut}
            isPanelHidden={isPanelHidden}
            onTogglePanel={() => setIsPanelHidden(true)}
            onPreloadRoute={handlePreloadRoute}
          />
        )}
      </div>
    </div>
  );
}
