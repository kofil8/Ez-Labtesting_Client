"use client";

import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

interface HeaderAuthButtonsProps {
  isAuthenticated: boolean;
  userEmail?: string;
  onLinkClick?: () => void;
  onLogout?: () => void;
}

export function HeaderAuthButtons({
  isAuthenticated,
  userEmail,
  onLinkClick,
  onLogout,
}: HeaderAuthButtonsProps) {
  return (
    <div className='ml-1 hidden items-center gap-2 lg:flex'>
      {isAuthenticated ? (
        <>
          <Link
            href='/profile'
            onClick={onLinkClick}
            aria-label='Go to profile'
          >
            <div className='flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background font-bold text-primary shadow-sm transition-colors hover:bg-muted/60'>
              {userEmail?.charAt(0).toUpperCase() || (
                <User className='h-4 w-4' />
              )}
            </div>
          </Link>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={onLogout}
            className='rounded-full text-muted-foreground hover:bg-muted hover:text-foreground'
            aria-label='Logout'
          >
            <LogOut className='h-4 w-4' />
          </Button>
        </>
      ) : (
        <>
          <Button
            variant='ghost'
            asChild
            className='rounded-full px-3.5 font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          >
            <Link href='/login' onClick={onLinkClick}>
              Login
            </Link>
          </Button>
          <Button
            asChild
            className='rounded-full bg-[#2b63df] px-5 text-white shadow-[0_10px_20px_-13px_rgba(37,99,235,0.95)] hover:bg-[#1f55cf]'
          >
            <Link href='/register' onClick={onLinkClick}>
              Create Account
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}
