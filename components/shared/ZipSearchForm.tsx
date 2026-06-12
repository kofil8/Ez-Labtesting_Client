"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRestrictionStatus } from "@/lib/services/state-restriction.service";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { FormEvent, useState } from "react";

type ZipSearchFormProps = {
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  buttonLabel?: string;
  helperText?: string;
  compact?: boolean;
  laboratoryCode?: string;
  testId?: string;
};

export function ZipSearchForm({
  className,
  inputClassName,
  buttonClassName,
  buttonLabel = "Check Availability",
  helperText,
  compact = false,
  laboratoryCode = "ACCESS",
  testId,
}: ZipSearchFormProps) {
  const [zip, setZip] = useState("");
  const [status, setStatus] = useState<
    | { type: "available"; message: string }
    | { type: "restricted"; message: string }
    | { type: "error"; message: string }
    | null
  >(null);
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedZip = zip.trim();

    if (!/^\d{5}$/.test(trimmedZip)) {
      setStatus({
        type: "error",
        message: "Enter a valid 5-digit U.S. ZIP code.",
      });
      return;
    }

    setChecking(true);
    setStatus(null);

    try {
      const result = await getRestrictionStatus({
        zipCode: trimmedZip,
        laboratoryCode,
        testId,
      });
      const locationLabel = [result.city, result.regionName || result.effectiveStateCode]
        .filter(Boolean)
        .join(", ");

      if (result.canOrder) {
        setStatus({
          type: "available",
          message: locationLabel
            ? `Available for online ordering in ${locationLabel}.`
            : "Available for online ordering in this ZIP code.",
        });
      } else {
        setStatus({
          type: "restricted",
          message:
            result.reason ||
            (locationLabel
              ? `Ordering is restricted in ${locationLabel}.`
              : "Ordering is restricted in this ZIP code."),
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to verify ZIP code right now.",
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("grid gap-3", className)}>
      <div
        className={cn(
          "grid gap-3",
          compact ? "sm:grid-cols-[1fr_auto]" : "sm:grid-cols-[1fr_auto]",
        )}
      >
        <div className='relative min-w-0'>
          <MapPin className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-700 dark:text-cyan-300' />
          <Input
            value={zip}
            onChange={(event) => setZip(event.target.value)}
            placeholder='Enter ZIP code'
            inputMode='numeric'
            aria-label='Enter ZIP code to check availability'
            className={cn(
              "h-12 rounded-2xl border-slate-200 bg-white pl-12 text-[15px] font-semibold shadow-none focus-visible:border-sky-400 focus-visible:ring-2 focus-visible:ring-sky-200 dark:border-slate-700 dark:bg-slate-950 dark:focus-visible:ring-cyan-900/50",
              inputClassName,
            )}
          />
        </div>
        <Button
          type='submit'
          disabled={checking}
          className={cn(
            "h-12 w-full rounded-2xl bg-sky-700 px-6 text-[15px] font-black text-white shadow-[0_16px_30px_-18px_rgba(3,105,161,0.7)] hover:bg-sky-800 sm:w-auto",
            buttonClassName,
          )}
        >
          {checking ? <Loader2 className='h-4 w-4 animate-spin' /> : null}
          {buttonLabel}
        </Button>
      </div>
      {status ? (
        <div
          className={cn(
            "flex items-start gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold leading-5",
            status.type === "available" &&
              "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",
            status.type === "restricted" &&
              "border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300",
            status.type === "error" &&
              "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300",
          )}
          role='status'
          aria-live='polite'
        >
          {status.type === "available" ? (
            <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0' />
          ) : (
            <AlertTriangle className='mt-0.5 h-4 w-4 shrink-0' />
          )}
          <span>{status.message}</span>
        </div>
      ) : null}
      {helperText ? (
        <p className='text-sm leading-6 text-slate-500 dark:text-slate-400'>
          {helperText}
        </p>
      ) : null}
    </form>
  );
}
