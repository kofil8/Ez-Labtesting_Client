"use client";

import { StaffSupportDashboard } from "@/components/support/StaffSupportDashboard";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

export default function AdminSupportPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (!user) return null;

  return (
    <StaffSupportDashboard roleLabel='Admin Panel' currentUserId={user.id} />
  );
}
