"use client";

import { loginUser } from "@/app/actions/login-user";
import { resendOtp } from "@/app/actions/resend-otp";
import { FormStateMessage } from "@/components/auth/FormStateMessage";
import { CapsLockIndicator } from "@/components/shared/CapsLockIndicator";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hook/use-toast";
import { useAuth } from "@/lib/auth-context";
import { getPushToken } from "@/lib/firebase/getPushToken";
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

  // -------------------------
  //  MAIN LOGIN HANDLER
  // -------------------------
  const handleAction = (formData: FormData) => {
    setError("");

    startTransition(async () => {
      try {
        // 🔥 Get push token before sending login
        const shouldAttachPushToken =
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted";

        const pushToken = shouldAttachPushToken ? await getPushToken() : null;
        if (pushToken) {
          formData.append("pushToken", pushToken);
          formData.append("platform", "web");
        }

        const res = await loginUser(formData);

        // ---------------------------
        // MFA REQUIRED
        // ---------------------------
        if (res?.mfaRequired && res.tempToken) {
          toast({ title: "Two-factor authentication required" });
          setTimeout(() => {
            router.push(`/mfa?tempToken=${encodeURIComponent(res.tempToken)}`);
          }, 800);
          return;
        }

        // ---------------------------
        // SUCCESS
        // ---------------------------
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

          // Check if user needs to set up MFA (mandatory for admin/lab partner)
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

          toast({ title: "Please verify your email." });

          // Auto resend OTP
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

        // ---------------------------
        // FAILURE (non-verification)
        // ---------------------------
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
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      {/* Success Message */}
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

      {/* Error Message */}
      {error && (
        <FormStateMessage
          type='error'
          message="We couldn't sign you in"
          details={error}
          onDismiss={() => setError("")}
        />
      )}

      {/* Email / Phone Field */}
      <div className='space-y-1.5'>
        <Label
          htmlFor='email'
          className='block text-[13px] font-semibold text-slate-800'
        >
          Email or Mobile Number
        </Label>
        <div className='group relative'>
          <Mail className='pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600' />
          <Input
            id='email'
            type='text'
            autoComplete='email'
            inputMode='email'
            placeholder='you@example.com or 555-000-1234'
            className='h-11 rounded-xl border border-slate-300 bg-slate-50/60 pl-10 text-sm placeholder:text-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500'
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

      {/* Password Field */}
      <div className='space-y-1.5'>
        <div className='flex items-center justify-between'>
          <Label
            htmlFor='password'
            className='text-[13px] font-semibold text-slate-800'
          >
            Password
          </Label>
          <Link
            href='/forgot-password'
            className='text-xs font-semibold text-blue-600 transition-colors hover:text-blue-800'
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
          className='h-11 rounded-xl border-slate-300 bg-slate-50/60 text-sm transition-all focus:bg-white'
        />
        <CapsLockIndicator />
      </div>

      {/* Remember Me + Submit */}
      <div className='flex items-center gap-2'>
        <input
          type='checkbox'
          id='rememberMe'
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          disabled={isPending}
          className='h-[15px] w-[15px] cursor-pointer rounded border-slate-300 accent-blue-600 focus:ring-2 focus:ring-blue-500'
          aria-label='Keep me signed in on this device'
        />
        <label
          htmlFor='rememberMe'
          className='cursor-pointer text-[13px] text-slate-600'
        >
          Keep me signed in
        </label>
      </div>

      <LoadingButton
        type='submit'
        disabled={isPending}
        loading={isPending}
        loadingText='Signing in…'
        className='h-[46px] w-full rounded-xl bg-[#2763e8] text-[15px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.7)] transition-all hover:bg-[#1e54d0] hover:shadow-[0_12px_28px_-10px_rgba(37,99,235,0.85)] active:translate-y-px disabled:opacity-60'
      >
        Sign In
      </LoadingButton>

      {/* ---- Secondary actions ---- */}
      <div className='relative flex items-center gap-3 py-1'>
        <span className='flex-1 border-t border-slate-200' />
        <span className='text-[11px] font-medium uppercase tracking-wider text-slate-400'>
          or
        </span>
        <span className='flex-1 border-t border-slate-200' />
      </div>

      <p className='text-center text-[13px] leading-relaxed text-slate-500'>
        Patients can{" "}
        <Link
          href='/signup'
          className='font-semibold text-blue-600 transition-colors hover:text-blue-800'
        >
          create an account online
        </Link>
        . Clinics &amp; lab partners,{" "}
        <Link
          href='mailto:support@ezlabtesting.com?subject=Lab%20partner%20onboarding'
          className='font-semibold text-blue-600 transition-colors hover:text-blue-800'
        >
          contact our team
        </Link>
        .
      </p>

      <div className='grid grid-cols-2 gap-3'>
        <Link
          href='/help-center'
          className='rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 text-center text-[13px] font-medium text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
        >
          Help Center
        </Link>
        <Link
          href='mailto:support@ezlabtesting.com'
          className='rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 text-center text-[13px] font-medium text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
        >
          Contact Support
        </Link>
      </div>
    </form>
  );
}
