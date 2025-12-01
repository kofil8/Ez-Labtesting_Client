"use client";

import { loginUser } from "@/app/actions/login-user";
import { resendOtp } from "@/app/actions/resend-otp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { getPushToken } from "@/lib/firebase/getPushToken";
import { LoginFormData, loginSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
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

          setTimeout(() => {
            router.push(safeFrom || "/");
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
        const msg = err.message || "Login failed";
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

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className='w-full border-0 shadow-2xl bg-white/80 backdrop-blur-sm'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='pt-6 p-6 space-y-6'>
          {/* Email Input */}
          <div className='space-y-2'>
            <Label
              htmlFor='email'
              className='text-sm font-medium text-gray-700'
            >
              Email address
            </Label>
            <div className='relative group'>
              <svg
                className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-cyan-600 transition-colors duration-200'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                className='pl-10 h-12 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200'
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className='text-xs text-red-500 font-medium mt-1 flex items-center gap-1'>
                <svg
                  className='h-3 w-3'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label
                htmlFor='password'
                className='text-sm font-medium text-gray-700'
              >
                Password
              </Label>
              <Link
                href='/forgot-password'
                className='text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors duration-200'
              >
                Forgot?
              </Link>
            </div>
            <div className='relative group'>
              <svg
                className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-cyan-600 transition-colors duration-200'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
              <Input
                id='password'
                type={showPassword ? "text" : "password"}
                placeholder='Enter your password'
                className='pl-10 pr-12 h-12 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200'
                {...register("password")}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200'
              >
                {showPassword ? (
                  <svg
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                    />
                  </svg>
                ) : (
                  <svg
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className='text-xs text-red-500 font-medium mt-1 flex items-center gap-1'>
                <svg
                  className='h-3 w-3'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200'>
              <svg
                className='h-5 w-5 text-red-500 flex-shrink-0 mt-0.5'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
              <p className='text-sm text-red-700 font-medium'>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={isPending}
            className='w-full h-12 bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 hover:from-cyan-700 hover:via-blue-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 group'
          >
            {isPending ? (
              <>
                <svg
                  className='h-5 w-5 mr-2 animate-spin'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <svg
                  className='h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 7l5 5m0 0l-5 5m5-5H6'
                  />
                </svg>
              </>
            )}
          </Button>

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
              className='h-11 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2 opacity-60 cursor-not-allowed'
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
              className='h-11 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2 opacity-60 cursor-not-allowed'
            >
              <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z' />
              </svg>
              <span className='text-sm font-medium'>GitHub</span>
            </button>
          </div>
        </CardContent>

        <CardFooter className='flex flex-col space-y-4 p-6 pt-0'>
          <p className='text-sm text-center text-gray-600'>
            Don&#39;t have an account?{" "}
            <Link
              href='/signup'
              className='font-semibold text-cyan-600 hover:text-cyan-700 transition-colors duration-200'
            >
              Create account
            </Link>
          </p>

          {/* Security Badge */}
          <div className='flex items-center justify-center gap-2 text-xs text-gray-500'>
            <svg
              className='h-3 w-3'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
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
