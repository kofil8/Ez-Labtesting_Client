"use client";

import { registerUser } from "@/app/actions/register-user";
import { FormStateMessage } from "@/components/auth/FormStateMessage";
import { FieldError } from "@/components/shared/FieldError";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SignupAccountFormData,
  signupAccountSchema,
} from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  CalendarDays,
  Home,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

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
  const [error, setError] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

  const {
    register,
    handleSubmit,
    watch,
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
      dateOfBirth: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const passwordStrength = getPasswordStrength(watch("password") || "");

  const onSubmit = async (data: SignupAccountFormData) => {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName.trim());
      formData.append("lastName", data.lastName.trim());
      formData.append("email", data.email.trim());
      formData.append("password", data.password);
      formData.append("phoneNumber", data.phone.replace(/\D/g, ""));
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
            Clean signup, ready for premium patient experiences.
          </h3>
          <p className='mt-2 max-w-xl text-sm leading-6 text-slate-300'>
            We only ask for the information needed to create your account and
            streamline future checkout, delivery, and support.
          </p>
        </div>

        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-1'>
          <div className='flex items-start gap-3 rounded-2xl border border-blue-100 bg-white/85 p-3.5'>
            <BadgeCheck className='mt-0.5 h-4 w-4 text-blue-700' />
            <p className='text-sm leading-6 text-slate-700'>
              Verification follows right after signup to secure your access.
            </p>
          </div>
          <div className='flex items-start gap-3 rounded-2xl border border-cyan-100 bg-white/85 p-3.5'>
            <Sparkles className='mt-0.5 h-4 w-4 text-cyan-700' />
            <p className='text-sm leading-6 text-slate-700'>
              Saved contact and address details make later purchases faster.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className='space-y-5'>
        <section className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.5)] sm:p-6'>
          <div className='mb-6 flex items-start justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='rounded-2xl bg-blue-50 p-2.5 text-blue-700 ring-1 ring-blue-100'>
                <User className='h-5 w-5' />
              </div>
              <div>
                <h2 className='text-lg font-semibold text-slate-950'>
                  Account details
                </h2>
                <p className='text-sm text-slate-600'>
                  Basic information used for login, orders, and account
                  verification.
                </p>
              </div>
            </div>
            <div className='hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 sm:block'>
              Step 1 of 2
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
              <FieldError error={errors.lastName?.message} id='lastName-error' />
            </div>

            <div className='space-y-1.5'>
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

            <div className='space-y-1.5'>
              <Label htmlFor='phone'>Phone Number *</Label>
              <div className='relative'>
                <Phone className='pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400' />
                <PhoneInput
                  defaultCountry='us'
                  value={phoneValue}
                  onChange={(value) => {
                    setPhoneValue(value);
                    setValue("phone", value.replace(/\D/g, ""), {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  inputClassName='h-12 w-full rounded-r-xl border-slate-300 bg-slate-50/50 pl-12 text-sm'
                  countrySelectorStyleProps={{
                    buttonClassName:
                      "h-12 rounded-l-xl border-slate-300 bg-slate-50/50 hover:bg-slate-100 focus:outline-none",
                  }}
                  className='react-international-phone-input-custom'
                />
              </div>
              <FieldError error={errors.phone?.message} id='phone-error' />
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
              {watch("password") ? (
                <div className='rounded-2xl border border-slate-200 bg-slate-50 p-3'>
                  <div className='flex gap-1.5'>
                    {[1, 2, 3, 4].map((segment) => (
                      <span
                        key={segment}
                        className={`h-1.5 flex-1 rounded-full ${
                          segment <= passwordStrength.score
                            ? "bg-blue-600"
                            : "bg-slate-200"
                        }`}
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
        </section>

        <section className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.5)] sm:p-6'>
          <div className='mb-6 flex items-start justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='rounded-2xl bg-emerald-50 p-2.5 text-emerald-700 ring-1 ring-emerald-100'>
                <Home className='h-5 w-5' />
              </div>
              <div>
                <h2 className='text-lg font-semibold text-slate-950'>
                  Address and profile
                </h2>
                <p className='text-sm text-slate-600'>
                  Optional profile details that help with billing, delivery, and
                  account support.
                </p>
              </div>
            </div>
            <div className='hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 sm:block'>
              Step 2 of 2
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
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
              <FieldError error={errors.dateOfBirth?.message} id='dateOfBirth-error' />
            </div>

            <div className='hidden sm:block' />

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
                    setValueAs: (value) => String(value ?? "").toUpperCase(),
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
                  className='h-12 rounded-xl border-slate-300 bg-slate-50/50 pl-10 focus-visible:ring-blue-200'
                  placeholder='10001'
                  {...register("zipCode")}
                />
              </div>
              <FieldError error={errors.zipCode?.message} id='zipCode-error' />
            </div>
          </div>
        </section>

        <section className='rounded-[28px] border border-blue-100 bg-[linear-gradient(135deg,rgba(239,246,255,0.95),rgba(255,255,255,1))] p-4 shadow-sm'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='space-y-2'>
              <div className='inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold text-blue-700'>
                <ShieldCheck className='h-3.5 w-3.5' />
                Protected onboarding
              </div>
              <p className='max-w-2xl text-sm leading-6 text-slate-600'>
                Your account uses secure verification and encrypted handling of
                personal information.
              </p>
              <p className='text-sm text-slate-600'>
                Already have an account?{' '}
                <Link
                  href='/login'
                  className='font-semibold text-blue-700 hover:text-blue-800'
                >
                  Sign in
                </Link>
              </p>
            </div>

            <Button
              type='submit'
              disabled={isSubmitting}
              className='h-12 min-w-[180px] rounded-xl bg-slate-950 px-6 text-white hover:bg-slate-900'
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
}
