"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Lock, ShoppingBag, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

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
      icon: <User className="w-4 h-4" />,
    },
    {
      label: "Orders",
      href: "/results",
      icon: <ShoppingBag className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-full md:w-64">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "default" : "ghost"}
              className="w-full justify-start"
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          </Link>
        ))}

        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            <span className="ml-2">Sign Out</span>
          </Button>
        </div>
      </nav>
    </aside>
  );
}

