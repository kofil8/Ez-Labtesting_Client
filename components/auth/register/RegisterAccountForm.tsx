"use client";

import { FormStateMessage } from "@/components/auth/FormStateMessage";
import { FieldError } from "@/components/shared/FieldError";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SignupAccountFormData,
  signupAccountSchema,
} from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { GENDER_OPTIONS, loadAccountDraft, saveAccountDraft } from "./register-flow-storage";

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
  const draft = useMemo(() => loadAccountDraft(), []);
  const [error, setError] = useState("");
  const [phoneValue, setPhoneValue] = useState(draft?.phone ? `+${draft.phone}` : "");

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
      firstName: draft?.firstName ?? "",
      lastName: draft?.lastName ?? "",
      email: draft?.email ?? "",
      phone: draft?.phone ?? "",
      gender: draft?.gender,
      password: draft?.password ?? "",
      confirmPassword: draft?.confirmPassword ?? "",
    },
  });

  const passwordStrength = getPasswordStrength(watch("password") || "");

  const onSubmit = (data: SignupAccountFormData) => {
    try {
      saveAccountDraft(data);
      router.push("/register/medical");
    } catch {
      setError("Unable to continue right now. Please try again.");
    }
  };

  return (
    <div className='space-y-6'>
      {error ? (
        <FormStateMessage
          type='error'
          message='Unable to continue'
          details={error}
          onDismiss={() => setError("")}
        />
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className='space-y-5'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label htmlFor='firstName'>First Name *</Label>
            <div className='form-group relative'>
              <User className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
              <Input
                id='firstName'
                autoComplete='given-name'
                className='h-11 border-slate-300 pl-10 focus-visible:ring-blue-200'
                placeholder='John'
                {...register("firstName")}
              />
            </div>
            <FieldError error={errors.firstName?.message} id='firstName-error' />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='lastName'>Last Name *</Label>
            <div className='form-group relative'>
              <User className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
              <Input
                id='lastName'
                autoComplete='family-name'
                className='h-11 border-slate-300 pl-10 focus-visible:ring-blue-200'
                placeholder='Doe'
                {...register("lastName")}
              />
            </div>
            <FieldError error={errors.lastName?.message} id='lastName-error' />
          </div>
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='email'>Email Address *</Label>
          <div className='form-group relative'>
            <Mail className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            <Input
              id='email'
              type='email'
              autoComplete='email'
              className='h-11 border-slate-300 pl-10 focus-visible:ring-blue-200'
              placeholder='you@example.com'
              {...register("email")}
            />
          </div>
          <FieldError error={errors.email?.message} id='email-error' />
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label htmlFor='gender'>Gender <span className='text-slate-500'>(optional)</span></Label>
            <Select
              defaultValue={draft?.gender}
              onValueChange={(value) =>
                setValue("gender", value as SignupAccountFormData["gender"], {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger id='gender' className='h-11 border-slate-300'>
                <SelectValue placeholder='Select gender' />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError error={errors.gender?.message} id='gender-error' />
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
                inputClassName='h-11 border-slate-300 pl-12 text-sm w-full'
                countrySelectorStyleProps={{
                  buttonClassName:
                    "h-11 border-slate-300 rounded-l-md hover:bg-slate-50 focus:outline-none",
                }}
                className='react-international-phone-input-custom'
              />
            </div>
            <FieldError error={errors.phone?.message} id='phone-error' />
          </div>
        </div>

        <div className='space-y-1.5'>
          <PasswordInput
            id='password'
            label='Password'
            required
            autoComplete='new-password'
            placeholder='Create a strong password'
            className='h-11 border-slate-300 focus-visible:ring-blue-200'
            {...register("password")}
            error={errors.password?.message}
          />
          {watch("password") ? (
            <div className='space-y-1'>
              <div className='flex gap-1'>
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
              <p className='text-xs text-slate-600'>Password strength: {passwordStrength.label}</p>
            </div>
          ) : null}
        </div>

        <PasswordInput
          id='confirmPassword'
          label='Confirm Password'
          required
          autoComplete='new-password'
          placeholder='Re-enter your password'
          className='h-11 border-slate-300 focus-visible:ring-blue-200'
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <div className='rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-xs text-blue-800'>
          Create your secure account first. You can add health history on the next step.
        </div>

        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm text-slate-600'>
            Already have an account?{" "}
            <Link href='/login' className='font-semibold text-blue-700 hover:text-blue-800'>
              Sign in
            </Link>
          </p>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='h-11 rounded-lg bg-blue-700 px-5 hover:bg-blue-800'
          >
            {isSubmitting ? "Saving..." : "Continue to medical info"}
          </Button>
        </div>
      </form>
    </div>
  );
}
