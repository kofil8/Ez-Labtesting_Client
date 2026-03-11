"use client";

import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  CreditCard,
  MapPin,
  Stethoscope,
  User,
} from "lucide-react";

const STEPS = [
  { label: "Select Test", icon: Stethoscope },
  { label: "Patient Info", icon: User },
  { label: "Payment", icon: CreditCard },
  { label: "Visit Lab", icon: MapPin },
];

interface CheckoutStepperProps {
  /** Zero-based index of the current step */
  currentStep?: number;
}

export function CheckoutStepper({ currentStep = 0 }: CheckoutStepperProps) {
  return (
    <div className='w-full rounded-xl border bg-card shadow-sm p-4 sm:p-5 lg:p-6'>
      <div className='hidden sm:flex items-center justify-between gap-4'>
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.label} className='flex-1 flex items-center gap-3'>
              <div
                className={cn(
                  "flex items-center justify-center h-10 w-10 rounded-full border-2 transition-colors",
                  isCompleted && "border-green-500 bg-green-50 text-green-600",
                  isActive &&
                    !isCompleted &&
                    "border-primary bg-primary/10 text-primary",
                  !isActive &&
                    !isCompleted &&
                    "border-muted-foreground/30 text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className='h-5 w-5' />
                ) : (
                  <Icon className='h-5 w-5' />
                )}
              </div>
              <div className='flex flex-col'>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
                <span className='text-[11px] text-muted-foreground'>
                  Step {index + 1}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className='flex-1 h-px bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent ml-3' />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile / Vertical */}
      <div className='sm:hidden space-y-3'>
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const Icon = step.icon;

          return (
            <div
              key={step.label}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-3",
                isActive ? "border-primary/60 bg-primary/5" : "border-muted",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center h-9 w-9 rounded-full border-2",
                  isCompleted && "border-green-500 bg-green-50 text-green-600",
                  isActive &&
                    !isCompleted &&
                    "border-primary bg-primary/10 text-primary",
                  !isActive &&
                    !isCompleted &&
                    "border-muted-foreground/30 text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className='h-5 w-5' />
                ) : (
                  <Icon className='h-5 w-5' />
                )}
              </div>
              <div className='flex-1'>
                <div className='flex items-center justify-between'>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </span>
                  <span className='text-[11px] text-muted-foreground'>
                    Step {index + 1}
                  </span>
                </div>
                {index < currentStep && (
                  <p className='text-[11px] text-green-600'>Completed</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
