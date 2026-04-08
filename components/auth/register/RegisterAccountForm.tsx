"use client";

import { registerUser } from "@/app/actions/register-user";
import { FormStateMessage } from "@/components/auth/FormStateMessage";
import { FieldError } from "@/components/shared/FieldError";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { PhoneInputField } from "@/components/shared/PhoneInputField";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SignupAccountFormData,
  signupAccountSchema,
} from "@/lib/schemas/auth-schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Home,
  Mail,
  MapPin,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ProfileImagePicker } from "./ProfileImagePicker";

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

const onboardingHighlights = [
  "Verify your email to activate secure account access.",
  "Add optional profile details now or finish them later.",
  "Use saved account data for faster future checkout.",
];

export function RegisterAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    setError: setFieldError,
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
      profileImage: "",
      gender: undefined,
      dateOfBirth: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const [
    password = "",
    firstName = "",
    lastName = "",
    profileImage = "",
    watchedGender,
  ] = useWatch({
    control,
    name: ["password", "firstName", "lastName", "profileImage", "gender"],
  });
  const passwordStrength = getPasswordStrength(password);
  const selectedGender = watchedGender ?? "";
  const fromParam = searchParams.get("from");
  const safeFrom =
    fromParam && fromParam.startsWith("/") && !fromParam.startsWith("//")
      ? fromParam
      : null;

  const onSubmit = async (data: SignupAccountFormData) => {
    try {
      setError("");

      const formData = new FormData();
      formData.append("firstName", data.firstName.trim());
      formData.append("lastName", data.lastName.trim());
      formData.append("email", data.email.trim());
      formData.append("password", data.password);

      if (data.phone?.trim()) {
        formData.append("phoneNumber", data.phone.replace(/\D/g, ""));
      }
      if (data.profileImage?.trim()) {
        formData.append("profileImage", data.profileImage.trim());
      }
      if (data.gender?.trim()) {
        formData.append("gender", data.gender.trim());
      }
      if (data.dateOfBirth?.trim()) {
        formData.append("dateOfBirth", data.dateOfBirth.trim());
      }
      if (data.addressLine1?.trim()) {
        formData.append("addressLine1", data.addressLine1.trim());
      }
      if (data.addressLine2?.trim()) {
        formData.append("addressLine2", data.addressLine2.trim());
      }
      if (data.city?.trim()) {
        formData.append("city", data.city.trim());
      }
      if (data.state?.trim()) {
        formData.append("state", data.state.trim().toUpperCase());
      }
      if (data.zipCode?.trim()) {
        formData.append("zipCode", data.zipCode.trim());
      }

      const res = await registerUser(formData);
      if (res?.success) {
        const email = res.email || data.email.trim();
        if (typeof window !== "undefined") {
          sessionStorage.setItem("otp_email", email);
        }
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to complete registration right now. Please try again.";
      setError(message);
    }
  };

  return (
    <div className='space-y-7'>
      {error ? (
        <FormStateMessage
          type='error'
          message='Unable to continue'
          details={error}
          onDismiss={() => setError("")}
        />
      ) : null}

      <div className='grid gap-3 rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,rgba(239,246,255,0.85),rgba(255,255,255,0.98)_45%,rgba(236,254,255,0.9))] p-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)] lg:grid-cols-[1.4fr,1fr]'>
        <div className='rounded-3xl bg-slate-950 px-5 py-5 text-white shadow-[0_18px_40px_-30px_rgba(2,6,23,0.8)]'>
          <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100'>
            <Shield className='h-3.5 w-3.5' />
            Secure medical commerce
          </div>
          <h3 className='mt-4 text-xl font-semibold tracking-tight'>
            Create a clean account setup and personalize it only if you want to.
          </h3>
          <p className='mt-2 max-w-xl text-sm leading-6 text-slate-300'>
            Start with the essentials for secure access, then expand optional
            details only when they add value to future checkout and support.
          </p>
        </div>

        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-1'>
          <div className='flex items-start gap-3 rounded-2xl border border-blue-100 bg-white/85 p-3.5'>
            <BadgeCheck className='mt-0.5 h-4 w-4 text-blue-700' />
            <p className='text-sm leading-6 text-slate-700'>
              Verification starts right after signup to secure your access.
            </p>
          </div>
          <div className='flex items-start gap-3 rounded-2xl border border-cyan-100 bg-white/85 p-3.5'>
            <Sparkles className='mt-0.5 h-4 w-4 text-cyan-700' />
            <p className='text-sm leading-6 text-slate-700'>
              Optional profile details make future checkout and support faster.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className='space-y-5'>
        <input type='hidden' {...register("phone")} />
        <input type='hidden' {...register("gender")} />
        <input type='hidden' {...register("profileImage")} />

        <section className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.5)] sm:p-6'>
          <div className='mb-6 flex items-start gap-3'>
            <div className='rounded-2xl bg-blue-50 p-2.5 text-blue-700 ring-1 ring-blue-100'>
              <User className='h-5 w-5' />
            </div>
            <div>
              <h2 className='text-lg font-semibold text-slate-950'>
                Essential account setup
              </h2>
              <p className='text-sm leading-6 text-slate-600'>
                Create your login, add an optional profile photo, and keep the
                rest of your profile lightweight for now.
              </p>
            </div>
          </div>

          <div className='grid gap-6 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]'>
            <div className='space-y-4'>
              <ProfileImagePicker
                value={profileImage}
                firstName={firstName}
                lastName={lastName}
                error={errors.profileImage?.message}
                disabled={isSubmitting}
                onChange={(value) => {
                  setValue("profileImage", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                onValidationError={(message) => {
                  if (message) {
                    setFieldError("profileImage", {
                      type: "manual",
                      message,
                    });
                    return;
                  }
                  clearErrors("profileImage");
                }}
              />

              <div className='rounded-[24px] border border-slate-200 bg-slate-50/80 p-4'>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                  What happens next
                </p>
                <div className='mt-3 space-y-3'>
                  {onboardingHighlights.map((item) => (
                    <div key={item} className='flex items-start gap-3'>
                      <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600' />
                      <p className='text-sm leading-6 text-slate-600'>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-1.5'>
                <Label htmlFor='firstName'>First Name *</Label>
                <div className='form-group relative'>
                  <User className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                  <Input
                    id='firstName'
                    autoComplete='given-name'
                    className='h-12 rounded-xl border-slate-300 bg-slate-50/50 pl-10 focus-visible:ring-blue-200'
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
                    className='h-12 rounded-xl border-slate-300 bg-slate-50/50 pl-10 focus-visible:ring-blue-200'
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
                    className='h-12 rounded-xl border-slate-300 bg-slate-50/50 pl-10 focus-visible:ring-blue-200'
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
                  optional
                  defaultCountry='us'
                  helperText='Add a mobile number if you want faster order and support follow-up later.'
                />
              </div>

              <div className='space-y-1.5 sm:col-span-2'>
                <PasswordInput
                  id='password'
                  label='Password'
                  required
                  autoComplete='new-password'
                  placeholder='Create a strong password'
                  className='h-12 rounded-xl border-slate-300 bg-slate-50/50 focus-visible:ring-blue-200'
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
                  className='h-12 rounded-xl border-slate-300 bg-slate-50/50 focus-visible:ring-blue-200'
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                />
              </div>
            </div>
          </div>
        </section>

        <section className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.5)] sm:p-6'>
          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem value='optional-details' className='border-none'>
              <AccordionTrigger className='py-0 hover:no-underline'>
                <div className='flex items-start gap-3 text-left'>
                  <div className='rounded-2xl bg-emerald-50 p-2.5 text-emerald-700 ring-1 ring-emerald-100'>
                    <Home className='h-5 w-5' />
                  </div>
                  <div>
                    <div className='flex flex-wrap items-center gap-2'>
                      <h2 className='text-lg font-semibold text-slate-950'>
                        Add optional profile details
                      </h2>
                      <span className='rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500'>
                        Optional
                      </span>
                    </div>
                    <p className='mt-1 text-sm leading-6 text-slate-600'>
                      Save address, date of birth, and demographic details now
                      if you want a faster checkout later.
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className='pt-6'>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='gender'>Gender</Label>
                    <div className='rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-0.5'>
                      <select
                        id='gender'
                        value={selectedGender}
                        className='h-11 w-full bg-transparent text-sm text-slate-900 outline-none'
                        onChange={(event) => {
                          setValue(
                            "gender",
                            event.target.value
                              ? (event.target
                                  .value as SignupAccountFormData["gender"])
                              : undefined,
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
                        <option value='PREFER_NOT_TO_SAY'>
                          Prefer not to say
                        </option>
                        <option value='OTHER'>Other</option>
                      </select>
                    </div>
                    <FieldError
                      error={errors.gender?.message}
                      id='gender-error'
                    />
                  </div>

                  <div className='space-y-1.5'>
                    <Label htmlFor='dateOfBirth'>Date of Birth</Label>
                    <div className='form-group relative'>
                      <CalendarDays className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                      <Input
                        id='dateOfBirth'
                        type='date'
                        className='h-12 rounded-xl border-slate-300 bg-slate-50/50 pl-10 focus-visible:ring-blue-200'
                        {...register("dateOfBirth")}
                      />
                    </div>
                    <FieldError
                      error={errors.dateOfBirth?.message}
                      id='dateOfBirth-error'
                    />
                  </div>

                  <div className='space-y-1.5 sm:col-span-2'>
                    <Label htmlFor='addressLine1'>Address Line 1</Label>
                    <div className='form-group relative'>
                      <MapPin className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                      <Input
                        id='addressLine1'
                        autoComplete='address-line1'
                        className='h-12 rounded-xl border-slate-300 bg-slate-50/50 pl-10 focus-visible:ring-blue-200'
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
                        className='h-12 rounded-xl border-slate-300 bg-slate-50/50 pl-10 focus-visible:ring-blue-200'
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
                        className='h-12 rounded-xl border-slate-300 bg-slate-50/50 pl-10 focus-visible:ring-blue-200'
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
                        className='h-12 rounded-xl border-slate-300 bg-slate-50/50 pl-10 uppercase focus-visible:ring-blue-200'
                        placeholder='NY'
                        {...register("state", {
                          setValueAs: (value) =>
                            String(value ?? "").toUpperCase(),
                        })}
                      />
                    </div>
                    <FieldError
                      error={errors.state?.message}
                      id='state-error'
                    />
                  </div>

                  <div className='space-y-1.5 sm:col-span-2 md:col-span-1'>
                    <Label htmlFor='zipCode'>Zip Code</Label>
                    <div className='form-group relative'>
                      <MapPin className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                      <Input
                        id='zipCode'
                        autoComplete='postal-code'
                        className='h-12 rounded-xl border-slate-300 bg-slate-50/50 pl-10 focus-visible:ring-blue-200'
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className='rounded-[28px] border border-blue-100 bg-[linear-gradient(135deg,rgba(239,246,255,0.95),rgba(255,255,255,1))] p-4 shadow-sm'>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
              <div className='space-y-2'>
                <div className='inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold text-blue-700'>
                  <ShieldCheck className='h-3.5 w-3.5' />
                  Protected onboarding
                </div>
                <p className='max-w-2xl text-sm leading-6 text-slate-600'>
                  Your account uses encrypted verification and privacy-conscious
                  handling of personal information.
                </p>
                <p className='text-sm text-slate-600'>
                  Already have an account?{" "}
                  <Link
                    href={
                      safeFrom
                        ? `/login?from=${encodeURIComponent(safeFrom)}`
                        : "/login"
                    }
                    className='font-semibold text-blue-700 hover:text-blue-800'
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <Button
                type='submit'
                disabled={isSubmitting}
                className='h-12 min-w-[190px] rounded-xl bg-slate-950 px-6 text-white hover:bg-slate-900'
              >
                {isSubmitting ? "Creating account..." : "Create account"}
                {!isSubmitting ? (
                  <ChevronRight className='ml-2 h-4 w-4' />
                ) : null}
              </Button>
            </div>

            <div className='border-t border-blue-100 pt-4 text-xs leading-6 text-slate-500'>
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
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
