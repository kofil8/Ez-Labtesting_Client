"use client";

import { registerUser } from "@/app/actions/register-user";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { FieldError } from "@/components/shared/FieldError";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hook/use-toast";
import { SignupFormData, signupSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Password strength calculator
const calculatePasswordStrength = (
  password: string
): {
  score: number;
  label: string;
  color: string;
  bgColor: string;
} => {
  if (!password) return { score: 0, label: "", color: "", bgColor: "" };

  let score = 0;

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2)
    return {
      score: 1,
      label: "Weak",
      color: "text-red-600",
      bgColor: "bg-red-500",
    };
  if (score <= 4)
    return {
      score: 2,
      label: "Fair",
      color: "text-orange-600",
      bgColor: "bg-orange-500",
    };
  if (score <= 5)
    return {
      score: 3,
      label: "Good",
      color: "text-yellow-600",
      bgColor: "bg-yellow-500",
    };
  return {
    score: 4,
    label: "Strong",
    color: "text-green-600",
    bgColor: "bg-green-500",
  };
};

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast: toastHook } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const passwordStrength = calculatePasswordStrength(passwordValue);

  // Format phone number as US format: +1 (XXX) XXX-XXXX
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const phoneNumber = value.replace(/\D/g, "");

    // Limit to 11 digits (1 + 10 digits)
    const limitedNumber = phoneNumber.slice(0, 11);

    // Format based on length
    if (limitedNumber.length === 0) {
      return "";
    } else if (limitedNumber.length <= 1) {
      return `+${limitedNumber}`;
    } else if (limitedNumber.length <= 4) {
      return `+${limitedNumber.slice(0, 1)} (${limitedNumber.slice(1)}`;
    } else if (limitedNumber.length <= 7) {
      return `+${limitedNumber.slice(0, 1)} (${limitedNumber.slice(
        1,
        4
      )}) ${limitedNumber.slice(4)}`;
    } else {
      return `+${limitedNumber.slice(0, 1)} (${limitedNumber.slice(
        1,
        4
      )}) ${limitedNumber.slice(4, 7)}-${limitedNumber.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneValue(formatted);
    // Store the raw number for form submission
    const rawNumber = formatted.replace(/\D/g, "");
    setValue("phone", rawNumber, { shouldValidate: true });
  };

  const handleAction = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      try {
        const res = await registerUser(formData);
        if (res?.success) {
          toast.success(
            "Account created! Please verify your email to activate your account."
          );
          const email = res.email || (formData.get("email") as string);
          // Store email in sessionStorage for OTP verification
          if (typeof window !== "undefined") {
            sessionStorage.setItem("otp_email", email);
          }
          setTimeout(() => {
            router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
          }, 1000);
        }
      } catch (err: any) {
        const errorMessage =
          err.message ||
          "Unable to create your account. Your information is secure. Please verify your details and try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  const onSubmit = async (data: SignupFormData) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.phone) {
      formData.append("phoneNumber", data.phone);
    }
    handleAction(formData);
  };

  // TODO: Re-enable reCAPTCHA handlers
  // const handleCaptchaChange = (token: string | null) => {
  //   setCaptchaToken(token);
  // };

  // const handleCaptchaExpired = () => {
  //   setCaptchaToken(null);
  //   toast({
  //     title: "Verification expired",
  //     description: "Please complete the captcha again.",
  //     variant: "destructive",
  //   });
  // };

  return (
    <Card className='w-full border-0 shadow-2xl bg-white/80 backdrop-blur-sm'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='pt-6 p-6 space-y-5'>
          {/* Name Fields */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='firstName' className='text-sm font-medium'>
                First Name
                <span className='text-destructive ml-1' aria-label='required'>
                  *
                </span>
              </Label>
              <div className='relative group'>
                <User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
                <Input
                  id='firstName'
                  placeholder='John'
                  className='pl-10 h-11'
                  aria-required='true'
                  aria-invalid={errors.firstName ? "true" : "false"}
                  aria-describedby={
                    errors.firstName ? "firstName-error" : undefined
                  }
                  {...register("firstName")}
                />
              </div>
              <FieldError
                error={errors.firstName?.message}
                id='firstName-error'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='lastName' className='text-sm font-medium'>
                Last Name
                <span className='text-destructive ml-1' aria-label='required'>
                  *
                </span>
              </Label>
              <div className='relative group'>
                <User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
                <Input
                  id='lastName'
                  placeholder='Doe'
                  className='pl-10 h-11'
                  aria-required='true'
                  aria-invalid={errors.lastName ? "true" : "false"}
                  aria-describedby={
                    errors.lastName ? "lastName-error" : undefined
                  }
                  {...register("lastName")}
                />
              </div>
              <FieldError
                error={errors.lastName?.message}
                id='lastName-error'
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Phone */}
          <div className='space-y-2'>
            <Label htmlFor='phone' className='text-sm font-medium'>
              Phone number{" "}
              <span className='text-muted-foreground text-xs'>(optional)</span>
            </Label>
            <div className='relative group'>
              <Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
              <Input
                id='phone'
                type='tel'
                placeholder='+1 (555) 123-4567'
                value={phoneValue}
                onChange={handlePhoneChange}
                className='pl-10 h-11'
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
              />
            </div>
            <FieldError error={errors.phone?.message} id='phone-error' />
            {phoneValue && !errors.phone && (
              <p id='phone-hint' className='text-xs text-muted-foreground'>
                US phone format applied
              </p>
            )}
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <PasswordInput
              id='password'
              label='Password'
              placeholder='Create a strong password (min. 8 characters)'
              required
              {...register("password", {
                onChange: (e) => setPasswordValue(e.target.value),
              })}
              error={errors.password?.message}
            />
            {/* Password Strength Indicator */}
            {passwordValue && (
              <div className='space-y-2 animate-in fade-in slide-in-from-top-1 duration-200'>
                <div className='flex gap-1'>
                  {[1, 2, 3, 4].map((bar) => (
                    <div
                      key={bar}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        bar <= passwordStrength.score
                          ? passwordStrength.bgColor
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-medium ${passwordStrength.color}`}>
                  Password strength: {passwordStrength.label}
                </p>
              </div>
            )}
            {errors.password && (
              <p className='text-xs text-red-500 font-medium flex items-center gap-1'>
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

          {/* Confirm Password */}
          <div className='space-y-2'>
            <PasswordInput
              id='confirmPassword'
              label='Confirm Password'
              placeholder='Re-enter your password'
              required
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </div>

          {/* Error Message */}
          {error && <ErrorAlert message={error} />}

          {/* Submit Button */}
          <LoadingButton
            type='submit'
            loading={isPending}
            loadingText='Creating your account...'
            className='w-full h-11 bg-gradient-to-r from-primary to-primary/90 font-semibold shadow-lg hover:shadow-xl transition-all'
          >
            Create Account
          </LoadingButton>

          {/* Terms Notice */}
          <p className='text-xs text-center text-gray-500'>
            By creating an account, you agree to our{" "}
            <a
              href='#'
              className='text-cyan-600 hover:text-cyan-700 font-medium'
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href='#'
              className='text-cyan-600 hover:text-cyan-700 font-medium'
            >
              Privacy Policy
            </a>
          </p>
        </CardContent>

        <CardFooter className='flex flex-col space-y-4 p-6 pt-0'>
          <div className='relative w-full'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-200' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white px-2 text-gray-500'>
                Or sign up with
              </span>
            </div>
          </div>

          {/* Social Signup Buttons */}
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

          <p className='text-sm text-center text-gray-600'>
            Already have an account?{" "}
            <Link
              href={(() => {
                const fromParam = searchParams.get("from");
                const safeFrom =
                  fromParam &&
                  fromParam.startsWith("/") &&
                  !fromParam.startsWith("//")
                    ? fromParam
                    : null;
                return safeFrom
                  ? `/login?from=${encodeURIComponent(safeFrom)}`
                  : "/login";
              })()}
              className='font-semibold text-cyan-600 hover:text-cyan-700 transition-colors duration-200'
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
