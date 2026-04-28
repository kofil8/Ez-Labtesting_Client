"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resendOtp, verifyOtp } from "@/lib/auth/client";
import { useAuth } from "@/lib/auth-context";
import { MFAFormData, mfaSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

// Separate component for OTP Input to manage refs properly
function OTPInputField({
  index,
  isPending,
  setInputRef,
  onChangeOtp,
  onBackspace,
}: {
  index: number;
  isPending: boolean;
  setInputRef: (index: number, element: HTMLInputElement | null) => void;
  onChangeOtp: (index: number, value: string) => void;
  onBackspace: (index: number, e: any) => void;
}) {
  return (
    <Input
      key={index}
      ref={(el) => setInputRef(index, el)}
      maxLength={1}
      disabled={isPending}
      className='w-12 h-12 text-center text-xl font-bold border rounded-lg 
                 focus-visible:ring-2 focus-visible:ring-primary'
      onChange={(e) => onChangeOtp(index, e.target.value)}
      onKeyDown={(e) => onBackspace(index, e)}
    />
  );
}

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

  // OTP Input Refs - properly initialized
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  const setInputRef = (index: number, element: HTMLInputElement | null) => {
    inputRefs.current[index] = element;
  };

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

  // Handle Email from URL
  const emailParam = searchParams.get("email");
  const email =
    emailParam ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("otp_email")
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

  // Handle OTP Input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // allow only digits

    const newCode = codeValue.split("");
    newCode[index] = value;
    setValue("code", newCode.join(""));

    if (value && index < 5) inputRefs.current[index + 1]?.focus();

    // Auto-submit when 6 digits filled
    if (newCode.join("").length === 6) handleSubmit(onSubmit)();
  };

  const handleBackspace = (index: number, e: any) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Submit Form
  const onSubmit = async (data: MFAFormData) => {
    if (!email) {
      toast.error("Email not found. Restart registration.");
      router.push("/register");
      return;
    }

    setError("");
    startTransition(async () => {
      try {
        const res = await verifyOtp({ email, otp: data.code });
        if (res?.success) {
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
        }
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
        const res = await resendOtp(email);

        if (res?.success) {
          toast.success("New OTP sent to your email.");
          setTimer(60);
        }
      } catch (err: any) {
        toast.error(
          "Unable to resend verification code. Please try again in a moment.",
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

            <div className='flex justify-center gap-2'>
              {Array.from({ length: 6 }).map((_, index) => (
                <OTPInputField
                  key={index}
                  index={index}
                  isPending={isPending}
                  setInputRef={setInputRef}
                  onChangeOtp={handleOtpChange}
                  onBackspace={handleBackspace}
                />
              ))}
            </div>

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
            onClick={() => router.push(fromLogin ? "/login" : "/register")}
          >
            Back
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
