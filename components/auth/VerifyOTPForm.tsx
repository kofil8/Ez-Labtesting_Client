"use client";

import { SixDigitCodeInput } from "@/components/shared/SixDigitCodeInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import {
  forgotPassword,
  resendOtp,
  verifyOtp,
  verifyResetOtp,
} from "@/lib/auth/client";
import { MFAFormData, mfaSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

export function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authContext = useAuth();
  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const [error, setError] = useState("");

  // Countdown timer
  const [timer, setTimer] = useState(60);

  // Skeleton UI
  const [loadingUI, setLoadingUI] = useState(true);

  // Delay UI mount for skeleton effect
  useEffect(() => {
    const t = setTimeout(() => setLoadingUI(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Start countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle Email from URL or sessionStorage
  const emailParam = searchParams.get("email");
  const email =
    emailParam ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("otp_email") ||
        sessionStorage.getItem("reset_email")
      : null) ||
    "";

  const fromLogin =
    typeof window !== "undefined" &&
    (document.referrer.includes("/login") ||
      searchParams.get("fromLogin") === "true");

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<MFAFormData>({
    resolver: zodResolver(mfaSchema),
    defaultValues: { code: "" },
  });
  const codeValue = useWatch({ control, name: "code" }) || "";
  const isResetFlow = searchParams.get("flow") === "reset";

  // Submit Form
  const onSubmit = async (data: MFAFormData) => {
    if (!email) {
      toast.error(
        isResetFlow
          ? "Email not found. Restart the password reset flow."
          : "Email not found. Restart registration.",
      );
      router.push(isResetFlow ? "/forgot-password" : "/register");
      return;
    }

    setError("");
    startTransition(async () => {
      try {
        if (isResetFlow) {
          const resetResult = await verifyResetOtp(email, data.code);

          if (resetResult?.success) {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("reset_email", String(email));
              if (resetResult.resetToken) {
                sessionStorage.setItem("reset_token", resetResult.resetToken);
              }
            }

            toast.success("Code verified. Continue to reset your password.");
            setTimeout(() => router.push("/reset-password"), 700);
          }

          return;
        }

        const res = await verifyOtp({ email, otp: data.code });

        if (!res?.success) {
          return;
        }

        // Only refresh auth if coming from login flow (user is already authenticated)
        if (fromLogin) {
          await authContext.refreshAuth();
        }

        // Clear stored email after successful verification
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("otp_email");
        }

        // Show appropriate success message based on flow
        if (fromLogin) {
          toast.success("Email verified successfully!");
        } else {
          toast.success("Account verified! Please log in to continue.", {
            duration: 5000,
          });
        }

        setTimeout(() => {
          const from = searchParams.get("from");
          if (fromLogin) {
            router.push(from || "/dashboard/customer/results");
          } else {
            // New registration - redirect to login with verified flag
            const loginUrl =
              from && from.startsWith("/") && !from.startsWith("//")
                ? `/login?verified=true&from=${encodeURIComponent(from)}`
                : "/login?verified=true";
            router.push(loginUrl);
          }
        }, 1500);
      } catch (err: any) {
        const msg = err.message || "Invalid OTP. Try again.";
        setError(msg);
        toast.error(msg);
      }
    });
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (!email) return toast.error("Email not found.");

    if (timer > 0) return; // Prevent spam clicks

    startResendTransition(async () => {
      try {
        // For reset flow, call forgotPassword to resend reset OTP
        // For registration flow, call resendOtp
        const res = isResetFlow
          ? await forgotPassword(email)
          : await resendOtp(email);

        if (res?.success) {
          toast.success(
            isResetFlow
              ? "A new reset code has been sent to your email."
              : "New OTP sent to your email.",
          );
          setTimer(60);
        } else {
          toast.error(
            isResetFlow
              ? "Unable to resend reset code. Please try again in a moment."
              : "Unable to resend verification code. Please try again in a moment.",
          );
        }
      } catch (err: any) {
        toast.error(
          isResetFlow
            ? "Unable to resend reset code. Please try again in a moment."
            : "Unable to resend verification code. Please try again in a moment.",
        );
      }
    });
  };

  // ------- SKELETON LOADING -------
  if (loadingUI) {
    return (
      <Card className='animate-pulse p-6 space-y-6'>
        <div className='h-4 bg-muted rounded w-1/2 mx-auto' />
        <div className='flex justify-between mt-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='w-12 h-12 bg-muted rounded-lg' />
          ))}
        </div>
        <div className='h-10 bg-muted rounded mt-6' />
        <div className='h-10 bg-muted rounded' />
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='pt-6 space-y-6'>
          {email && (
            <p className='text-center text-sm text-muted-foreground'>
              A verification code has been sent to <b>{email}</b>
            </p>
          )}

          {/* OTP BOXES */}
          <div className='space-y-2'>
            <Label>Enter Verification Code</Label>

            <SixDigitCodeInput
              value={codeValue}
              onChange={(value) =>
                setValue("code", value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: Boolean(errors.code),
                })
              }
              onComplete={() => handleSubmit(onSubmit)()}
              disabled={isPending}
              ariaLabel='Email verification code'
              className='mx-auto max-w-sm'
              inputClassName='h-12 text-xl font-bold'
            />

            {errors.code && (
              <p className='text-sm text-red-500'>{errors.code.message}</p>
            )}
          </div>

          <p className='text-center text-xs text-muted-foreground'>
            Enter the 6-digit code sent to your email
          </p>
        </CardContent>

        <CardFooter className='flex flex-col gap-3'>
          {error && <p className='text-center text-red-500 text-sm'>{error}</p>}

          <Button type='submit' disabled={isPending} className='w-full'>
            {isPending ? "Verifying..." : "Verify Code"}
          </Button>

          {/* Resend OTP with Timer */}
          <Button
            type='button'
            variant='ghost'
            className='w-full'
            onClick={handleResendOtp}
            disabled={isResending || timer > 0}
          >
            {timer > 0
              ? `Resend in ${timer}s`
              : isResending
                ? "Sending..."
                : "Resend OTP"}
          </Button>

          <Button
            type='button'
            variant='ghost'
            className='w-full'
            onClick={() =>
              router.push(
                isResetFlow
                  ? "/forgot-password"
                  : fromLogin
                    ? "/login"
                    : "/register",
              )
            }
          >
            Back
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
