"use client";

import { registerUser } from "@/app/actions/register-user";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { FieldError } from "@/components/shared/FieldError";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hook/use-toast";
import { SignupFormData, signupSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";

// Password strength calculator
const calculatePasswordStrength = (
  password: string,
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
  const [genderValue, setGenderValue] = useState("");
  const [profileImage, setProfileImage] = useState("");

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
        4,
      )}) ${limitedNumber.slice(4)}`;
    } else {
      return `+${limitedNumber.slice(0, 1)} (${limitedNumber.slice(
        1,
        4,
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
            "Account created! Please verify your email to activate your account.",
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
    if (data.gender) formData.append("gender", data.gender);
    if (profileImage) formData.append("profileImage", profileImage);
    if (data.bio) formData.append("bio", data.bio);
    if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth);
    if (data.addressLine1) formData.append("addressLine1", data.addressLine1);
    if (data.addressLine2) formData.append("addressLine2", data.addressLine2);
    if (data.city) formData.append("city", data.city);
    if (data.state) formData.append("state", data.state);
    if (data.zipCode) formData.append("zipCode", data.zipCode);

    handleAction(formData);
  };

  return (
    <Card className='w-full max-w-4xl mx-auto border border-gray-200 shadow-lg bg-white/95 backdrop-blur-sm rounded-2xl'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='p-8 md:p-12'>
          <div className='text-center mb-10'>
            <h1 className='text-4xl font-bold text-gray-800'>
              Create an Account
            </h1>
            <p className='text-gray-500 mt-2'>
              Join us and take control of your health.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
            {/* Left Column: Profile Image */}
            <div className='md:col-span-1 flex flex-col items-center space-y-4'>
              <h3 className='text-lg font-semibold text-gray-700'>
                Profile Picture
              </h3>
              <ImageUpload
                value={profileImage}
                onChange={(image) => setProfileImage(image)}
              />
              <p className='text-xs text-gray-500 text-center'>
                A profile picture helps personalize your account.
              </p>
            </div>

            {/* Right Column: Form Fields */}
            <div className='md:col-span-2 space-y-6'>
              {/* Name Fields */}
              <div className='grid grid-cols-2 gap-5'>
                <div className='space-y-2.5'>
                  <Label
                    htmlFor='firstName'
                    className='text-sm font-semibold text-gray-900'
                  >
                    First Name
                    <span className='text-red-500 ml-1' aria-label='required'>
                      *
                    </span>
                  </Label>
                  <div className='relative group'>
                    <User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors' />
                    <Input
                      id='firstName'
                      placeholder='John'
                      className='pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
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

                <div className='space-y-2.5'>
                  <Label
                    htmlFor='lastName'
                    className='text-sm font-semibold text-gray-900'
                  >
                    Last Name
                    <span className='text-red-500 ml-1' aria-label='required'>
                      *
                    </span>
                  </Label>
                  <div className='relative group'>
                    <User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors' />
                    <Input
                      id='lastName'
                      placeholder='Doe'
                      className='pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
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
              <div className='space-y-2.5'>
                <Label
                  htmlFor='email'
                  className='text-sm font-semibold text-gray-900'
                >
                  Email Address
                  <span className='text-red-500 ml-1' aria-label='required'>
                    *
                  </span>
                </Label>
                <div className='relative group'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='you@example.com'
                    className='pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    aria-required='true'
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />
                </div>
                <FieldError error={errors.email?.message} id='email-error' />
              </div>

              {/* Phone */}
              <div className='space-y-2.5'>
                <Label
                  htmlFor='phone'
                  className='text-sm font-semibold text-gray-900'
                >
                  Phone Number{" "}
                  <span className='text-gray-500 font-normal text-xs'>
                    (optional)
                  </span>
                </Label>
                <div className='relative group'>
                  <Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors' />
                  <Input
                    id='phone'
                    type='tel'
                    placeholder='+1 (555) 123-4567'
                    value={phoneValue}
                    onChange={handlePhoneChange}
                    className='pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    aria-invalid={errors.phone ? "true" : "false"}
                    aria-describedby={
                      errors.phone ? "phone-error" : "phone-hint"
                    }
                  />
                </div>
                <FieldError error={errors.phone?.message} id='phone-error' />
                {phoneValue && !errors.phone && (
                  <p id='phone-hint' className='text-xs text-gray-500'>
                    ✓ US phone format
                  </p>
                )}
              </div>

              {/* Password */}
              <div className='space-y-2.5 mt-1'>
                <PasswordInput
                  id='password'
                  label='Password'
                  labelClassName='text-sm font-semibold text-gray-900'
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
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            bar <= passwordStrength.score
                              ? passwordStrength.bgColor
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-xs font-medium ${passwordStrength.color}`}
                    >
                      Password strength: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className='space-y-2.5'>
                <PasswordInput
                  id='confirmPassword'
                  label='Confirm Password'
                  labelClassName='text-sm font-semibold text-gray-900'
                  placeholder='Re-enter your password'
                  required
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                />
              </div>

              {/* Gender */}
              <div className='space-y-2.5'>
                <Label
                  htmlFor='gender'
                  className='text-sm font-semibold text-gray-900'
                >
                  Gender
                  <span className='text-gray-500 font-normal text-xs ml-1'>
                    (optional)
                  </span>
                </Label>
                <Select
                  value={genderValue}
                  onValueChange={(value) => {
                    setGenderValue(value);
                    setValue("gender", value as any, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger className='h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'>
                    <SelectValue placeholder='Select gender' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='MALE'>Male</SelectItem>
                    <SelectItem value='FEMALE'>Female</SelectItem>
                    <SelectItem value='NON_BINARY'>Non-Binary</SelectItem>
                    <SelectItem value='PREFER_NOT_TO_SAY'>
                      Prefer Not to Say
                    </SelectItem>
                    <SelectItem value='OTHER'>Other</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError error={errors.gender?.message} id='gender-error' />
              </div>

              {/* Bio */}
              <div className='space-y-2.5'>
                <Label
                  htmlFor='bio'
                  className='text-sm font-semibold text-gray-900'
                >
                  Bio
                  <span className='text-gray-500 font-normal text-xs ml-1'>
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id='bio'
                  placeholder='Tell us about yourself'
                  rows={3}
                  className='border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none'
                  {...register("bio")}
                  maxLength={500}
                />
                <FieldError error={errors.bio?.message} id='bio-error' />
              </div>

              {/* Date of Birth */}
              <div className='space-y-2.5'>
                <Label
                  htmlFor='dateOfBirth'
                  className='text-sm font-semibold text-gray-900'
                >
                  Date of Birth
                  <span className='text-gray-500 font-normal text-xs ml-1'>
                    (optional)
                  </span>
                </Label>
                <div className='relative group'>
                  <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors' />
                  <Input
                    id='dateOfBirth'
                    type='date'
                    className='pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    {...register("dateOfBirth")}
                  />
                </div>
                <FieldError
                  error={errors.dateOfBirth?.message}
                  id='dateOfBirth-error'
                />
              </div>

              {/* Address Fields */}
              <div className='pt-6 mt-6 border-t-2 border-blue-100'>
                <h3 className='text-base font-bold text-gray-900 mb-4'>
                  Address
                  <span className='text-gray-500 font-normal text-sm ml-2'>
                    (optional)
                  </span>
                </h3>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5'>
                  <div className='space-y-2.5'>
                    <Label
                      htmlFor='addressLine1'
                      className='text-sm font-semibold text-gray-900'
                    >
                      Address Line 1
                    </Label>
                    <div className='relative group'>
                      <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors' />
                      <Input
                        id='addressLine1'
                        placeholder='123 Main St'
                        className='pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        {...register("addressLine1")}
                      />
                    </div>
                    <FieldError
                      error={errors.addressLine1?.message}
                      id='addressLine1-error'
                    />
                  </div>

                  <div className='space-y-2.5'>
                    <Label
                      htmlFor='addressLine2'
                      className='text-sm font-semibold text-gray-900'
                    >
                      Address Line 2
                    </Label>
                    <div className='relative group'>
                      <Input
                        id='addressLine2'
                        placeholder='Apt, suite, etc.'
                        className='h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        {...register("addressLine2")}
                      />
                    </div>
                    <FieldError
                      error={errors.addressLine2?.message}
                      id='addressLine2-error'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
                  <div className='space-y-2.5'>
                    <Label
                      htmlFor='city'
                      className='text-sm font-semibold text-gray-900'
                    >
                      City
                    </Label>
                    <Input
                      id='city'
                      placeholder='New York'
                      className='h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      {...register("city")}
                    />
                    <FieldError error={errors.city?.message} id='city-error' />
                  </div>

                  <div className='space-y-2.5'>
                    <Label
                      htmlFor='state'
                      className='text-sm font-semibold text-gray-900'
                    >
                      State/Province
                    </Label>
                    <Input
                      id='state'
                      placeholder='NY'
                      className='h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      maxLength={2}
                      {...register("state")}
                    />
                    <FieldError
                      error={errors.state?.message}
                      id='state-error'
                    />
                  </div>

                  <div className='space-y-2.5'>
                    <Label
                      htmlFor='zipCode'
                      className='text-sm font-semibold text-gray-900'
                    >
                      Zip Code
                    </Label>
                    <Input
                      id='zipCode'
                      placeholder='10001'
                      className='h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      {...register("zipCode")}
                    />
                    <FieldError
                      error={errors.zipCode?.message}
                      id='zipCode-error'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && <ErrorAlert message={error} />}

          {/* Security & Privacy Notice */}
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 mt-8'>
            <div className='flex items-start gap-3'>
              <svg
                className='h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
              <p className='text-xs text-gray-700 leading-relaxed'>
                <span className='font-semibold text-gray-900'>
                  Your data is secure:
                </span>{" "}
                All information is encrypted and HIPAA-compliant. We never share
                your health data without explicit consent.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <LoadingButton
            type='submit'
            loading={isPending}
            loadingText='Creating your account...'
            className='w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 mt-8'
          >
            Create Account
          </LoadingButton>

          {/* Terms Notice */}
          <p className='text-xs text-center text-gray-600 leading-relaxed mt-6'>
            By creating an account, you agree to our{" "}
            <a
              href='#'
              className='text-blue-600 hover:text-blue-700 font-semibold underline-offset-2 hover:underline'
            >
              Terms of Service
            </a>
            ,{" "}
            <a
              href='#'
              className='text-blue-600 hover:text-blue-700 font-semibold underline-offset-2 hover:underline'
            >
              Privacy Policy
            </a>
            , and{" "}
            <a
              href='#'
              className='text-blue-600 hover:text-blue-700 font-semibold underline-offset-2 hover:underline'
            >
              HIPAA Notice
            </a>
          </p>
        </CardContent>

        <CardFooter className='flex flex-col space-y-3 px-7 py-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl'>
          {/* Sign In Link */}
          <p className='text-sm text-center text-gray-600 w-full'>
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
              className='font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200'
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
