"use client";

import { FieldError } from "@/components/shared/FieldError";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hook/use-toast";
import { useAuth } from "@/lib/auth-context";
import { loginUser, resendOtp } from "@/lib/auth/client";
import { getDashboardRouteForRole } from "@/lib/auth/shared";
import { LoginFormData, loginSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { LOGIN_COPY } from "./constants";
import { LoginHelp } from "./login-help";

function getSafeRedirectTarget(from: string | null) {
  if (!from || !from.startsWith("/") || from.startsWith("//")) {
    return null;
  }

  return from;
}

interface StatusMessageProps {
  variant: "error" | "success";
  title: string;
  description: string;
}

function StatusMessage({ variant, title, description }: StatusMessageProps) {
  const isError = variant === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        isError
          ? "border-red-200 bg-red-50 text-red-900"
          : "border-emerald-200 bg-emerald-50 text-emerald-900"
      }`}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      aria-atomic='true'
    >
      <div className='flex items-start gap-3'>
        <Icon
          className={`mt-0.5 h-4 w-4 shrink-0 ${
            isError ? "text-red-600" : "text-emerald-600"
          }`}
          aria-hidden='true'
        />
        <div className='min-w-0'>
          <p className='text-sm font-semibold'>{title}</p>
          <p className='mt-1 text-sm leading-6'>{description}</p>
        </div>
      </div>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authContext = useAuth();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const emailDescriptionId = errors.email
    ? "login-email-help login-email-error"
    : "login-email-help";

  const handleAction = (formData: FormData) => {
    setError("");

    startTransition(async () => {
      try {
        const emailOrPhone = String(formData.get("email") || "");
        const password = String(formData.get("password") || "");
        const res = await loginUser({
          email: emailOrPhone,
          password,
        });
        const safeFrom = getSafeRedirectTarget(searchParams.get("from"));

        if (res?.mfaRequired && res.tempToken) {
          toast({ title: "Two-factor authentication required" });
          setTimeout(() => {
            const mfaUrl = safeFrom
              ? `/mfa?tempToken=${encodeURIComponent(
                  res.tempToken,
                )}&from=${encodeURIComponent(safeFrom)}`
              : `/mfa?tempToken=${encodeURIComponent(res.tempToken)}`;
            router.push(mfaUrl);
          }, 800);
          return;
        }

        if (res?.success) {
          const user = await authContext.refreshAuth();

          if (!user) {
            throw new Error("Unable to load your account after login.");
          }

          toast({ title: "Login successful!" });
          const mandatoryRoles = ["ADMIN", "LAB_PARTNER"];
          const roleKey = user.role?.toUpperCase();

          if (roleKey && mandatoryRoles.includes(roleKey) && !user.mfaEnabled) {
            toast({
              title: "Two-factor authentication is required for your account.",
            });
            setTimeout(() => {
              router.push("/profile/security?setup=required&mandatory=true");
            }, 1000);
            return;
          }

          if (
            roleKey === "SUPER_ADMIN" &&
            !user.mfaEnabled &&
            res?.isFirstLogin
          ) {
            toast({
              title: "Enable two-factor authentication for extra security.",
            });
            setTimeout(() => {
              router.push("/profile/security?setup=suggested&firstLogin=true");
            }, 1000);
            return;
          }

          if (safeFrom) {
            setTimeout(() => {
              router.push(safeFrom);
            }, 800);
            return;
          }

          setTimeout(() => {
            router.push(getDashboardRouteForRole(user.role));
          }, 800);
          return;
        }

        if (res?.requiresVerification) {
          const email = res.email || emailOrPhone;

          if (typeof window !== "undefined") {
            sessionStorage.setItem("otp_email", email);
          }

          toast({ title: "Please verify your email." });

          try {
            await resendOtp(email);
            toast({ title: "A new OTP has been sent." });
          } catch {}

          const safeFrom = getSafeRedirectTarget(searchParams.get("from"));
          const redirectUrl = safeFrom
            ? `/verify-otp?email=${encodeURIComponent(
                email,
              )}&from=${encodeURIComponent(safeFrom)}&fromLogin=true`
            : `/verify-otp?email=${encodeURIComponent(email)}&fromLogin=true`;

          setTimeout(() => router.push(redirectUrl), 1200);
          return;
        }

        const failMessage = res?.message || "Login failed";
        setError(failMessage);
        toast({ title: failMessage, variant: "destructive" });
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Unable to sign in. Please check your credentials and try again.";
        setError(msg);
        toast({ title: msg, variant: "destructive" });
      }
    });
  };

  const onSubmit = async (data: LoginFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    handleAction(formData);
  };

  const isVerified = searchParams.get("verified") === "true";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {isVerified ? (
        <StatusMessage
          variant='success'
          title={LOGIN_COPY.verifiedTitle}
          description={LOGIN_COPY.verifiedDescription}
        />
      ) : null}

      {error ? (
        <StatusMessage
          variant='error'
          title="We couldn't sign you in"
          description={error}
        />
      ) : null}

      <div className='space-y-2.5'>
        <Label htmlFor='email' className='text-sm font-medium text-slate-700'>
          {LOGIN_COPY.emailLabel}
        </Label>
        <Input
          id='email'
          type='text'
          autoComplete='email'
          inputMode='email'
          placeholder={LOGIN_COPY.emailPlaceholder}
          className='h-11 rounded-xl border-slate-200 bg-white text-sm text-slate-900 shadow-sm shadow-slate-950/[0.03] placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 sm:h-12'
          aria-required='true'
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={emailDescriptionId}
          disabled={isPending}
          {...register("email")}
        />
        <p id='login-email-help' className='sr-only'>
          Use the email address or mobile number associated with your account.
        </p>
        <FieldError error={errors.email?.message} id='login-email-error' />
      </div>

      <div className='space-y-2.5'>
        <div className='flex items-center justify-between gap-3'>
          <Label
            htmlFor='password'
            className='text-sm font-medium text-slate-700'
          >
            {LOGIN_COPY.passwordLabel}
          </Label>
          <Link
            href='/forgot-password'
            className='text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2'
          >
            {LOGIN_COPY.forgotPassword}
          </Link>
        </div>
        <PasswordInput
          id='password'
          autoComplete='current-password'
          placeholder={LOGIN_COPY.passwordPlaceholder}
          required
          disabled={isPending}
          showIcon={false}
          error={errors.password?.message}
          className='h-11 rounded-xl border-slate-200 bg-white text-sm text-slate-900 shadow-sm shadow-slate-950/[0.03] placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 sm:h-12'
          {...register("password")}
        />
      </div>

      <LoadingButton
        type='submit'
        disabled={isPending}
        loading={isPending}
        loadingText={LOGIN_COPY.submitPending}
        className='h-11 w-full rounded-xl bg-primary-700 text-sm font-semibold text-white shadow-md shadow-primary-900/20 transition-all hover:bg-primary-800 hover:shadow-lg hover:shadow-primary-900/25 sm:h-12'
      >
        {LOGIN_COPY.submit}
      </LoadingButton>

      <LoginHelp />
    </form>
  );
}
