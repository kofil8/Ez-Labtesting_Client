import type {
  CustomerDashboardOrder,
  CustomerDashboardViewer,
} from "@/lib/dashboard/customer.server";

const TERMINAL_STATUSES = new Set([
  "COMPLETED",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
  "LAB_SUBMISSION_FAILED_FINAL",
]);

const ATTENTION_STATUSES = new Set([
  "FAILED",
  "CANCELLED",
  "LAB_SUBMISSION_FAILED_RETRYABLE",
  "LAB_SUBMISSION_FAILED_FINAL",
  "MANUAL_REVIEW",
  "REFUND_PENDING",
]);

export type ProfileChecklistItem = {
  label: string;
  ready: boolean;
  href: string;
  helper: string;
};

export type NextClinicalAction =
  | {
      type: "result";
      eyebrow: string;
      title: string;
      description: string;
      primaryHref: string;
      primaryLabel: string;
      secondaryHref?: string;
      secondaryLabel?: string;
      externalHref?: string;
      externalLabel?: string;
      order?: CustomerDashboardOrder;
    }
  | {
      type: "track" | "requisition" | "profile" | "browse";
      eyebrow: string;
      title: string;
      description: string;
      primaryHref: string;
      primaryLabel: string;
      secondaryHref?: string;
      secondaryLabel?: string;
      externalHref?: string;
      externalLabel?: string;
      order?: CustomerDashboardOrder;
    };

export type OrderActivityPoint = {
  label: string;
  orders: number;
  results: number;
};

export type OrderStatusSlice = {
  name: string;
  value: number;
  color: string;
};

export type SuggestedLabVisit = {
  date: Date;
  orderNumber: string;
  testName: string;
} | null;

export function buildCustomerName(
  viewer?: CustomerDashboardViewer | null,
  fallback = "Customer",
) {
  const name = [viewer?.firstName, viewer?.lastName]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(" ");

  return name || fallback;
}

export function buildInitials(
  firstName?: string,
  lastName?: string,
  email?: string,
) {
  const source = [firstName, lastName]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(" ");

  if (source) {
    return source
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");
  }

  return email?.charAt(0).toUpperCase() || "C";
}

export function formatMemberSince(createdAt?: string) {
  if (!createdAt) {
    return "New member";
  }

  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) {
    return "New member";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function formatSafeDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export function formatCompactDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parsed);
}

export function getOrderHref(order: CustomerDashboardOrder) {
  return `/dashboard/customer/results/${order.id}`;
}

export function isResultsReady(order: CustomerDashboardOrder) {
  return order.status.toUpperCase() === "COMPLETED";
}

export function isAttentionOrder(order: CustomerDashboardOrder) {
  const status = order.status.toUpperCase();
  return order.manualReviewRequired || ATTENTION_STATUSES.has(status);
}

export function isOpenOrder(order: CustomerDashboardOrder) {
  return !TERMINAL_STATUSES.has(order.status.toUpperCase());
}

export function sortOrdersByNewest(orders: CustomerDashboardOrder[]) {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getLatestResult(orders: CustomerDashboardOrder[]) {
  return sortOrdersByNewest(orders.filter(isResultsReady))[0] ?? null;
}

export function getActiveOrder(orders: CustomerDashboardOrder[]) {
  return (
    sortOrdersByNewest(orders).find(
      (order) => isOpenOrder(order) && !isAttentionOrder(order),
    ) ?? null
  );
}

export function getStatusMeta(order: CustomerDashboardOrder) {
  const status = order.status.toUpperCase();

  if (status === "COMPLETED") {
    return {
      label: "Results ready",
      helper: "Final report is available",
      tone: "border-teal-200 bg-teal-50 text-teal-700",
      dot: "bg-teal-500",
    };
  }

  if (order.manualReviewRequired || ATTENTION_STATUSES.has(status)) {
    return {
      label: status === "CANCELLED" ? "Cancelled" : "Needs attention",
      helper: "Support or review may be needed",
      tone: "border-rose-200 bg-rose-50 text-rose-700",
      dot: "bg-rose-500",
    };
  }

  if (status === "LAB_ORDER_PLACED") {
    return {
      label: "Ready for lab visit",
      helper: "Requisition is ready",
      tone: "border-blue-200 bg-blue-50 text-blue-700",
      dot: "bg-blue-500",
    };
  }

  if (
    status === "PAID" ||
    status === "LAB_SUBMISSION_PENDING" ||
    status === "LAB_SUBMISSION_RETRYING" ||
    status === "IN_PROCESSING"
  ) {
    return {
      label: "In progress",
      helper: "Order is being prepared",
      tone: "border-cyan-200 bg-cyan-50 text-cyan-700",
      dot: "bg-cyan-500",
    };
  }

  if (status === "REFUNDED") {
    return {
      label: "Refunded",
      helper: "Payment has been returned",
      tone: "border-slate-200 bg-slate-100 text-slate-700",
      dot: "bg-slate-400",
    };
  }

  if (status === "PENDING_PAYMENT") {
    return {
      label: "Pending payment",
      helper: "Checkout is not complete",
      tone: "border-slate-200 bg-slate-100 text-slate-700",
      dot: "bg-slate-400",
    };
  }

  return {
    label: status.replace(/_/g, " ").toLowerCase(),
    helper: "Order status updated",
    tone: "border-slate-200 bg-slate-100 text-slate-700",
    dot: "bg-slate-400",
  };
}

export function getOrderProgressStep(order?: CustomerDashboardOrder | null) {
  if (!order) {
    return 0;
  }

  const status = order.status.toUpperCase();
  if (status === "COMPLETED") return 4;
  if (status === "LAB_ORDER_PLACED") return 3;
  if (
    status === "PAID" ||
    status === "LAB_SUBMISSION_PENDING" ||
    status === "LAB_SUBMISSION_RETRYING" ||
    status === "IN_PROCESSING"
  ) {
    return 2;
  }
  return 1;
}

export function buildProfileChecklist(
  viewer: CustomerDashboardViewer,
): ProfileChecklistItem[] {
  const hasPhone = Boolean(viewer.phone || viewer.phoneNumber);
  const hasDob = Boolean(viewer.dateOfBirth);
  const hasAddress = Boolean(
    viewer.address ||
      viewer.addressLine1 ||
      viewer.addressLine2 ||
      viewer.city ||
      viewer.state ||
      viewer.zipCode,
  );

  return [
    {
      label: "Contact phone",
      ready: hasPhone,
      href: "/dashboard/customer/profile",
      helper: "Used for order and support follow-up.",
    },
    {
      label: "Date of birth",
      ready: hasDob,
      href: "/dashboard/customer/profile",
      helper: "Needed for patient identity matching.",
    },
    {
      label: "Address",
      ready: hasAddress,
      href: "/dashboard/customer/profile",
      helper: "Helps avoid checkout and billing delays.",
    },
    {
      label: "Two-factor security",
      ready: Boolean(viewer.mfaEnabled),
      href: "/dashboard/customer/security",
      helper: "Recommended for result and account access.",
    },
  ];
}

export function getProfileReadinessPercent(viewer: CustomerDashboardViewer) {
  const checklist = buildProfileChecklist(viewer);
  const readyCount = checklist.filter((item) => item.ready).length;

  return Math.round((readyCount / checklist.length) * 100);
}

export function getDashboardSummary(
  viewer: CustomerDashboardViewer,
  orders: CustomerDashboardOrder[],
) {
  const active = orders.filter(
    (order) => isOpenOrder(order) && !isAttentionOrder(order),
  ).length;
  const attention = orders.filter(isAttentionOrder).length;
  const resultsReady = orders.filter(isResultsReady).length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return {
    totalOrders: orders.length,
    active,
    attention,
    resultsReady,
    profileReadiness: getProfileReadinessPercent(viewer),
    totalSpent,
  };
}

export function getOrderActivityData(orders: CustomerDashboardOrder[]) {
  const today = new Date();
  const buckets = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    date.setHours(0, 0, 0, 0);

    return {
      date,
      label: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
      orders: 0,
      results: 0,
    };
  });

  for (const order of orders) {
    const createdAt = new Date(order.createdAt);
    if (!Number.isNaN(createdAt.getTime())) {
      const match = buckets.find(
        (bucket) => bucket.date.toDateString() === createdAt.toDateString(),
      );
      if (match) {
        match.orders += 1;
      }
    }

    if (isResultsReady(order)) {
      const updatedAt = new Date(order.updatedAt);
      if (!Number.isNaN(updatedAt.getTime())) {
        const match = buckets.find(
          (bucket) => bucket.date.toDateString() === updatedAt.toDateString(),
        );
        if (match) {
          match.results += 1;
        }
      }
    }
  }

  return buckets.map(({ label, orders: orderCount, results }) => ({
    label,
    orders: orderCount,
    results,
  }));
}

export function getOrderStatusDistribution(
  orders: CustomerDashboardOrder[],
): OrderStatusSlice[] {
  const resultsReady = orders.filter(isResultsReady).length;
  const needsAttention = orders.filter(isAttentionOrder).length;
  const active = orders.filter((order) => {
    const status = order.status.toUpperCase();
    return (
      isOpenOrder(order) &&
      !isAttentionOrder(order) &&
      status !== "PENDING_PAYMENT"
    );
  }).length;
  const pendingOther = Math.max(
    0,
    orders.length - resultsReady - needsAttention - active,
  );

  return [
    { name: "Active", value: active, color: "#2563eb" },
    { name: "Results", value: resultsReady, color: "#0891b2" },
    { name: "Attention", value: needsAttention, color: "#e11d48" },
    { name: "Pending/Other", value: pendingOther, color: "#14b8a6" },
  ];
}

export function getSuggestedLabVisit(
  orders: CustomerDashboardOrder[],
): SuggestedLabVisit {
  const readyOrder = sortOrdersByNewest(orders).find(
    (order) => order.status.toUpperCase() === "LAB_ORDER_PLACED",
  );

  if (!readyOrder) {
    return null;
  }

  const sourceDate = new Date(
    readyOrder.labOrderPlacedAt || readyOrder.updatedAt || readyOrder.createdAt,
  );
  if (Number.isNaN(sourceDate.getTime())) {
    return null;
  }

  return {
    date: sourceDate,
    orderNumber: readyOrder.orderNumber,
    testName: readyOrder.primaryTest?.testName || "Lab order",
  };
}

export function getNextClinicalAction(
  viewer: CustomerDashboardViewer,
  orders: CustomerDashboardOrder[],
): NextClinicalAction {
  const latestResult = getLatestResult(orders);
  if (latestResult) {
    return {
      type: "result",
      eyebrow: "Latest clinical action",
      title: "Review your newest lab result",
      description: `${latestResult.primaryTest?.testName || "Your completed lab report"} was updated ${formatSafeDate(latestResult.updatedAt)}.`,
      primaryHref: getOrderHref(latestResult),
      primaryLabel: "View Result",
      secondaryHref: "/dashboard/customer/results",
      secondaryLabel: "All Results",
      externalHref: latestResult.requisitionPdfUrl || undefined,
      externalLabel: latestResult.requisitionPdfUrl ? "Download Requisition" : undefined,
      order: latestResult,
    };
  }

  const activeOrder = getActiveOrder(orders);
  if (activeOrder?.requisitionPdfUrl) {
    return {
      type: "requisition",
      eyebrow: "Ready for lab visit",
      title: "Download your requisition",
      description: `${activeOrder.orderNumber} is ready. Bring the requisition to your selected collection center.`,
      primaryHref: getOrderHref(activeOrder),
      primaryLabel: "Track Order",
      secondaryHref: "/find-lab-center",
      secondaryLabel: "Find Lab Center",
      externalHref: activeOrder.requisitionPdfUrl,
      externalLabel: "Download Requisition",
      order: activeOrder,
    };
  }

  if (activeOrder) {
    const status = getStatusMeta(activeOrder);
    return {
      type: "track",
      eyebrow: "Order in progress",
      title: `Track ${activeOrder.orderNumber}`,
      description: `${status.label}. Latest update: ${formatSafeDate(activeOrder.updatedAt)}.`,
      primaryHref: getOrderHref(activeOrder),
      primaryLabel: "Track Order",
      secondaryHref: "/dashboard/customer/orders",
      secondaryLabel: "All Orders",
      order: activeOrder,
    };
  }

  if (getProfileReadinessPercent(viewer) < 100) {
    return {
      type: "profile",
      eyebrow: "Patient profile",
      title: "Complete your patient record",
      description:
        "Add the remaining patient details to reduce checkout, requisition, and result-access delays.",
      primaryHref: "/dashboard/customer/profile",
      primaryLabel: "Update Profile",
      secondaryHref: "/dashboard/customer/security",
      secondaryLabel: "Security Settings",
    };
  }

  return {
    type: "browse",
    eyebrow: "Plan your next test",
    title: "Browse available lab testing",
    description:
      "Search clinical tests, compare panels, and choose the lab testing path that fits your needs.",
    primaryHref: "/tests",
    primaryLabel: "Browse Tests",
    secondaryHref: "/find-lab-center",
    secondaryLabel: "Find Lab Center",
  };
}
