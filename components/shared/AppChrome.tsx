"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { useRestrictionStatus } from "@/lib/context/RestrictionStatusContext";
import { RESTRICTED_LOCATION_BANNER } from "@/lib/restrictions/presentation";
import { AlertTriangle } from "lucide-react";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSiteHeader = pathname?.startsWith("/dashboard/customer");
  const { showRestrictionBanner } = useRestrictionStatus();

  return (
    <>
      {!hideSiteHeader && <SiteHeader />}
      {hideSiteHeader && showRestrictionBanner ? (
        <div className='border-b border-red-200 bg-red-50/95 text-red-950 backdrop-blur'>
          <div className='mx-auto flex max-w-[1680px] items-center gap-3 px-4 py-2 text-sm sm:px-6 lg:px-8'>
            <AlertTriangle className='h-4 w-4 shrink-0 text-red-700' />
            <p className='font-medium'>{RESTRICTED_LOCATION_BANNER}</p>
          </div>
        </div>
      ) : null}
      <div id='page-content' className='min-h-screen flex flex-col'>
        {children}
      </div>
    </>
  );
}
