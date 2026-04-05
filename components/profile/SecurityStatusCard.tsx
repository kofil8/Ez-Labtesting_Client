"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Lock, Shield } from "lucide-react";
import Link from "next/link";

interface SecurityStatusCardProps {
  mfaEnabled?: boolean;
}

export function SecurityStatusCard({
  mfaEnabled = false,
}: SecurityStatusCardProps) {
  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Shield className='w-5 h-5 text-blue-600' />
            <CardTitle className='text-lg'>Security Status</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Lock className='w-4 h-4 text-amber-600' />
              <span className='text-sm font-medium'>
                Two-Factor Authentication
              </span>
            </div>
            <Badge
              variant={mfaEnabled ? "default" : "secondary"}
              className='ml-2'
            >
              {mfaEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <p className='text-xs text-muted-foreground ml-6'>
            {mfaEnabled
              ? "Your account is protected with 2FA"
              : "Add an extra layer of security to your account"}
          </p>
        </div>

        <p className='text-xs text-muted-foreground text-center'>
          Review and manage all security settings
        </p>
      </CardContent>

      <CardFooter className='border-t pt-3'>
        <Button asChild variant='outline' size='sm' className='w-full'>
          <Link
            href='/profile/security'
            className='flex items-center justify-between'
          >
            Manage Security
            <ChevronRight className='w-4 h-4' />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
