"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Bell, LifeBuoy, LogOut, Settings, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuperAdminProfileDropdownProps {
  user?: {
    email: string;
    firstName?: string;
    lastName?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export function SuperAdminProfileDropdown({
  user,
  isOpen,
  onClose,
  onLogout,
}: SuperAdminProfileDropdownProps) {
  const router = useRouter();

  const fullName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.email || "Admin";

  const userInitial = user?.email?.charAt(0).toUpperCase() || "S";

  const handleLogout = () => {
    onClose();
    onLogout?.();
  };

  const handleNavigation = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md p-0 gap-0 overflow-hidden'>
        {/* Header with gradient background */}
        <div className='bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 px-6 py-8'>
          <div className='flex items-center gap-4'>
            <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm font-bold text-white text-xl shadow-lg'>
              {userInitial}
            </div>
            <div className='min-w-0'>
              <h2 className='truncate text-lg font-semibold text-white'>
                {fullName}
              </h2>
              <p className='truncate text-sm text-white/90'>{user?.email}</p>
              <div className='mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm'>
                <Shield className='h-3 w-3 text-white' />
                <span className='text-xs font-semibold text-white'>
                  Superadmin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='divide-y divide-border'>
          {/* Quick Actions */}
          <div className='p-4 space-y-2'>
            <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5'>
              Quick Actions
            </div>
            <div className='space-y-1'>
              <Button
                variant='ghost'
                className='w-full justify-start gap-3 rounded-lg h-10 hover:bg-muted'
                onClick={() => handleNavigation("/dashboard/superadmin/admins")}
              >
                <Shield className='h-4 w-4 text-blue-600' />
                <span>Manage Admins</span>
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start gap-3 rounded-lg h-10 hover:bg-muted'
                onClick={() =>
                  handleNavigation("/dashboard/superadmin/notifications")
                }
              >
                <Bell className='h-4 w-4 text-amber-500' />
                <span>Notifications</span>
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start gap-3 rounded-lg h-10 hover:bg-muted'
                onClick={() =>
                  handleNavigation("/dashboard/superadmin/system-settings")
                }
              >
                <Settings className='h-4 w-4 text-slate-600' />
                <span>System Settings</span>
              </Button>
            </div>
          </div>

          {/* Account Section */}
          <div className='p-4 space-y-2'>
            <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5'>
              Account
            </div>
            <div className='space-y-1'>
              <Button
                variant='ghost'
                className='w-full justify-start gap-3 rounded-lg h-10 hover:bg-muted'
                onClick={() => handleNavigation("/dashboard/customer/profile")}
              >
                <User className='h-4 w-4 text-sky-600' />
                <span>View Profile</span>
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start gap-3 rounded-lg h-10 hover:bg-muted'
                onClick={() => handleNavigation("/help-center")}
              >
                <LifeBuoy className='h-4 w-4 text-emerald-600' />
                <span>Help & Support</span>
              </Button>
            </div>
          </div>

          {/* Logout */}
          <div className='p-3'>
            <Button
              variant='outline'
              className='w-full justify-center gap-2 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700'
              onClick={handleLogout}
            >
              <LogOut className='h-4 w-4' />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
