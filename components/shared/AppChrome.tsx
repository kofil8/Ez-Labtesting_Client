"use client";

import { usePathname, useRouter } from "next/navigation";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { useRestrictionStatus } from "@/lib/context/RestrictionStatusContext";
import { isRestrictionBlocked } from "@/lib/restrictions/presentation";
import { useEffect } from "react";

const RESTRICTED_ORDERING_PATHS = [
  "/cart",
  "/checkout",
  "/checkout/patient-info",
  "/checkout/payment",
  "/checkout/confirmation",
];

function isRestrictedOrderingPath(pathname?: string | null) {
  if (!pathname) {
    return false;
  }

  return RESTRICTED_ORDERING_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hideSiteHeader =
    pathname?.startsWith("/dashboard/customer") || pathname === "/login";
  const { publishStatus, status } = useRestrictionStatus();

  useEffect(() => {
    if (!isRestrictionBlocked(status) || !isRestrictedOrderingPath(pathname)) {
      return;
    }

    publishStatus(status, { showBanner: true });
    router.replace("/tests");
  }, [pathname, publishStatus, router, status]);

  return (
    <>
      {!hideSiteHeader && <SiteHeader />}
      <div id='page-content' className='min-h-screen flex flex-col'>
        {children}
      </div>
    </>
  );
}
