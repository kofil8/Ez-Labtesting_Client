"use client";

import { resendOtp } from "@/app/actions/resend-otp";
import { verifyOtp } from "@/app/actions/verify-otp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hook/use-toast";
import { useAuth } from "@/lib/auth-context";
import { MFAFormData, mfaSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast: toastHook } = useToast();
  const authContext = useAuth();
  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const [error, setError] = useState("");

  // Countdown timer
  const [timer, setTimer] = useState(60);

  // Skeleton UI
  const [loadingUI, setLoadingUI] = useState(true);

  // OTP Input Refs - moved outside of conditional rendering
  const inputRefsContainer = useRef<(HTMLInputElement | null)[]>([]);
  if (inputRefsContainer.current.length === 0) {
    inputRefsContainer.current = Array(6).fill(null);
  }
  const inputRefs = inputRefsContainer.current;

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
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MFAFormData>({
    resolver: zodResolver(mfaSchema),
    defaultValues: { code: "" },
  });

  // Handle OTP Input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // allow only digits

    const newCode = (watch("code") || "").split("");
    newCode[index] = value;
    setValue("code", newCode.join(""));

    if (value && index < 5) inputRefs[index + 1].current?.focus();

    // Auto-submit when 6 digits filled
    if (newCode.join("").length === 6) handleSubmit(onSubmit)();
  };

  const handleBackspace = (index: number, e: any) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Submit Form
  const onSubmit = async (data: MFAFormData) => {
    if (!email) {
      toast.error("Email not found. Restart signup.");
      router.push("/signup");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", data.code);

    setError("");
    startTransition(async () => {
      try {
        const res = await verifyOtp(formData);
        if (res?.success) {
          await authContext.refreshAuth();

          toast.success("Email verified successfully!");

          setTimeout(() => {
            const from = searchParams.get("from");
            if (fromLogin) router.push(from || "/results");
            else router.push("/login");
          }, 1000);
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
        const formData = new FormData();
        formData.append("email", email);
        const res = await resendOtp(formData);

        if (res?.success) {
          toast.success("New OTP sent to your email.");
          setTimer(60);
        }
      } catch (err: any) {
        toast.error("Failed to resend OTP.");
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
                <Input
                  key={index}
                  ref={(el) => {
                    if (el) inputRefs[index] = el;
                  }}
                  maxLength={1}
                  disabled={isPending}
                  className='w-12 h-12 text-center text-xl font-bold border rounded-lg 
                             focus-visible:ring-2 focus-visible:ring-primary'
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleBackspace(index, e)}
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
            onClick={() => router.push(fromLogin ? "/login" : "/signup")}
          >
            Back
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
