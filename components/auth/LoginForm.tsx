"use client";

import { resendOtp } from "@/app/actions/resend-otp";
import { FormStateMessage } from "@/components/auth/FormStateMessage";
import { CapsLockIndicator } from "@/components/shared/CapsLockIndicator";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hook/use-toast";
import { loginUser } from "@/lib/auth/client";
import { useAuth } from "@/lib/auth-context";
import { LoginFormData, loginSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authContext = useAuth();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const emailDescriptionId = errors.email
    ? "email-error email-help"
    : "email-help";

  const handleAction = (formData: FormData) => {
    setError("");

    startTransition(async () => {
      try {
        const res = await loginUser(formData);

        if (res?.mfaRequired && res.tempToken) {
          toast({ title: "Two-factor authentication required" });
          setTimeout(() => {
            router.push(`/mfa?tempToken=${encodeURIComponent(res.tempToken)}`);
          }, 800);
          return;
        }

        if (res?.success) {
          await authContext.refreshAuth();
          toast({ title: "Login successful!" });

          const fromParam = searchParams.get("from");
          const safeFrom =
            fromParam &&
            fromParam.startsWith("/") &&
            !fromParam.startsWith("//")
              ? fromParam
              : null;

          const user = authContext.user;
          const mandatoryRoles = ["ADMIN", "LAB_PARTNER"];
          const roleKey = user?.role?.toUpperCase();

          if (
            user &&
            roleKey &&
            mandatoryRoles.includes(roleKey) &&
            !user.mfaEnabled
          ) {
            toast({
              title: "Two-factor authentication is required for your account.",
            });
            setTimeout(() => {
              router.push("/profile/security?setup=required&mandatory=true");
            }, 1000);
            return;
          }

          if (
            user &&
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

        if (res?.requiresVerification) {
          const email = res.email || (formData.get("email") as string);

          if (typeof window !== "undefined") {
            sessionStorage.setItem("otp_email", email);
          }

          toast({ title: "Please verify your email." });

          try {
            const resendForm = new FormData();
            resendForm.append("email", email);
            await resendOtp(resendForm);
            toast({ title: "A new OTP has been sent." });
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
                email,
              )}&from=${encodeURIComponent(safeFrom)}&fromLogin=true`
            : `/verify-otp?email=${encodeURIComponent(email)}&fromLogin=true`;

          setTimeout(() => router.push(redirectUrl), 1200);
          return;
        }

        const failMessage = res?.message || "Login failed";
        setError(failMessage);
        toast({ title: failMessage, variant: "destructive" });
      } catch (err: any) {
        const msg =
          err.message ||
          "Unable to sign in. Your data remains secure. Please check your credentials and try again.";
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5 sm:space-y-6'>
      {searchParams.get("verified") === "true" && (
        <FormStateMessage
          type='success'
          message='Email Verified Successfully'
          details='Your account is now active. You can now sign in.'
          autoDismissMs={4000}
        />
      )}

      {successMessage && (
        <FormStateMessage
          type='success'
          message={successMessage}
          autoDismissMs={2000}
          onDismiss={() => setSuccessMessage("")}
        />
      )}

      {error && (
        <FormStateMessage
          type='error'
          message="We couldn't sign you in"
          details={error}
          onDismiss={() => setError("")}
        />
      )}

      <div className='space-y-2'>
        <Label
          htmlFor='email'
          className='block text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-700'
        >
          Email address or mobile number
        </Label>
        <div className='group relative'>
          <Mail className='pointer-events-none absolute left-4 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-sky-700' />
          <Input
            id='email'
            type='text'
            autoComplete='email'
            inputMode='email'
            placeholder='you@example.com or 555-000-1234'
            className='h-11 rounded-[20px] border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-none placeholder:text-slate-400 transition-colors focus:border-sky-700 focus:ring-4 focus:ring-sky-100 hover:border-slate-300 disabled:bg-slate-50 disabled:text-slate-500 sm:h-12 sm:rounded-2xl'
            aria-required='true'
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={emailDescriptionId}
            disabled={isPending}
            {...register("email")}
          />
        </div>
        <p id='email-help' className='sr-only'>
          Use the email or mobile number you registered with as a patient or
          provider.
        </p>
        {errors.email && (
          <p id='email-error' className='text-xs font-medium text-red-600'>
            {errors.email.message}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <div className='flex flex-col items-start gap-1.5 xs:flex-row xs:items-center xs:justify-between xs:gap-3'>
          <Label
            htmlFor='password'
            className='text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-700'
          >
            Password
          </Label>
          <Link
            href='/forgot-password'
            className='text-xs font-semibold text-sky-700 transition-colors hover:text-sky-900'
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id='password'
          autoComplete='current-password'
          placeholder='Enter your password'
          required
          disabled={isPending}
          {...register("password")}
          error={errors.password?.message}
          className='h-11 rounded-[20px] border-slate-200 bg-white text-sm shadow-none transition-colors focus:border-sky-700 focus:ring-4 focus:ring-sky-100 hover:border-slate-300 sm:h-12 sm:rounded-2xl'
        />
        <CapsLockIndicator />
      </div>

      <div className='flex items-start gap-2.5 rounded-[20px] border border-slate-200 bg-slate-50/70 px-3.5 py-3 sm:items-center sm:rounded-2xl'>
        <input
          type='checkbox'
          id='rememberMe'
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          disabled={isPending}
          className='h-4 w-4 cursor-pointer rounded border-slate-300 accent-sky-700 focus:ring-2 focus:ring-sky-700'
          aria-label='Keep me signed in on this device'
        />
        <label
          htmlFor='rememberMe'
          className='cursor-pointer text-[13px] font-medium text-slate-600'
        >
          Keep me signed in on this device
        </label>
      </div>

      <LoadingButton
        type='submit'
        disabled={isPending}
        loading={isPending}
        loadingText='Signing in...'
        className='h-11 w-full rounded-[20px] bg-[#123c66] text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[#0f3355] disabled:opacity-60 sm:h-12 sm:rounded-2xl'
      >
        Sign In
      </LoadingButton>

      <div className='relative flex items-center gap-3 py-1'>
        <span className='flex-1 border-t border-slate-200' />
        <span className='text-[11px] font-medium uppercase tracking-wider text-slate-400'>
          account help
        </span>
        <span className='flex-1 border-t border-slate-200' />
      </div>

      <p className='text-left text-[13px] leading-6 text-slate-500 sm:text-center'>
        New to EzLabTesting? Patients can{" "}
        <Link
          href='/signup'
          className='font-semibold text-sky-700 transition-colors hover:text-sky-900'
        >
          create an account online
        </Link>
        . Clinics and lab partners can{" "}
        <Link
          href='mailto:support@ezlabtesting.com?subject=Lab%20partner%20onboarding'
          className='font-semibold text-sky-700 transition-colors hover:text-sky-900'
        >
          contact our team
        </Link>
        .
      </p>

      <div className='grid grid-cols-1 gap-3 xs:grid-cols-2'>
        <Link
          href='/help-center'
          className='rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-center text-[13px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 sm:rounded-2xl'
        >
          Help Center
        </Link>
        <Link
          href='mailto:support@ezlabtesting.com'
          className='rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-center text-[13px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 sm:rounded-2xl'
        >
          Contact Support
        </Link>
      </div>
    </form>
  );
}
