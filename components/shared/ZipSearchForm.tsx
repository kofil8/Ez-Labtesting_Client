"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  getRestrictionStateDisplay,
} from "@/lib/restrictions/presentation";
import { getRestrictionStatus } from "@/lib/services/state-restriction.service";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Loader2, Mail, MapPin } from "lucide-react";
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
    | { type: "error"; message: string }
    | null
  >(null);
  const [restrictedDialog, setRestrictedDialog] = useState<{
    open: boolean;
    stateLabel: string | null;
    message: string;
    zipCode: string;
  }>({
    open: false,
    stateLabel: null,
    message: "",
    zipCode: "",
  });
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);
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
        setRestrictedDialog({
          open: true,
          stateLabel: getRestrictionStateDisplay(result),
          message:
            result.reason ||
            (locationLabel
              ? `Online ordering is not available in ${locationLabel} yet.`
              : "Online ordering is not available in this ZIP code yet."),
          zipCode: trimmedZip,
        });
        setNotifyEmail("");
        setNotifySubmitted(false);
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
    <>
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

      <Dialog
        open={restrictedDialog.open}
        onOpenChange={(open) =>
          setRestrictedDialog((current) => ({ ...current, open }))
        }
      >
        <DialogContent className='overflow-hidden rounded-3xl border-slate-200 p-0 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.5)] dark:border-slate-800 sm:max-w-xl'>
          <div className='bg-[linear-gradient(135deg,#f0f9ff_0%,#ecfdf5_100%)] px-6 py-6 dark:bg-[linear-gradient(135deg,#082f49_0%,#052e2b_100%)]'>
            <DialogHeader className='text-left'>
              <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm dark:bg-slate-950 dark:text-sky-300'>
                <MapPin className='h-6 w-6' />
              </div>
              <DialogTitle className='text-2xl font-bold tracking-tight text-slate-950 dark:text-white'>
                Online ordering is not available here yet
              </DialogTitle>
              <DialogDescription className='text-sm leading-6 text-slate-600 dark:text-slate-300'>
                {restrictedDialog.message}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className='space-y-4 px-6 pb-6 pt-5'>
            <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
              {restrictedDialog.stateLabel ? (
                <p>
                  We are tracking interest in {restrictedDialog.stateLabel} and
                  will prioritize updates as state availability changes.
                </p>
              ) : (
                <p>
                  We are tracking interest by ZIP code and will prioritize
                  updates as availability changes.
                </p>
              )}
            </div>

            {notifySubmitted ? (
              <div
                className='flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'
                role='status'
              >
                <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0' />
                Thanks, we will use this to prioritize availability updates for
                ZIP {restrictedDialog.zipCode}.
              </div>
            ) : (
              <form
                className='grid gap-3'
                onSubmit={(event) => {
                  event.preventDefault();
                  setNotifySubmitted(true);
                }}
              >
                <label
                  htmlFor='restricted-zip-email'
                  className='text-sm font-bold text-slate-950 dark:text-white'
                >
                  Get availability updates
                </label>
                <div className='grid gap-3 sm:grid-cols-[1fr_auto]'>
                  <div className='relative min-w-0'>
                    <Mail className='pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                    <Input
                      id='restricted-zip-email'
                      type='email'
                      required
                      value={notifyEmail}
                      onChange={(event) => setNotifyEmail(event.target.value)}
                      placeholder='Email address'
                      className='h-11 rounded-2xl border-slate-200 pl-11 dark:border-slate-700'
                    />
                  </div>
                  <Button
                    type='submit'
                    className='h-11 rounded-2xl bg-sky-700 px-5 font-bold text-white hover:bg-sky-800'
                  >
                    Notify me
                  </Button>
                </div>
                <p className='text-xs leading-5 text-slate-500 dark:text-slate-400'>
                  This is a launch-readiness signup UI only. No email is saved
                  until notification storage is connected.
                </p>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
