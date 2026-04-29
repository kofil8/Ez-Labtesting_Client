"use client";

import { changePassword } from "@/app/actions/change-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SixDigitCodeInput } from "@/components/shared/SixDigitCodeInput";
import { useToast } from "@/hook/use-toast";
import { verifySensitiveMFA } from "@/lib/auth/client";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export function ChangePasswordForm({
  mfaEnabled = false,
}: {
  mfaEnabled?: boolean;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [mfaCode, setMfaCode] = useState("");
  const [mfaVerified, setMfaVerified] = useState(!mfaEnabled);
  const [mfaError, setMfaError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const showMfaStep = mfaEnabled && !mfaVerified;

  const mfaStatusText = useMemo(() => {
    if (!mfaEnabled) return "MFA is not enabled";
    return mfaVerified
      ? "MFA verified for this change"
      : "MFA verification required";
  }, [mfaEnabled, mfaVerified]);

  function handleVerifyMFA() {
    setMfaError("");

    if (!/^\d{6}$/.test(mfaCode.trim())) {
      setMfaError("Enter the 6-digit code from your authenticator app.");
      return;
    }

    startTransition(async () => {
      const result = await verifySensitiveMFA(mfaCode.trim());
      if (!result.success) {
        setMfaVerified(false);
        setMfaError(result.message || "Invalid verification code.");
        return;
      }

      setMfaVerified(true);
      setMfaCode("");
      toast({
        title: "MFA verified",
        description: "You can now change your password.",
      });
    });
  }

  const onSubmit = async (data: ChangePasswordFormData) => {
    setPasswordError("");

    if (mfaEnabled && !mfaVerified) {
      setPasswordError("Verify MFA before changing your password.");
      return;
    }

    const formData = new FormData();
    formData.append("oldPassword", data.currentPassword);
    formData.append("newPassword", data.newPassword);

    startTransition(async () => {
      try {
        const res = await changePassword(formData);
        if (res?.success) {
          toast({
            title: "Password updated",
            description: "Your password has been changed successfully.",
          });
          reset();
          setMfaVerified(!mfaEnabled);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Current password is incorrect or an error occurred.";

        setPasswordError(errorMessage);
        if (errorMessage.toLowerCase().includes("mfa")) {
          setMfaVerified(false);
        }
        toast({
          title: "Password update failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className='mx-auto max-w-3xl space-y-5'>
      {mfaEnabled ? (
        <div className='rounded-xl border border-blue-100 bg-white p-4 shadow-lg shadow-blue-100/25 sm:p-5'>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div
              className={`flex items-center gap-3 rounded-lg border p-3 ${
                showMfaStep
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700"
              }`}
            >
              <span className='grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-sm font-bold shadow-sm'>
                {mfaVerified ? <CheckCircle2 className='h-4 w-4' /> : "1"}
              </span>
              <div>
                <p className='text-xs font-bold uppercase tracking-[0.16em]'>
                  Step 1
                </p>
                <p className='text-sm font-semibold'>MFA verification</p>
              </div>
            </div>
            <div
              className={`flex items-center gap-3 rounded-lg border p-3 ${
                !showMfaStep
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-100 bg-slate-50 text-slate-500"
              }`}
            >
              <span className='grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-sm font-bold shadow-sm'>
                2
              </span>
              <div>
                <p className='text-xs font-bold uppercase tracking-[0.16em]'>
                  Step 2
                </p>
                <p className='text-sm font-semibold'>Change password</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showMfaStep ? (
        <section className='rounded-xl border border-blue-100 bg-white p-5 shadow-lg shadow-blue-100/25 sm:p-6'>
          <div className='flex items-start gap-3'>
            <div className='grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600'>
              <ShieldCheck className='h-5 w-5' />
            </div>
            <div className='min-w-0'>
              <p className='text-xs font-bold uppercase tracking-[0.16em] text-blue-600'>
                Step-up verification
              </p>
              <h2 className='mt-1 text-xl font-semibold text-slate-950'>
                {mfaStatusText}
              </h2>
              <p className='mt-2 text-sm leading-6 text-slate-600'>
                Confirm a fresh authenticator code before updating your
                password.
              </p>
            </div>
          </div>

          <div className='mx-auto mt-5 max-w-xs space-y-3'>
            <div>
              <Label>Authenticator code</Label>
              <div className='mt-2'>
                <SixDigitCodeInput
                  value={mfaCode}
                  onChange={setMfaCode}
                  disabled={isPending}
                  ariaLabel='Authenticator code'
                />
              </div>
              {mfaError ? (
                <p className='mt-2 text-sm text-red-600'>{mfaError}</p>
              ) : null}
            </div>
            <Button
              type='button'
              onClick={handleVerifyMFA}
              disabled={isPending}
              className='h-11 w-full bg-blue-600 hover:bg-blue-700'
            >
              {isPending ? "Verifying..." : "Verify MFA"}
            </Button>
          </div>
        </section>
      ) : (
        <section className='rounded-xl border border-blue-100 bg-white p-5 shadow-lg shadow-blue-100/25 sm:p-6'>
          <div className='mb-5 flex items-start gap-3 border-b border-slate-100 pb-5'>
            <div className='grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-700'>
              <KeyRound className='h-5 w-5' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-slate-950'>
                Change password
              </h2>
              <p className='mt-1 text-sm leading-6 text-slate-600'>
                Use a unique password with uppercase, lowercase, number, and
                special character.
              </p>
            </div>
          </div>

          {!mfaEnabled ? (
            <div className='mb-5 rounded-lg border border-amber-100 bg-amber-50 p-4'>
              <div className='flex items-start gap-3'>
                <ShieldAlert className='mt-0.5 h-4 w-4 shrink-0 text-amber-700' />
                <div>
                  <p className='text-sm font-semibold text-amber-900'>
                    Stronger protection recommended
                  </p>
                  <p className='mt-1 text-sm leading-6 text-amber-800'>
                    You can change your password now. Enable MFA for stronger
                    account protection.
                  </p>
                  <Button asChild variant='outline' className='mt-4 bg-white'>
                    <Link href='/dashboard/customer/security'>Set Up MFA</Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {passwordError ? (
              <div className='rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700'>
                {passwordError}
              </div>
            ) : null}

            <div>
              <Label htmlFor='currentPassword'>Current password</Label>
              <div className='relative mt-1'>
                <Input
                  id='currentPassword'
                  type='password'
                  className='h-11 pr-10'
                  disabled={mfaEnabled && !mfaVerified}
                  {...register("currentPassword")}
                />
                <LockKeyhole className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
              </div>
              {errors.currentPassword ? (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.currentPassword.message}
                </p>
              ) : null}
            </div>

            <div>
              <Label htmlFor='newPassword'>New password</Label>
              <Input
                id='newPassword'
                type='password'
                className='mt-1 h-11'
                disabled={mfaEnabled && !mfaVerified}
                {...register("newPassword")}
              />
              {errors.newPassword ? (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.newPassword.message}
                </p>
              ) : (
                <p className='mt-2 text-xs text-slate-500'>
                  Minimum 8 characters with uppercase, lowercase, number, and
                  special character.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor='confirmPassword'>Confirm new password</Label>
              <Input
                id='confirmPassword'
                type='password'
                className='mt-1 h-11'
                disabled={mfaEnabled && !mfaVerified}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword ? (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.confirmPassword.message}
                </p>
              ) : null}
            </div>

            <Button
              type='submit'
              disabled={isPending || (mfaEnabled && !mfaVerified)}
              className='h-11 w-full bg-blue-600 text-base font-semibold hover:bg-blue-700'
            >
              {isPending ? "Updating password..." : "Update Password"}
            </Button>
          </form>
        </section>
      )}
    </div>
  );
}
