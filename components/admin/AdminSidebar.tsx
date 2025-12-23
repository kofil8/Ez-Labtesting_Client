"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  LayoutDashboard,
  Menu,
  Package,
  ShoppingCart,
  TestTube2,
  Ticket,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Content Management",
    items: [
      {
        title: "Tests",
        href: "/admin/tests",
        icon: TestTube2,
      },
      {
        title: "Test Panels",
        href: "/admin/panels",
        icon: Package,
      },
      {
        title: "Promo Codes",
        href: "/admin/promo-codes",
        icon: Ticket,
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className='lg:hidden fixed top-3 sm:top-4 left-3 sm:left-4 z-50'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='bg-background h-10 w-10 shadow-lg'
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className='h-4 w-4' />
          ) : (
            <Menu className='h-4 w-4' />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-screen w-64 border-r bg-card p-6 z-40 transition-transform duration-300 overflow-y-auto",
          "lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Branding */}
        <div className='mb-8'>
          <Link href='/' className='flex items-center gap-2 group'>
            <span className='text-xl font-bold text-gradient-medical'>
              Ez LabTesting
            </span>
          </Link>
          <p className='text-xs text-muted-foreground mt-1 font-medium'>
            Admin Panel
          </p>
        </div>

        <nav className='space-y-6'>
          {/* Back to Site Link */}
          <Link
            href='/'
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Home className='h-4 w-4' />
            <span>Back to Site</span>
          </Link>

          <div className='border-t pt-4'>
            {/* Navigation Groups */}
            {navItems.map((group) => (
              <div key={group.title} className='mb-6'>
                {/* Group Header */}
                <div className='px-3 mb-2'>
                  <h3 className='text-xs font-bold text-muted-foreground uppercase tracking-wider'>
                    {group.title}
                  </h3>
                </div>

                {/* Group Items */}
                <div className='space-y-1'>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/admin" &&
                        pathname.startsWith(item.href + "/"));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all",
                          isActive
                            ? "bg-primary/10 text-primary border-l-4 border-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 flex-shrink-0 transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
