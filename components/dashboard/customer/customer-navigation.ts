import {
  FileCheck2,
  LayoutDashboard,
  LifeBuoy,
  PackageCheck,
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
  { href: "/profile/orders", label: "Orders", icon: PackageCheck },
  { href: "/results", label: "Results", icon: FileCheck2 },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/profile/security", label: "Security", icon: ShieldCheck },
  { href: "/help-center", label: "Support", icon: LifeBuoy },
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
