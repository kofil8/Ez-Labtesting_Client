"use client";

import { usePushRegister } from "@/hook/usePushRegister";
import { useAuth } from "@/lib/auth-context";

export function DashboardPushRegistration() {
  const { user, token, isAuthenticated, isLoading } = useAuth();

  const userId = user?.id ? String(user.id) : undefined;
  const canRegister = !isLoading && isAuthenticated && !!userId;

  usePushRegister(canRegister ? userId : undefined, token ?? undefined);

  return null;
}
