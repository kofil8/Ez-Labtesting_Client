"use client";

import { SuperAdminProfileCard } from "@/components/superadmin/SuperAdminProfileCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SuperAdminProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className='space-y-8'>
        {/* Header skeleton */}
        <div className='overflow-hidden rounded-3xl border border-slate-200/80 bg-white/92 p-6'>
          <Skeleton className='h-48 w-full rounded-lg' />
        </div>
        {/* Content skeleton */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-48 rounded-2xl' />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold tracking-tight'>My Profile</h1>
        <p className='text-muted-foreground mt-2'>
          Manage your superadmin account settings and information
        </p>
      </div>

      <SuperAdminProfileCard
        user={user}
        onLogout={handleLogout}
        onEdit={() => router.push("/dashboard/customer/profile")}
      />
    </div>
  );
}
