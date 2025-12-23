"use client";

import { loginUser } from "@/app/actions/login-user";
import { resendOtp } from "@/app/actions/resend-otp";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { FieldError } from "@/components/shared/FieldError";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { getPushToken } from "@/lib/firebase/getPushToken";
import { LoginFormData, loginSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authContext = useAuth();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // -------------------------
  //  MAIN LOGIN HANDLER
  // -------------------------
  const handleAction = (formData: FormData) => {
    setError("");

    startTransition(async () => {
      try {
        // 🔥 Get push token before sending login
        const pushToken = await getPushToken();
        if (pushToken) {
          formData.append("pushToken", pushToken);
          formData.append("platform", "web");
        }

        const res = await loginUser(formData);

        // ---------------------------
        // SUCCESS
        // ---------------------------
        if (res?.success) {
          await authContext.refreshAuth();
          toast.success("Login successful!");

          const fromParam = searchParams.get("from");
          const safeFrom =
            fromParam &&
            fromParam.startsWith("/") &&
            !fromParam.startsWith("//")
              ? fromParam
              : null;

          // Prefer explicit `from` redirect when provided and safe.
          if (safeFrom) {
            setTimeout(() => {
              router.push(safeFrom);
            }, 800);
            return;
          }

          // Otherwise redirect based on user role
          const role = authContext.user?.role;
          const roleRedirect =
            role === "admin"
              ? "/admin"
              : role === "lab_partner"
              ? "/dashboard/lab-partner"
              : "/dashboard/customer";

          setTimeout(() => {
            router.push(roleRedirect);
          }, 800);

          return;
        }

        // ---------------------------
        // EMAIL NOT VERIFIED
        // ---------------------------
        if (res?.requiresVerification) {
          const email = res.email || (formData.get("email") as string);

          // Save email locally for OTP page
          if (typeof window !== "undefined") {
            sessionStorage.setItem("otp_email", email);
          }

          toast.info("Please verify your email.");

          // Auto resend OTP
          try {
            const resendForm = new FormData();
            resendForm.append("email", email);
            await resendOtp(resendForm);
            toast.success("A new OTP has been sent.");
          } catch {}

          const fromParam = searchParams.get("from");
          const safeFrom =
            fromParam &&
            fromParam.startsWith("/") &&
            !fromParam.startsWith("//")
              ? fromParam
              : null;

          const redirectUrl = safeFrom
            ? `/verify-otp?email=${encodeURIComponent(
                email
              )}&from=${encodeURIComponent(safeFrom)}&fromLogin=true`
            : `/verify-otp?email=${encodeURIComponent(email)}&fromLogin=true`;

          setTimeout(() => router.push(redirectUrl), 1200);
          return;
        }
      } catch (err: any) {
        const msg =
          err.message ||
          "Unable to sign in. Your data remains secure. Please check your credentials and try again.";
        setError(msg);
        toast.error(msg);
      }
    });
  };

  // -------------------------
  //  FORM SUBMISSION
  // -------------------------
  const onSubmit = async (data: LoginFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    handleAction(formData);
  };

  return (
    <Card className='w-full border-0 shadow-2xl bg-white/80 backdrop-blur-sm'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='pt-6 p-6 space-y-6'>
          {/* Email Input */}
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-sm font-medium'>
              Email address
              <span className='text-destructive ml-1' aria-label='required'>
                *
              </span>
            </Label>
            <div className='relative group'>
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                className='pl-10 h-11'
                aria-required='true'
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
            </div>
            <FieldError error={errors.email?.message} id='email-error' />
          </div>

          {/* Password Input */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium'>
                Password
                <span className='text-destructive ml-1' aria-label='required'>
                  *
                </span>
              </span>
              <Link
                href='/forgot-password'
                className='text-sm text-primary hover:text-primary/80 font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1'
              >
                Forgot?
              </Link>
            </div>
            <PasswordInput
              id='password'
              placeholder='Enter your password'
              required
              {...register("password")}
              error={errors.password?.message}
            />
          </div>

          {/* Error Message */}
          {error && <ErrorAlert message={error} />}

          {/* Submit Button */}
          <LoadingButton
            type='submit'
            loading={isPending}
            loadingText='Signing in...'
            className='w-full h-11 bg-gradient-to-r from-primary to-primary/90 font-semibold shadow-lg hover:shadow-xl transition-all'
          >
            Sign in
          </LoadingButton>

          {/* Divider */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-200' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white px-2 text-gray-500'>
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className='grid grid-cols-2 gap-3'>
            <button
              type='button'
              disabled
              aria-label='Sign in with Google (coming soon)'
              className='h-11 px-4 border rounded-lg hover:bg-muted transition-all flex items-center justify-center gap-2 opacity-60 cursor-not-allowed'
            >
              <svg className='h-5 w-5' viewBox='0 0 24 24'>
                <path
                  fill='currentColor'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                />
                <path
                  fill='currentColor'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                />
                <path
                  fill='currentColor'
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                />
                <path
                  fill='currentColor'
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                />
              </svg>
              <span className='text-sm font-medium'>Google</span>
            </button>
            <button
              type='button'
              disabled
              aria-label='Sign in with GitHub (coming soon)'
              className='h-11 px-4 border rounded-lg hover:bg-muted transition-all flex items-center justify-center gap-2 opacity-60 cursor-not-allowed'
            >
              <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z' />
              </svg>
              <span className='text-sm font-medium'>GitHub</span>
            </button>
          </div>
        </CardContent>

        <CardFooter className='flex flex-col space-y-4 p-6 pt-0'>
          <p className='text-sm text-center text-muted-foreground'>
            Don&#39;t have an account?{" "}
            <Link
              href='/signup'
              className='font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1'
            >
              Create account
            </Link>
          </p>

          {/* Security Badge */}
          <div
            className='flex items-center justify-center gap-2 text-xs text-muted-foreground'
            role='img'
            aria-label='Secured with 256-bit SSL encryption'
          >
            <svg
              className='h-3 w-3'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
            <span>Secured with 256-bit SSL encryption</span>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
