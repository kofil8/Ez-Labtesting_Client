"use client";

import { registerUser } from "@/app/actions/register-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hook/use-toast";
import { SignupFormData, signupSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
          err.message || "Unable to create account. Please try again.";
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
              <Label
                htmlFor='firstName'
                className='text-sm font-medium text-gray-700'
              >
                First Name
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
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
                <Input
                  id='firstName'
                  placeholder='John'
                  className='pl-10 h-11 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200'
                  {...register("firstName")}
                />
              </div>
              {errors.firstName && (
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
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='lastName'
                className='text-sm font-medium text-gray-700'
              >
                Last Name
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
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
                <Input
                  id='lastName'
                  placeholder='Doe'
                  className='pl-10 h-11 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200'
                  {...register("lastName")}
                />
              </div>
              {errors.lastName && (
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
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
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
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className='space-y-2'>
            <Label
              htmlFor='phone'
              className='text-sm font-medium text-gray-700'
            >
              Phone number{" "}
              <span className='text-gray-400 text-xs'>(optional)</span>
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
                  d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                />
              </svg>
              <Input
                id='phone'
                type='tel'
                placeholder='+1 (555) 123-4567'
                value={phoneValue}
                onChange={handlePhoneChange}
                className='pl-10 h-12 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200'
              />
            </div>
            {errors.phone && (
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
                {errors.phone.message}
              </p>
            )}
            {phoneValue && !errors.phone && (
              <p className='text-xs text-gray-500 flex items-center gap-1'>
                <svg
                  className='h-3 w-3'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                US phone format applied
              </p>
            )}
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <Label
              htmlFor='password'
              className='text-sm font-medium text-gray-700'
            >
              Password
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
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
              <Input
                id='password'
                type={showPassword ? "text" : "password"}
                placeholder='Create a strong password'
                className='pl-10 pr-12 h-12 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200'
                {...register("password", {
                  onChange: (e) => setPasswordValue(e.target.value),
                })}
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
            <Label
              htmlFor='confirmPassword'
              className='text-sm font-medium text-gray-700'
            >
              Confirm Password
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
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? "text" : "password"}
                placeholder='Confirm your password'
                className='pl-10 pr-12 h-12 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200'
                {...register("confirmPassword")}
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200'
              >
                {showConfirmPassword ? (
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
            {errors.confirmPassword && (
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
                {errors.confirmPassword.message}
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
            className='w-full h-12 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700 text-white font-semibold shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300 group'
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
                Creating your account...
              </>
            ) : (
              <>
                Create Account
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
