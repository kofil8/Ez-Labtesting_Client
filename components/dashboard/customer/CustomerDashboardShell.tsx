"use client";

import { useAuth } from "@/lib/auth-context";
import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
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
  const displayUser = user ?? viewer ?? null;

  const handleLogout = () => {
    startSignOutTransition(() => {
      void (async () => {
        await logout();
        router.push("/");
      })();
    });
  };

  return (
    <div className='min-h-screen overflow-x-hidden bg-slate-50 text-slate-950'>
      <div className='mx-auto flex min-h-screen w-full max-w-[1680px]'>
        <CustomerSidebar
          viewer={displayUser}
          onSignOut={handleLogout}
          isSigningOut={isSigningOut}
        />

        <div className='flex min-w-0 flex-1 flex-col'>
          <CustomerTopbar
            viewer={displayUser}
            onSignOut={handleLogout}
            isSigningOut={isSigningOut}
          />

          <main className='mx-auto min-w-0 w-full max-w-[1180px] flex-1 px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 xl:px-8 xl:py-8 2xl:max-w-7xl'>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
