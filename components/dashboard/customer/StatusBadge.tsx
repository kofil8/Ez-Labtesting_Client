import type { CustomerDashboardOrder } from "@/lib/dashboard/customer.server";
import { cn } from "@/lib/utils";
import { getStatusMeta } from "./dashboard-helpers";

export function StatusBadge({ order }: { order: CustomerDashboardOrder }) {
  const status = getStatusMeta(order);

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
        status.tone,
      )}
    >
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", status.dot)} />
      <span className='truncate'>{status.label}</span>
    </span>
  );
}
