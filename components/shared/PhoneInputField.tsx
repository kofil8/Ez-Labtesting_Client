"use client";

import { FieldError } from "@/components/shared/FieldError";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";
import type { CSSProperties } from "react";
import { PhoneInput as ReactPhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

interface PhoneInputFieldProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  defaultCountry?: string;
  className?: string;
  inputClassName?: string;
  showIcon?: boolean;
  variant?: "default" | "compact";
}

export function PhoneInputField({
  id = "phone",
  label = "Phone Number",
  value,
  onChange,
  onBlur,
  error,
  required = false,
  optional = false,
  disabled = false,
  placeholder = "Enter your phone number",
  helperText = "Add a mobile number if you want faster order and support follow-up later.",
  defaultCountry = "us",
  className,
  inputClassName,
  showIcon = true,
  variant = "default",
}: PhoneInputFieldProps) {
  const isCompact = variant === "compact";

  const containerStyles: CSSProperties = {
    "--react-international-phone-height": isCompact ? "40px" : "48px",
    "--react-international-phone-border-radius": "0.75rem",
    "--react-international-phone-border-color": error ? "#fca5a5" : "#cbd5e1",
    "--react-international-phone-background-color": disabled
      ? "#f1f5f9"
      : "#f8fafc",
    "--react-international-phone-text-color": "#0f172a",
    "--react-international-phone-input-border-color": error
      ? "#fca5a5"
      : "#cbd5e1",
    "--react-international-phone-input-focus-border-color": error
      ? "#ef4444"
      : "#93c5fd",
  } as CSSProperties;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={id} className='text-sm font-medium'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
          {optional && !required && (
            <span className='text-xs font-normal text-slate-500 ml-2'>
              Optional
            </span>
          )}
        </Label>
      )}

      <div className='relative'>
        {showIcon && (
          <Phone
            className='pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400'
            aria-hidden='true'
          />
        )}

        <ReactPhoneInput
          defaultCountry={defaultCountry}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          inputClassName={cn(
            isCompact ? "h-10 pl-10 text-sm" : "h-12 pl-10 text-sm",
            "w-full rounded-r-xl bg-slate-50/50 transition-all duration-200",
            error && "border-red-300 bg-red-50/30",
            disabled && "bg-slate-100 cursor-not-allowed opacity-60",
            inputClassName,
          )}
          countrySelectorStyleProps={{
            buttonClassName: cn(
              isCompact ? "h-10 rounded-l-xl" : "h-12 rounded-l-xl",
              "border-slate-300 bg-slate-50/50 hover:bg-slate-100 focus:outline-none transition-all duration-200 font-medium",
              error && "border-red-300 bg-red-50/30",
              disabled && "bg-slate-100 cursor-not-allowed opacity-60",
            ),
            flagClassName: "h-4 w-6 rounded-sm",
          }}
          style={containerStyles}
          className='react-international-phone-input-custom'
          inputProps={{ id }}
        />
      </div>

      {helperText && !error && (
        <p className='text-xs leading-5 text-slate-500'>{helperText}</p>
      )}

      <FieldError error={error} id={id ? `${id}-error` : undefined} />
    </div>
  );
}
