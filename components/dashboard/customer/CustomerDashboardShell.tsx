"use client";

import { useAuth } from "@/lib/auth-context";
import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CustomerSidebar } from "./CustomerSidebar";
import { CustomerTopbar } from "./CustomerTopbar";

export function CustomerDashboardShell({
  children,
  viewer,
}: {
  children: React.ReactNode;
  viewer?: CustomerDashboardViewer | null;
}) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isSigningOut, startSignOutTransition] = useTransition();
  const [isPanelHidden, setIsPanelHidden] = useState(false);
  const displayUser = viewer ?? user ?? null;

  const handleLogout = () => {
    startSignOutTransition(() => {
      void (async () => {
        await logout();
        router.push("/");
      })();
    });
  };

  return (
    <div className='min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-950'>
      <div className='mx-auto flex min-h-screen w-full max-w-[1680px]'>
        <CustomerSidebar
          viewer={displayUser}
          onSignOut={handleLogout}
          isSigningOut={isSigningOut}
          isPanelHidden={isPanelHidden}
          onTogglePanel={() => setIsPanelHidden((current) => !current)}
        />

        <div
          aria-hidden='true'
          className={cn(
            "hidden shrink-0 lg:block",
            isPanelHidden ? "w-[76px] xl:w-[84px]" : "w-[244px] xl:w-[268px]",
          )}
        />

        <div className='flex min-w-0 flex-1 flex-col'>
          <CustomerTopbar
            viewer={displayUser}
            onSignOut={handleLogout}
            isSigningOut={isSigningOut}
          />

          <main className='mx-auto min-w-0 w-full max-w-[1360px] flex-1 px-3 py-4 sm:px-4 sm:py-5 md:px-5 lg:px-6 lg:py-6 xl:px-7 xl:py-7'>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
