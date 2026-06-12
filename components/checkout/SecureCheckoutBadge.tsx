"use client";

import { SecurityBadge } from "@/components/shared/SecurityBadge";

export default function SecureCheckoutBadge({ compact = true }: { compact?: boolean }) {
  return <SecurityBadge variant={compact ? "compact" : "full"} />;
}
