"use client";

import { SupportCenterContent } from "@/components/support/SupportCenterContent";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const STAFF_REDIRECT: Record<string, string> = {
  SUPER_ADMIN: "/dashboard/superadmin/support",
  ADMIN: "/dashboard/admin/support",
};

export default function HelpCenterPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role) {
      const redirect = STAFF_REDIRECT[user.role.toUpperCase()];
      if (redirect) {
        router.replace(redirect);
      }
    }
  }, [isLoading, user, router]);

  return (
    <div className='min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eef7ff_34%,#f8fbfd_100%)] py-10 sm:py-12'>
      <div className='container mx-auto max-w-7xl px-4'>
        <SupportCenterContent ordersHref='/dashboard/customer/results' />
      </div>
    </div>
  );
}
