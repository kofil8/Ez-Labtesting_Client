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

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='pt-4 p-4 space-y-4'>
          {/* Email */}
          <div>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' type='email' {...register("email")} />
            {errors.email && (
              <p className='text-xs text-destructive'>{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' type='password' {...register("password")} />
            {errors.password && (
              <p className='text-xs text-destructive'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className='text-xs'>
            <Link
              href='/forgot-password'
              className='text-primary hover:underline'
            >
              Forgot password?
            </Link>
          </div>
        </CardContent>

        <CardFooter className='flex flex-col space-y-3 p-4'>
          {error && <p className='text-sm text-destructive'>{error}</p>}

          <Button type='submit' disabled={isPending} className='w-full'>
            {isPending ? "Signing in..." : "Sign In"}
          </Button>

          <p className='text-xs text-center text-muted-foreground'>
            Don&#39;t have an account?{" "}
            <Link href='/signup' className='text-primary hover:underline'>
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
