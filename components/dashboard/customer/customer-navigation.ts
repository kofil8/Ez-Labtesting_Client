import {
  FileCheck2,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  PackageCheck,
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
  { href: "/dashboard/customer/orders", label: "Orders", icon: PackageCheck },
  { href: "/dashboard/customer/results", label: "Results", icon: FileCheck2 },
  { href: "/dashboard/customer/profile", label: "Profile", icon: UserRound },
  {
    href: "/dashboard/customer/transactions",
    label: "Transactions",
    icon: ReceiptText,
  },
  {
    href: "/dashboard/customer/change-password",
    label: "Password",
    icon: Lock,
  },
  {
    href: "/dashboard/customer/security",
    label: "Security",
    icon: ShieldCheck,
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
