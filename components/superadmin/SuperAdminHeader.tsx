"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { SuperAdminProfileDropdown } from "./SuperAdminProfileDropdown";

interface SuperAdminHeaderProps {
  user?: {
    email: string;
    firstName?: string;
    lastName?: string;
  } | null;
  onLogout?: () => void;
}

export function SuperAdminHeader({ user, onLogout }: SuperAdminHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userInitial = user?.email?.charAt(0).toUpperCase() || "S";
  const fullName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.email || "Admin";

  return (
    <>
      {/* Header */}
      <header className='fixed top-0 right-0 left-0 z-30 border-b bg-card/50 backdrop-blur-sm lg:left-64 xl:left-64'>
        <div className='flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
          {/* Left side - Title/Breadcrumb (can be added later) */}
          <div className='flex-1' />

          {/* Right side - Profile */}
          <div className='flex items-center gap-4'>
            {/* Profile Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className='flex h-10 w-10 items-center justify-center rounded-full border border-border bg-gradient-to-br from-blue-600 to-cyan-500 font-semibold text-white shadow-sm transition-all hover:shadow-md hover:scale-105 active:scale-95'
              title={fullName}
              aria-label='Open profile menu'
            >
              {userInitial}
            </button>

            {/* Notifications/Actions (optional) */}
            {onLogout && (
              <Button
                variant='ghost'
                size='icon'
                onClick={onLogout}
                className='rounded-full text-muted-foreground hover:bg-muted hover:text-foreground'
                title='Logout'
                aria-label='Logout'
              >
                <LogOut className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Profile Dropdown */}
      <SuperAdminProfileDropdown
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={onLogout}
      />
    </>
  );
}
