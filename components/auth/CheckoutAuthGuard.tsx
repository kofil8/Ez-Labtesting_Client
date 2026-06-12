"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface CheckoutAuthGuardProps {
  children: ReactNode;
}

export function CheckoutAuthGuard({ children }: CheckoutAuthGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Card className='p-4 sm:p-5 border-2 bg-muted/40'>
        <p className='text-sm text-muted-foreground'>Checking your session…</p>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className='p-4 sm:p-5 border-2 bg-amber-50 dark:bg-amber-950/30'>
        <div className='flex items-start gap-3'>
          <div className='mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200 border border-amber-200/80'>
            <ShieldCheck className='h-4 w-4' />
          </div>
          <div className='flex-1 space-y-3'>
            <div>
              <p className='text-sm font-semibold text-foreground'>
                Login required to complete checkout
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                Please sign in or create an account to continue securely.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-2'>
              <Button asChild className='sm:flex-1'>
                <Link href='/login'>Login</Link>
              </Button>
              <Button asChild variant='outline' className='sm:flex-1'>
                <Link href='/register'>Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return <>{children}</>;
}
