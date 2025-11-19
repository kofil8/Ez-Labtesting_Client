'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, TestTube2, Users, Settings, Home, Menu, X, Package, Ticket, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Tests',
    href: '/admin/tests',
    icon: TestTube2,
  },
  {
    title: 'Test Panels',
    href: '/admin/panels',
    icon: Package,
  },
  {
    title: 'Promo Codes',
    href: '/admin/promo-codes',
    icon: Ticket,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-3 sm:top-4 left-3 sm:left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background h-9 w-9 sm:h-10 sm:w-10"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-screen w-56 sm:w-64 border-r bg-muted/40 p-4 sm:p-6 z-40 transition-transform duration-300",
        "lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="mb-6 sm:mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-base sm:text-lg md:text-xl font-bold text-primary">Kevin Lab</span>
          </Link>
          <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-1">Admin Panel</p>
        </div>

        <nav className="space-y-1 sm:space-y-2">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              'flex items-center space-x-2 sm:space-x-3 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:bg-accent',
              'text-muted-foreground'
            )}
          >
            <Home className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Back to Site</span>
          </Link>

          <div className="pt-3 sm:pt-4 border-t">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-2 sm:space-x-3 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:bg-accent transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{item.title}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}

