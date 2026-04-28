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
]);

export type ProfileChecklistItem = {
  label: string;
  ready: boolean;
  href: string;
  helper: string;
};

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

export function getOrderHref(order: CustomerDashboardOrder) {
  return `/results/${order.id}`;
}

export function isOpenOrder(order: CustomerDashboardOrder) {
  return !TERMINAL_STATUSES.has(order.status.toUpperCase());
}

export function isResultsReady(order: CustomerDashboardOrder) {
  return order.status.toUpperCase() === "COMPLETED";
}

export function sortOrdersByNewest(orders: CustomerDashboardOrder[]) {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getStatusMeta(order: CustomerDashboardOrder) {
  const status = order.status.toUpperCase();

  if (status === "COMPLETED") {
    return {
      label: "Results ready",
      tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (order.manualReviewRequired || ATTENTION_STATUSES.has(status)) {
    return {
      label: status === "CANCELLED" ? "Cancelled" : "Needs attention",
      tone: "border-amber-200 bg-amber-50 text-amber-800",
    };
  }

  if (status === "LAB_ORDER_PLACED") {
    return {
      label: "Ready for lab visit",
      tone: "border-sky-200 bg-sky-50 text-sky-700",
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
      tone: "border-cyan-200 bg-cyan-50 text-cyan-700",
    };
  }

  if (status === "REFUND_PENDING" || status === "REFUNDED") {
    return {
      label: status === "REFUNDED" ? "Refunded" : "Refund pending",
      tone: "border-slate-200 bg-slate-100 text-slate-700",
    };
  }

  if (status === "PENDING_PAYMENT") {
    return {
      label: "Pending payment",
      tone: "border-slate-200 bg-slate-100 text-slate-700",
    };
  }

  return {
    label: status.replace(/_/g, " ").toLowerCase(),
    tone: "border-slate-200 bg-slate-100 text-slate-700",
  };
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
      label: "Contact phone on file",
      ready: hasPhone,
      href: "/profile",
      helper: "Used for order and support follow-up.",
    },
    {
      label: "Date of birth saved",
      ready: hasDob,
      href: "/profile",
      helper: "Needed for patient identity matching.",
    },
    {
      label: "Mailing address saved",
      ready: hasAddress,
      href: "/profile",
      helper: "Helps avoid checkout and billing delays.",
    },
    {
      label: "Two-factor security enabled",
      ready: Boolean(viewer.mfaEnabled),
      href: "/profile/security",
      helper: "Recommended for result and account access.",
    },
  ];
}

export function getProfileReadinessPercent(viewer: CustomerDashboardViewer) {
  const checklist = buildProfileChecklist(viewer);
  const readyCount = checklist.filter((item) => item.ready).length;

  return Math.round((readyCount / checklist.length) * 100);
}
