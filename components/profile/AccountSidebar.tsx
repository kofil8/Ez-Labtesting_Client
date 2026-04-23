"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  ChevronRight,
  Lock,
  LogOut,
  ReceiptText,
  Shield,
  ShoppingBag,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function AccountSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems: SidebarItem[] = [
    {
      label: "Profile",
      href: "/profile",
      icon: <User className='w-4 h-4' />,
    },
    {
      label: "Orders",
      href: "/profile/orders",
      icon: <ShoppingBag className='w-4 h-4' />,
    },
    {
      label: "Transactions",
      href: "/profile/transactions",
      icon: <ReceiptText className='w-4 h-4' />,
    },
    {
      label: "Change Password",
      href: "/change-password",
      icon: <Lock className='w-4 h-4' />,
    },
    {
      label: "Security",
      href: "/profile/security",
      icon: <Shield className='w-4 h-4' />,
    },
  ];

  return (
    <aside className='w-full md:w-72'>
      <div className='rounded-[28px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.35)] backdrop-blur'>
        <div className='rounded-[24px] bg-[linear-gradient(135deg,rgba(14,165,233,0.12)_0%,rgba(255,255,255,0.95)_55%,rgba(16,185,129,0.12)_100%)] px-4 py-4'>
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-sky-700'>
            Account
          </p>
          <h2 className='mt-2 text-lg font-semibold text-slate-950'>
            Manage your profile
          </h2>
          <p className='mt-1 text-sm leading-6 text-slate-600'>
            Keep details, orders, payments, and security settings in one place.
          </p>
        </div>

        <nav className='mt-4 space-y-2'>
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center justify-between rounded-[22px] border px-3 py-3 text-sm font-medium transition-all",
                  pathname === item.href
                    ? "border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-100"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white",
                )}
              >
                <div className='flex items-center gap-3'>
                  <span className='flex h-9 w-9 items-center justify-center rounded-2xl bg-white/80 text-current'>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                <ChevronRight className='h-4 w-4' />
              </div>
            </Link>
          ))}

          <div className='mt-4 border-t border-slate-200 pt-4'>
            <Button
              variant='ghost'
              className='w-full justify-start rounded-[22px] border border-slate-200 bg-white px-3 text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 sm:text-base'
              onClick={() => logout()}
            >
              <LogOut className='w-4 h-4 sm:w-5 sm:h-5' />
              <span className='ml-2'>Sign Out</span>
            </Button>
          </div>
        </nav>
      </div>
    </aside>
  );
}
