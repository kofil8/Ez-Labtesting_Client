"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Phone, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface ProfileCompleteness {
  basicInfo: boolean;
  address: boolean;
  phone: boolean;
  overall: number; // percentage
}

interface OnboardingPromptProps {
  completeness: ProfileCompleteness;
  userName?: string;
  onDismiss?: () => void;
}

export function OnboardingPrompt({
  completeness,
  userName,
  onDismiss,
}: OnboardingPromptProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const items = [
    {
      id: "basicInfo",
      label: "Basic Information",
      description: "Name, email, and date of birth",
      icon: User,
      isComplete: completeness.basicInfo,
      href: "/dashboard/customer/profile",
    },
    {
      id: "address",
      label: "Address Information",
      description: "Street, city, state, and ZIP code",
      icon: Phone,
      isComplete: completeness.address,
      href: "/dashboard/customer/profile",
    },
    {
      id: "phone",
      label: "Contact Phone",
      description: "Valid phone number for notifications",
      icon: Phone,
      isComplete: completeness.phone,
      href: "/dashboard/customer/profile",
    },
  ];

  const incompleteItems = items.filter((item) => !item.isComplete);

  if (isDismissed || completeness.overall === 100) {
    return null;
  }

  return (
    <Card className='overflow-hidden border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/50 dark:to-transparent'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-start gap-3'>
            <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5'>
              <AlertCircle className='w-5 h-5 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <CardTitle className='text-lg'>
                welcome{userName ? `, ${userName.split(" ")[0]}` : ""}! 👋
              </CardTitle>
              <p className='text-sm text-muted-foreground mt-1'>
                Complete your profile to get started with personalized
                recommendations
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsDismissed(true);
              onDismiss?.();
            }}
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Progress Bar */}
        <div className='space-y-2'>
          <div className='flex justify-between items-center text-sm'>
            <span className='font-medium'>Profile Completeness</span>
            <span className='text-blue-600 dark:text-blue-400 font-semibold'>
              {completeness.overall}%
            </span>
          </div>
          <Progress
            value={completeness.overall}
            className='h-2 bg-blue-100 dark:bg-blue-900'
          />
        </div>

        {/* Todo Items */}
        <div className='space-y-2'>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className='flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50'
              >
                <div className='flex-shrink-0 w-5 h-5'>
                  {item.isComplete ? (
                    <CheckCircle className='w-5 h-5 text-emerald-600' />
                  ) : (
                    <Icon className='w-5 h-5 text-muted-foreground' />
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <p
                    className={`text-sm font-medium ${
                      item.isComplete
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {item.description}
                  </p>
                </div>
                {!item.isComplete && (
                  <Button
                    asChild
                    variant='ghost'
                    size='sm'
                    className='flex-shrink-0'
                  >
                    <Link href={item.href}>Complete</Link>
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Benefits */}
        {incompleteItems.length > 0 && (
          <div className='bg-blue-50/50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-100 dark:border-blue-900 space-y-2'>
            <p className='text-xs font-semibold text-blue-700 dark:text-blue-300'>
              Benefits of completing your profile:
            </p>
            <ul className='text-xs text-blue-600 dark:text-blue-300 space-y-1'>
              <li>• Faster checkout process</li>
              <li>• Personalized health recommendations</li>
              <li>• Easier order tracking and history</li>
            </ul>
          </div>
        )}

        {/* Action Button */}
        {incompleteItems.length > 0 && (
          <Button asChild className='w-full'>
            <Link href='/dashboard/customer/profile'>
              Complete Profile ({completeness.overall}%)
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
