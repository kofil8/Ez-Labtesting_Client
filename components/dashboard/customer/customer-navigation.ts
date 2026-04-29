import {
  FlaskConical,
  FileCheck2,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  MapPinned,
  PackageCheck,
  PanelsTopLeft,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { ComponentType } from "react";

export type CustomerNavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export const CUSTOMER_NAV_ITEMS: CustomerNavItem[] = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
  { href: "/tests", label: "Browse Tests", icon: FlaskConical },
  { href: "/panels", label: "Test Panels", icon: PanelsTopLeft },
  { href: "/find-lab-center", label: "Find Lab Center", icon: MapPinned },
  { href: "/dashboard/customer/orders", label: "Orders", icon: PackageCheck },
  {
    href: "/dashboard/customer/transactions",
    label: "Transactions",
    icon: ReceiptText,
  },
  { href: "/dashboard/customer/results", label: "Results", icon: FileCheck2 },
  { href: "/dashboard/customer/profile", label: "Profile", icon: UserRound },
  {
    href: "/dashboard/customer/security",
    label: "Security",
    icon: ShieldCheck,
  },
  {
    href: "/dashboard/customer/change-password",
    label: "Password",
    icon: Lock,
  },
  { href: "/dashboard/customer/support", label: "Support", icon: LifeBuoy },
];

export function isCustomerNavActive(pathname: string | null, href: string) {
  if (!pathname) {
    return false;
  }

  return (
    pathname === href ||
    (href !== "/dashboard/customer" && pathname.startsWith(`${href}/`))
  );
}
