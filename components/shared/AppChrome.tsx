"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/shared/SiteHeader";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSiteHeader = pathname?.startsWith("/dashboard/customer");

  return (
    <>
      {!hideSiteHeader && <SiteHeader />}
      <div id='page-content' className='min-h-screen flex flex-col'>
        {children}
      </div>
    </>
  );
}
