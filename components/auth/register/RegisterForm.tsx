"use client";

import { FormStateMessage } from "@/components/auth/FormStateMessage";
import { FieldError } from "@/components/shared/FieldError";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { PhoneInputField } from "@/components/shared/PhoneInputField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/lib/auth/client";
import {
  SignupAccountFormData,
  signupAccountSchema,
} from "@/lib/schemas/auth-schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  ChevronRight,
  Home,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

const inputClassName =
  "h-12 rounded-xl border-slate-300 bg-slate-50/70 focus-visible:ring-blue-200";

function getPasswordStrength(password: string) {
  if (!password) {
    return { score: 0, label: "" };
  }

  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score: 1, label: "Weak" };
  if (score === 3) return { score: 2, label: "Fair" };
  if (score === 4) return { score: 3, label: "Good" };
  return { score: 4, label: "Strong" };
}

function getSafeRedirectTarget(from: string | null) {
  if (!from || !from.startsWith("/") || from.startsWith("//")) {
    return null;
  }

  return from;
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState("");
  const [phoneDisplayValue, setPhoneDisplayValue] = useState("");
  const [includeAddress, setIncludeAddress] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupAccountFormData>({
    resolver: zodResolver(signupAccountSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      gender: undefined,
      dateOfBirth: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const [password = "", gender] = useWatch({
    control,
    name: ["password", "gender"],
  });

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password],
  );
  const safeFrom = getSafeRedirectTarget(searchParams.get("from"));

  useEffect(() => {
    if (!error) {
      return;
    }

    feedbackRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [error]);

  const clearAddressFields = () => {
    const fields: Array<
      | "addressLine1"
      | "addressLine2"
      | "city"
      | "state"
      | "zipCode"
    > = ["addressLine1", "addressLine2", "city", "state", "zipCode"];

    fields.forEach((field) => {
      setValue(field, "", {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    });

    clearErrors(fields);
  };

  const handleAddressToggle = (checked: boolean) => {
    if (!checked) {
      clearAddressFields();
    }

    setIncludeAddress(checked);
  };

  const onSubmit = async (data: SignupAccountFormData) => {
    try {
      setError("");

      const response = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      });

      if (!response?.success) {
        return;
      }

      const email = response.email || data.email.trim();

      if (typeof window !== "undefined") {
        sessionStorage.setItem("otp_email", email);
      }

      const verifyUrl = safeFrom
        ? `/verify-otp?email=${encodeURIComponent(email)}&from=${encodeURIComponent(safeFrom)}`
        : `/verify-otp?email=${encodeURIComponent(email)}`;

      router.push(verifyUrl);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to complete registration right now. Please try again.";

      setError(message);
    }
  };

  const onInvalidSubmit = () => {
    setError("Please review the highlighted fields and try again.");
  };

  return (
    <div className='space-y-6'>
      {error ? (
        <div ref={feedbackRef}>
          <FormStateMessage
            type='error'
            message='Unable to continue'
            details={error}
            onDismiss={() => setError("")}
          />
        </div>
      ) : null}

      <form
        noValidate
        className='space-y-6'
        onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
      >
        <input type='hidden' {...register("phone")} />
        <input type='hidden' {...register("gender")} />

        <section className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label htmlFor='firstName'>First Name *</Label>
            <div className='relative'>
              <User className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
              <Input
                id='firstName'
                autoComplete='given-name'
                placeholder='John'
                className={cn(inputClassName, "pl-10")}
                {...register("firstName")}
              />
            </div>
            <FieldError error={errors.firstName?.message} id='firstName-error' />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='lastName'>Last Name *</Label>
            <div className='relative'>
              <User className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
              <Input
                id='lastName'
                autoComplete='family-name'
                placeholder='Doe'
                className={cn(inputClassName, "pl-10")}
                {...register("lastName")}
              />
            </div>
            <FieldError error={errors.lastName?.message} id='lastName-error' />
          </div>

          <div className='space-y-1.5 sm:col-span-2'>
            <Label htmlFor='email'>Email Address *</Label>
            <div className='relative'>
              <Mail className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
              <Input
                id='email'
                type='email'
                autoComplete='email'
                placeholder='you@example.com'
                className={cn(inputClassName, "pl-10")}
                {...register("email")}
              />
            </div>
            <FieldError error={errors.email?.message} id='email-error' />
          </div>

          <div className='sm:col-span-2'>
            <PhoneInputField
              id='phone'
              label='Phone Number'
              required
              value={phoneDisplayValue}
              defaultCountry='us'
              error={errors.phone?.message}
              helperText='Required for account verification and account updates.'
              onChange={(value) => {
                setPhoneDisplayValue(value);
                setValue("phone", value.replace(/\D/g, ""), {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />
          </div>

          <div className='space-y-1.5 sm:col-span-2'>
            <PasswordInput
              id='password'
              label='Password'
              required
              autoComplete='new-password'
              placeholder='Create a strong password'
              className={inputClassName}
              error={errors.password?.message}
              {...register("password")}
            />
            {password ? (
              <div className='rounded-2xl border border-slate-200 bg-slate-50 p-3'>
                <div className='flex gap-1.5'>
                  {[1, 2, 3, 4].map((segment) => (
                    <span
                      key={segment}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-colors",
                        segment <= passwordStrength.score
                          ? passwordStrength.score >= 4
                            ? "bg-emerald-600"
                            : passwordStrength.score === 3
                              ? "bg-blue-600"
                              : "bg-amber-500"
                          : "bg-slate-200",
                      )}
                    />
                  ))}
                </div>
                <p className='mt-2 text-xs text-slate-600'>
                  Password strength: {passwordStrength.label}
                </p>
              </div>
            ) : null}
          </div>

          <div className='space-y-1.5 sm:col-span-2'>
            <PasswordInput
              id='confirmPassword'
              label='Confirm Password'
              required
              autoComplete='new-password'
              placeholder='Re-enter your password'
              className={inputClassName}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='gender'>Gender *</Label>
            <div className='rounded-xl border border-slate-300 bg-white px-3 py-0.5'>
              <select
                id='gender'
                value={gender ?? ""}
                className='h-11 w-full bg-transparent text-sm text-slate-900 outline-none'
                onChange={(event) =>
                  setValue(
                    "gender",
                    event.target.value as SignupAccountFormData["gender"],
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  )
                }
              >
                <option value=''>Select gender</option>
                <option value='MALE'>Male</option>
                <option value='FEMALE'>Female</option>
                <option value='NON_BINARY'>Non-binary</option>
                <option value='PREFER_NOT_TO_SAY'>Prefer not to say</option>
                <option value='OTHER'>Other</option>
              </select>
            </div>
            <FieldError error={errors.gender?.message} id='gender-error' />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='dateOfBirth'>Date of Birth *</Label>
            <div className='relative'>
              <CalendarDays className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
              <Input
                id='dateOfBirth'
                type='date'
                className={cn(inputClassName, "bg-white pl-10")}
                {...register("dateOfBirth")}
              />
            </div>
            <FieldError
              error={errors.dateOfBirth?.message}
              id='dateOfBirth-error'
            />
          </div>
        </section>

        <section className='rounded-2xl border border-slate-200 bg-slate-50/50 p-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
            <div className='space-y-1'>
              <h2 className='text-base font-semibold text-slate-900'>
                Optional address details
              </h2>
              <p className='text-sm text-slate-500'>
                Add your address now for faster checkout later.
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <Checkbox
                id='include-address'
                checked={includeAddress}
                onCheckedChange={(checked) =>
                  handleAddressToggle(checked === true)
                }
              />
              <Label
                htmlFor='include-address'
                className='cursor-pointer text-sm font-medium text-slate-700'
              >
                Add address now
              </Label>
            </div>
          </div>

          {includeAddress ? (
            <div className='mt-6 grid gap-4 sm:grid-cols-2'>
              <div className='space-y-1.5 sm:col-span-2'>
                <Label htmlFor='addressLine1'>Address Line 1</Label>
                <div className='relative'>
                  <MapPin className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                  <Input
                    id='addressLine1'
                    autoComplete='address-line1'
                    placeholder='123 Main Street'
                    className={cn(inputClassName, "bg-white pl-10")}
                    {...register("addressLine1")}
                  />
                </div>
                <FieldError
                  error={errors.addressLine1?.message}
                  id='addressLine1-error'
                />
              </div>

              <div className='space-y-1.5 sm:col-span-2'>
                <Label htmlFor='addressLine2'>Address Line 2</Label>
                <div className='relative'>
                  <Home className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                  <Input
                    id='addressLine2'
                    autoComplete='address-line2'
                    placeholder='Apt, suite, unit, building'
                    className={cn(inputClassName, "bg-white pl-10")}
                    {...register("addressLine2")}
                  />
                </div>
                <FieldError
                  error={errors.addressLine2?.message}
                  id='addressLine2-error'
                />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='city'>City</Label>
                <div className='relative'>
                  <MapPin className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                  <Input
                    id='city'
                    autoComplete='address-level2'
                    placeholder='New York'
                    className={cn(inputClassName, "bg-white pl-10")}
                    {...register("city")}
                  />
                </div>
                <FieldError error={errors.city?.message} id='city-error' />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='state'>State</Label>
                <div className='relative'>
                  <MapPin className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                  <Input
                    id='state'
                    autoComplete='address-level1'
                    maxLength={2}
                    placeholder='NY'
                    className={cn(inputClassName, "bg-white pl-10 uppercase")}
                    {...register("state", {
                      setValueAs: (value) => String(value ?? "").toUpperCase(),
                    })}
                  />
                </div>
                <FieldError error={errors.state?.message} id='state-error' />
              </div>

              <div className='space-y-1.5 sm:col-span-2 md:col-span-1'>
                <Label htmlFor='zipCode'>Zip Code</Label>
                <div className='relative'>
                  <MapPin className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                  <Input
                    id='zipCode'
                    autoComplete='postal-code'
                    placeholder='10001'
                    className={cn(inputClassName, "bg-white pl-10")}
                    {...register("zipCode")}
                  />
                </div>
                <FieldError error={errors.zipCode?.message} id='zipCode-error' />
              </div>
            </div>
          ) : null}
        </section>

        <div className='flex flex-col gap-4 border-t border-slate-200 pt-6 lg:flex-row lg:items-end lg:justify-between'>
          <div className='space-y-3'>
            <p className='text-sm text-slate-600'>
              Already have an account?{" "}
              <Link
                href={
                  safeFrom
                    ? `/login?from=${encodeURIComponent(safeFrom)}`
                    : "/login"
                }
                className='font-semibold text-blue-700 transition-colors hover:text-blue-800'
              >
                Sign in
              </Link>
            </p>
            <p className='max-w-2xl text-xs leading-6 text-slate-500'>
              By creating an account, you agree to our{" "}
              <Link
                href='/terms-of-service'
                className='font-semibold text-slate-700 transition-colors hover:text-slate-950'
              >
                Terms of Service
              </Link>
              ,{" "}
              <Link
                href='/privacy-policy'
                className='font-semibold text-slate-700 transition-colors hover:text-slate-950'
              >
                Privacy Policy
              </Link>
              , and{" "}
              <Link
                href='/hipaa-notice'
                className='font-semibold text-slate-700 transition-colors hover:text-slate-950'
              >
                HIPAA Notice
              </Link>
              .
            </p>
          </div>

          <Button
            type='submit'
            disabled={isSubmitting}
            className='h-12 min-w-[190px] rounded-xl bg-slate-950 px-6 text-white hover:bg-slate-900'
          >
            {isSubmitting ? "Creating account..." : "Create account"}
            {isSubmitting ? null : <ChevronRight className='ml-2 h-4 w-4' />}
          </Button>
        </div>
      </form>
    </div>
  );
}
