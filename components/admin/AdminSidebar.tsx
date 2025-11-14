'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, TestTube2, Users, Settings, Home } from 'lucide-react'

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Test Management',
    href: '/admin/tests',
    icon: TestTube2,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r bg-muted/40 p-6">
      <div className="mb-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">Kevin Lab</span>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">Admin Panel</p>
      </div>

      <nav className="space-y-2">
        <Link
          href="/"
          className={cn(
            'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent',
            'text-muted-foreground'
          )}
        >
          <Home className="h-4 w-4" />
          <span>Back to Site</span>
        </Link>

        <div className="pt-4 border-t">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

