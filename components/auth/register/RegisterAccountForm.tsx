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
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: "" };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score: 1, label: "Weak" };
  if (score <= 3) return { score: 2, label: "Fair" };
  if (score <= 4) return { score: 3, label: "Good" };
  return { score: 4, label: "Strong" };
}

export function RegisterAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [optionalDetailsEnabled, setOptionalDetailsEnabled] = useState(false);
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
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

  const [password = "", watchedGender] = useWatch({
    control,
    name: ["password", "gender"],
  });
  const passwordStrength = getPasswordStrength(password);
  const selectedGender = watchedGender ?? "";
  const fromParam = searchParams.get("from");
  const safeFrom =
    fromParam && fromParam.startsWith("/") && !fromParam.startsWith("//")
      ? fromParam
      : null;

  const resetOptionalFields = () => {
    setValue("addressLine1", "", {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });
    setValue("addressLine2", "", {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });
    setValue("city", "", {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });
    setValue("state", "", {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });
    setValue("zipCode", "", {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });
    clearErrors(["addressLine1", "addressLine2", "city", "state", "zipCode"]);
  };

  const onSubmit = async (data: SignupAccountFormData) => {
    try {
      setError("");

      const res = await registerUser({
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

      if (res?.success) {
        const email = res.email || data.email.trim();
        if (typeof window !== "undefined") {
          sessionStorage.setItem("otp_email", email);
        }
        const verifyUrl = safeFrom
          ? `/verify-otp?email=${encodeURIComponent(email)}&from=${encodeURIComponent(safeFrom)}`
          : `/verify-otp?email=${encodeURIComponent(email)}`;
        router.push(verifyUrl);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to complete registration right now. Please try again.";
      setError(message);
    }
  };

  const onInvalidSubmit = () => {
    setError("Please review the highlighted fields and try again.");
  };

  const handleOptionalDetailsChange = (checked: boolean) => {
    if (!checked && optionalDetailsEnabled) {
      resetOptionalFields();
    }

    setOptionalDetailsEnabled(checked);
  };

  useEffect(() => {
    if (!error) {
      return;
    }

    feedbackRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [error]);

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
        onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
        noValidate
        className='space-y-4'
      >
        <input type='hidden' {...register("phone")} />
        <input type='hidden' {...register("gender")} />

        <section className='space-y-6'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <Label htmlFor='firstName'>First Name *</Label>
              <div className='form-group relative'>
                <User className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                <Input
                  id='firstName'
                  autoComplete='given-name'
                  className='h-12 rounded-xl border-slate-300 bg-slate-50/70 pl-10 focus-visible:ring-blue-200'
                  placeholder='John'
                  {...register("firstName")}
                />
              </div>
              <FieldError
                error={errors.firstName?.message}
                id='firstName-error'
              />
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='lastName'>Last Name *</Label>
              <div className='form-group relative'>
                <User className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                <Input
                  id='lastName'
                  autoComplete='family-name'
                  className='h-12 rounded-xl border-slate-300 bg-slate-50/70 pl-10 focus-visible:ring-blue-200'
                  placeholder='Doe'
                  {...register("lastName")}
                />
              </div>
              <FieldError
                error={errors.lastName?.message}
                id='lastName-error'
              />
            </div>

            <div className='space-y-1.5 sm:col-span-2'>
              <Label htmlFor='email'>Email Address *</Label>
              <div className='form-group relative'>
                <Mail className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                <Input
                  id='email'
                  type='email'
                  autoComplete='email'
                  className='h-12 rounded-xl border-slate-300 bg-slate-50/70 pl-10 focus-visible:ring-blue-200'
                  placeholder='you@example.com'
                  {...register("email")}
                />
              </div>
              <FieldError error={errors.email?.message} id='email-error' />
            </div>

            <div className='sm:col-span-2'>
              <PhoneInputField
                id='phone'
                label='Phone Number'
                value={phoneValue}
                onChange={(value) => {
                  setPhoneValue(value);
                  setValue("phone", value.replace(/\D/g, ""), {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                error={errors.phone?.message}
                required
                defaultCountry='us'
                helperText='Required for account verification and account updates.'
              />
            </div>

            <div className='space-y-1.5 sm:col-span-2'>
              <PasswordInput
                id='password'
                label='Password'
                required
                autoComplete='new-password'
                placeholder='Create a strong password'
                className='h-12 rounded-xl border-slate-300 bg-slate-50/70 focus-visible:ring-blue-200'
                {...register("password")}
                error={errors.password?.message}
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
                className='h-12 rounded-xl border-slate-300 bg-slate-50/70 focus-visible:ring-blue-200'
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />
            </div>

            <div className='space-y-1.5 sm:col-span-1'>
              <Label htmlFor='gender'>Gender *</Label>
              <div className='rounded-xl border border-slate-300 bg-white px-3 py-0.5'>
                <select
                  id='gender'
                  value={selectedGender}
                  className='h-11 w-full bg-transparent text-sm text-slate-900 outline-none'
                  onChange={(event) => {
                    setValue(
                      "gender",
                      event.target.value as SignupAccountFormData["gender"],
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                      },
                    );
                  }}
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

            <div className='space-y-1.5 sm:col-span-1'>
              <Label htmlFor='dateOfBirth'>Date of Birth *</Label>
              <div className='form-group relative'>
                <CalendarDays className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                <Input
                  id='dateOfBirth'
                  type='date'
                  className='h-12 rounded-xl border-slate-300 bg-white pl-10 focus-visible:ring-blue-200'
                  {...register("dateOfBirth")}
                />
              </div>
              <FieldError
                error={errors.dateOfBirth?.message}
                id='dateOfBirth-error'
              />
            </div>
          </div>

          <div className='rounded-2xl border border-slate-200 bg-slate-50/50 p-6'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
              <div className='space-y-1'>
                <h3 className='text-base font-semibold text-slate-900'>
                  Optional details
                </h3>
                <p className='text-sm text-slate-500'>
                  Add address details for faster checkout later.
                </p>
              </div>

              <div className='flex items-center gap-3'>
                <Checkbox
                  id='optional-profile-details'
                  checked={optionalDetailsEnabled}
                  onCheckedChange={(checked) =>
                    handleOptionalDetailsChange(checked === true)
                  }
                />
                <Label
                  htmlFor='optional-profile-details'
                  className='cursor-pointer text-sm font-medium text-slate-700'
                >
                  Add address now
                </Label>
              </div>
            </div>

            {optionalDetailsEnabled && (
              <div className='mt-6 grid gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5 sm:col-span-2'>
                  <Label htmlFor='addressLine1'>Address Line 1</Label>
                  <div className='form-group relative'>
                    <MapPin className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                    <Input
                      id='addressLine1'
                      autoComplete='address-line1'
                      className='h-12 rounded-xl border-slate-300 bg-white pl-10 focus-visible:ring-blue-200'
                      placeholder='123 Main Street'
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
                  <div className='form-group relative'>
                    <Home className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                    <Input
                      id='addressLine2'
                      autoComplete='address-line2'
                      className='h-12 rounded-xl border-slate-300 bg-white pl-10 focus-visible:ring-blue-200'
                      placeholder='Apt, suite, unit, building'
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
                  <div className='form-group relative'>
                    <MapPin className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                    <Input
                      id='city'
                      autoComplete='address-level2'
                      className='h-12 rounded-xl border-slate-300 bg-white pl-10 focus-visible:ring-blue-200'
                      placeholder='New York'
                      {...register("city")}
                    />
                  </div>
                  <FieldError error={errors.city?.message} id='city-error' />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='state'>State</Label>
                  <div className='form-group relative'>
                    <MapPin className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                    <Input
                      id='state'
                      autoComplete='address-level1'
                      maxLength={2}
                      className='h-12 rounded-xl border-slate-300 bg-white pl-10 uppercase focus-visible:ring-blue-200'
                      placeholder='NY'
                      {...register("state", {
                        setValueAs: (value) =>
                          String(value ?? "").toUpperCase(),
                      })}
                    />
                  </div>
                  <FieldError error={errors.state?.message} id='state-error' />
                </div>

                <div className='space-y-1.5 sm:col-span-2 md:col-span-1'>
                  <Label htmlFor='zipCode'>Zip Code</Label>
                  <div className='form-group relative'>
                    <MapPin className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                    <Input
                      id='zipCode'
                      autoComplete='postal-code'
                      className='h-12 rounded-xl border-slate-300 bg-white pl-10 focus-visible:ring-blue-200'
                      placeholder='10001'
                      {...register("zipCode")}
                    />
                  </div>
                  <FieldError
                    error={errors.zipCode?.message}
                    id='zipCode-error'
                  />
                </div>
              </div>
            )}
          </div>

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
              {!isSubmitting ? <ChevronRight className='ml-2 h-4 w-4' /> : null}
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
}
