"use client";

import { FieldError } from "@/components/shared/FieldError";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignupFormData } from "@/lib/schemas/auth-schemas";
import { Mail, Shield, User } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

interface AccountInfoStepProps {
  form: UseFormReturn<SignupFormData>;
  error: string;
}

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

export function AccountInfoStep({ form, error }: AccountInfoStepProps) {
  const {
    register,
    formState: { errors },
    setValue,
  } = form;

  const [passwordValue, setPasswordValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

  const passwordStrength = calculatePasswordStrength(passwordValue);

  const handlePhoneChange = (value: string) => {
    setPhoneValue(value);
    // Remove '+' and spaces for backend
    const cleanPhone = value.replace(/[^0-9]/g, "");
    setValue("phone", cleanPhone, { shouldValidate: true });
  };

  return (
    <div className='space-y-2.5 md:space-y-3'>
      {/* Header */}
      <div className='text-center pb-2.5 md:pb-3 border-b border-gray-200 animate-in fade-in slide-in-from-top-2 duration-500'>
        <div className='w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-1.5 md:mb-2 shadow-lg shadow-blue-200/50 animate-in zoom-in duration-500 delay-100'>
          <User className='w-5 h-5 md:w-6 md:h-6 text-white' />
        </div>
        <h2 className='text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-0.5'>
          Create Your Account
        </h2>
        <p className='text-xs text-gray-600'>
          Let's start with your basic information
        </p>
      </div>

      {/* Name Fields */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150'>
        <div className='space-y-1 md:space-y-1.5'>
          <Label
            htmlFor='firstName'
            className='text-xs lg:text-sm font-semibold text-gray-900'
          >
            First Name
            <span className='text-red-500 ml-1' aria-label='required'>
              *
            </span>
          </Label>
          <div className='form-group'>
            <User className='input-icon absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 lg:h-4 lg:w-4 text-gray-400 transition-all duration-200' />
            <Input
              id='firstName'
              placeholder='John'
              className='pl-9 lg:pl-10 h-10 lg:h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm'
              {...register("firstName")}
            />
          </div>
          <FieldError error={errors.firstName?.message} id='firstName-error' />
        </div>

        <div className='space-y-1 md:space-y-1.5'>
          <Label
            htmlFor='lastName'
            className='text-xs lg:text-sm font-semibold text-gray-900'
          >
            Last Name
            <span className='text-red-500 ml-1' aria-label='required'>
              *
            </span>
          </Label>
          <div className='form-group'>
            <User className='input-icon absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 lg:h-4 lg:w-4 text-gray-400 transition-all duration-200' />
            <Input
              id='lastName'
              placeholder='Doe'
              className='pl-9 lg:pl-10 h-10 lg:h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm'
              {...register("lastName")}
            />
          </div>
          <FieldError error={errors.lastName?.message} id='lastName-error' />
        </div>
      </div>

      {/* Email */}
      <div className='space-y-1 md:space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200'>
        <Label
          htmlFor='email'
          className='text-xs lg:text-sm font-semibold text-gray-900'
        >
          Email Address
          <span className='text-red-500 ml-1' aria-label='required'>
            *
          </span>
        </Label>
        <div className='form-group'>
          <Mail className='input-icon absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 lg:h-4 lg:w-4 text-gray-400 transition-all duration-200' />
          <Input
            id='email'
            type='email'
            placeholder='you@example.com'
            className='pl-9 lg:pl-10 h-10 lg:h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm'
            {...register("email")}
          />
        </div>
        <FieldError error={errors.email?.message} id='email-error' />
      </div>

      {/* Gender & Phone - Grid Layout */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3'>
        {/* Gender */}
        <div className='space-y-1 md:space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-250'>
          <Label
            htmlFor='gender'
            className='text-xs lg:text-sm font-semibold text-gray-900'
          >
            Gender
          </Label>
          <Select
            onValueChange={(value) =>
              setValue("gender", value as any, { shouldValidate: true })
            }
          >
            <SelectTrigger className='h-10 lg:h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm'>
              <SelectValue placeholder='Select gender (optional)' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='MALE'>Male</SelectItem>
              <SelectItem value='FEMALE'>Female</SelectItem>
              <SelectItem value='NON_BINARY'>Non-binary</SelectItem>
              <SelectItem value='PREFER_NOT_TO_SAY'>
                Prefer not to say
              </SelectItem>
              <SelectItem value='OTHER'>Other</SelectItem>
            </SelectContent>
          </Select>
          <FieldError error={errors.gender?.message} id='gender-error' />
        </div>

        {/* Phone */}
        <div className='space-y-1 md:space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300'>
          <Label
            htmlFor='phone'
            className='text-xs lg:text-sm font-semibold text-gray-900'
          >
            Phone Number
            <span className='text-red-500 ml-1' aria-label='required'>
              *
            </span>
          </Label>
          <PhoneInput
            defaultCountry='us'
            value={phoneValue}
            onChange={handlePhoneChange}
            placeholder='Enter phone number'
            inputClassName='h-10 lg:h-11 pl-12 text-sm'
            countrySelectorStyleProps={{
              buttonClassName:
                "h-10 lg:h-11 border-gray-200 hover:bg-gray-50 focus:outline-none transition-all duration-200",
              flagClassName: "h-3.5 w-5 lg:h-4 lg:w-6 rounded",
            }}
            className='react-international-phone-input-custom'
            style={
              {
                "--react-international-phone-height": "40px",
                "--react-international-phone-border-radius": "0.5rem",
                "--react-international-phone-border-color": "#e5e7eb",
                "--react-international-phone-background-color": "#ffffff",
                "--react-international-phone-text-color": "#111827",
                "--react-international-phone-selected-dropdown-item-background-color":
                  "#dbeafe",
                "--react-international-phone-country-selector-background-color-hover":
                  "#f3f4f6",
                "--react-international-phone-input-border-color": "#e5e7eb",
                "--react-international-phone-input-focus-border-color":
                  "#3b82f6",
              } as React.CSSProperties
            }
          />
          <FieldError error={errors.phone?.message} id='phone-error' />
          {phoneValue && !errors.phone && (
            <p className='text-xs text-green-600 flex items-center gap-1 animate-in fade-in slide-in-from-left-1 duration-300'>
              <span className='w-1 h-1 bg-green-600 rounded-full animate-pulse'></span>
              Valid phone number
            </p>
          )}
        </div>
      </div>

      {/* Password */}
      <div className='space-y-1 md:space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-350'>
        <PasswordInput
          id='password'
          label='Password'
          labelClassName='text-xs lg:text-sm font-semibold text-gray-900'
          placeholder='Create a strong password (min. 8 characters)'
          required
          {...register("password", {
            onChange: (e) => setPasswordValue(e.target.value),
          })}
          error={errors.password?.message}
          className='h-10 lg:h-11 transition-all duration-200 text-sm'
        />
        {/* Password Strength Indicator */}
        {passwordValue && (
          <div className='space-y-1 animate-in fade-in slide-in-from-top-1 duration-300'>
            <div className='flex gap-1'>
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    bar <= passwordStrength.score
                      ? passwordStrength.bgColor
                      : "bg-gray-200"
                  }`}
                  style={{
                    transitionDelay: `${bar * 50}ms`,
                  }}
                />
              ))}
            </div>
            <p
              className={`text-xs font-medium ${passwordStrength.color} transition-colors duration-300`}
            >
              Password strength: {passwordStrength.label}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className='space-y-1 md:space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400'>
        <PasswordInput
          id='confirmPassword'
          label='Confirm Password'
          labelClassName='text-xs lg:text-sm font-semibold text-gray-900'
          placeholder='Re-enter your password'
          required
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          className='h-10 lg:h-11 transition-all duration-200 text-sm'
        />
      </div>

      {/* Security Notice */}
      <div className='bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-2.5 md:p-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-450 hover:shadow-md hover:border-blue-300 transition-all'>
        <div className='flex items-start gap-2'>
          <Shield className='h-3.5 w-3.5 md:h-4 md:w-4 text-blue-600 flex-shrink-0 mt-0.5' />
          <div>
            <p className='text-xs lg:text-sm font-semibold text-blue-900 mb-0.5'>
              Your data is secure
            </p>
            <p className='text-xs text-blue-700 leading-relaxed'>
              All information is encrypted and HIPAA-compliant. We never share
              your health data without explicit consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
