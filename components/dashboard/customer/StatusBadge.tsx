import type { CustomerDashboardOrder } from "@/lib/dashboard/customer.server";
import { cn } from "@/lib/utils";
import { getStatusMeta } from "./dashboard-helpers";

export function StatusBadge({ order }: { order: CustomerDashboardOrder }) {
  const status = getStatusMeta(order);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
        status.tone,
      )}
    >
      {status.label}
    </span>
  );
}
