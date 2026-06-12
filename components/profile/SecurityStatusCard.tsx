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
    <Card className='rounded-[26px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)] transition-shadow hover:shadow-[0_24px_60px_-40px_rgba(15,23,42,0.42)]'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Shield className='w-5 h-5 text-blue-600' />
            <CardTitle className='text-lg'>Security Status</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='space-y-3 rounded-[22px] border border-slate-200/80 bg-slate-50/80 p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Lock className='w-4 h-4 text-amber-600' />
              <span className='text-sm font-medium'>
                Two-Factor Authentication
              </span>
            </div>
            <Badge
              variant={mfaEnabled ? "default" : "secondary"}
              className='ml-2 rounded-full'
            >
              {mfaEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <p className='ml-6 text-xs text-muted-foreground'>
            {mfaEnabled
              ? "Extra sign-in protection is active."
              : "Add a second step to protect lab results and profile access."}
          </p>
        </div>

        <p className='text-xs text-muted-foreground text-center'>
          Review authentication settings and backup access options.
        </p>
      </CardContent>

      <CardFooter className='border-t pt-3'>
        <Button asChild variant='outline' size='sm' className='w-full'>
          <Link
            href='/dashboard/customer/security'
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
