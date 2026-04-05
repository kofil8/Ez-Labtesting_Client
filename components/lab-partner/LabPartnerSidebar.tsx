"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Menu, TestTube2, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard/lab-partner",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Test Catalog",
        href: "/dashboard/lab-partner/tests",
        icon: TestTube2,
      },
    ],
  },
];

export function LabPartnerSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className='fixed left-3 top-3 z-50 sm:left-4 sm:top-4 lg:hidden'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='h-10 w-10 bg-background shadow-lg'
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
          className='fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-56 transform border-r border-gray-200 bg-background transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className='flex h-full flex-col'>
          {/* Logo/Header */}
          <div className='border-b border-gray-200 p-4'>
            <Link
              href='/dashboard/lab-partner'
              className='flex items-center space-x-2'
            >
              <TestTube2 className='h-6 w-6 text-primary' />
              <span className='text-lg font-bold'>Lab Partner</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className='flex-1 space-y-2 overflow-y-auto p-4'>
            {navItems.map((section) => (
              <div key={section.title} className='space-y-2'>
                <h3 className='px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                  {section.title}
                </h3>
                <div className='space-y-1'>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href}>
                        <button
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-gray-100 hover:text-foreground",
                          )}
                        >
                          <div className='flex items-center space-x-3'>
                            <Icon className='h-4 w-4' />
                            <span>{item.title}</span>
                          </div>
                        </button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer Info */}
          <div className='border-t border-gray-200 p-4 text-xs text-muted-foreground'>
            <p>Lab Partner Portal</p>
            <p className='mt-1'>Read-only access to test catalog</p>
          </div>
        </div>
      </div>
    </>
  );
}
