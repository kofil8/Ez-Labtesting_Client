"use client";

import { SuperAdminHeader } from "@/components/superadmin/SuperAdminHeader";
import { SuperAdminSidebar } from "@/components/superadmin/SuperAdminSidebar";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface SuperAdminLayoutClientProps {
  children: React.ReactNode;
}

export function SuperAdminLayoutClient({
  children,
}: SuperAdminLayoutClientProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logout, router]);

  return (
    <div className='flex min-h-screen'>
      <SuperAdminSidebar />
      <SuperAdminHeader user={user} onLogout={handleLogout} />
      <main
        id='main-content-section'
        className='flex-1 p-3 sm:p-4 md:p-6 lg:p-8 lg:ml-56 xl:ml-64 pt-20 sm:pt-20 lg:pt-20 xl:pt-20'
      >
        {children}
      </main>
    </div>
  );
}
