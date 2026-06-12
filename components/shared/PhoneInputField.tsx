"use client";

import { FieldError } from "@/components/shared/FieldError";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { PhoneInput as ReactPhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

interface PhoneInputFieldProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: ComponentPropsWithoutRef<"input">["onBlur"];
  error?: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  defaultCountry?: string;
  className?: string;
  inputClassName?: string;
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
  variant = "default",
}: PhoneInputFieldProps) {
  const isCompact = variant === "compact";
  const helperId = helperText ? `${id}-description` : undefined;
  const errorId = `${id}-error`;
  const describedBy =
    [helperId, error ? errorId : undefined].filter(Boolean).join(" ") ||
    undefined;

  const containerStyles: CSSProperties = {
    "--react-international-phone-height": isCompact ? "40px" : "48px",
    "--react-international-phone-border-radius": "0.75rem",
    "--react-international-phone-border-color": error ? "#fca5a5" : "#cbd5e1",
    "--react-international-phone-background-color": disabled
      ? "#f1f5f9"
      : "#f8fafc",
    "--react-international-phone-text-color": "#0f172a",
    "--react-international-phone-country-selector-background-color-hover":
      disabled ? "#f1f5f9" : "#ffffff",
    "--react-international-phone-disabled-background-color": "#f1f5f9",
    "--react-international-phone-disabled-text-color": "#94a3b8",
    "--react-international-phone-dropdown-top": "calc(100% + 0.5rem)",
    "--react-international-phone-dropdown-left": "0px",
    "--react-international-phone-dropdown-shadow":
      "0 20px 45px -12px rgba(15, 23, 42, 0.18)",
    "--react-international-phone-dropdown-item-background-color": "#ffffff",
    "--react-international-phone-dropdown-item-text-color": "#0f172a",
    "--react-international-phone-dropdown-item-dial-code-color": "#64748b",
    "--react-international-phone-selected-dropdown-item-background-color":
      "#eff6ff",
    "--react-international-phone-selected-dropdown-item-text-color": "#0f172a",
    "--react-international-phone-selected-dropdown-item-dial-code-color":
      "#2563eb",
  } as CSSProperties;

  return (
    <div className={cn("relative space-y-1.5", className)}>
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

      <div className='relative focus-within:z-[90]'>
        <ReactPhoneInput
          defaultCountry={defaultCountry}
          value={value}
          onChange={(phone) => onChange(phone)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          disableDialCodeAndPrefix
          showDisabledDialCodeAndPrefix
          className='group/phone relative flex w-full min-w-0 items-stretch'
          inputClassName={cn(
            "min-w-0 flex-1 rounded-r-xl border-slate-300 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-[border-color,box-shadow,background-color] duration-200 focus-visible:relative focus-visible:z-[1] focus-visible:border-blue-500 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100",
            error &&
              "border-red-300 bg-red-50/40 focus-visible:border-red-500 focus-visible:ring-red-100",
            disabled && "cursor-not-allowed bg-slate-100 text-slate-400",
            inputClassName,
          )}
          countrySelectorStyleProps={{
            className: "relative z-20 shrink-0",
            buttonClassName: cn(
              "min-w-[4rem] rounded-l-xl border-slate-300 bg-slate-50 px-3 text-sm font-medium text-slate-900 transition-[border-color,box-shadow,background-color] duration-200 hover:bg-white focus-visible:relative focus-visible:z-[1] focus-visible:border-blue-500 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 group-focus-within/phone:border-blue-500 group-focus-within/phone:bg-white",
              error &&
                "border-red-300 bg-red-50/40 group-focus-within/phone:border-red-500",
              disabled && "cursor-not-allowed bg-slate-100 text-slate-400",
            ),
            buttonContentWrapperClassName: "gap-2",
            flagClassName: "h-4 w-5 rounded-[2px] object-cover",
            dropdownArrowClassName: cn(
              "mr-0 border-t-slate-500",
              disabled && "border-t-slate-300",
            ),
            dropdownStyleProps: {
              className:
                "z-[80] w-[min(20rem,calc(100vw-2rem))] max-w-none overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10 ring-1 ring-slate-950/5",
              listItemClassName:
                "gap-3 rounded-xl px-3 py-2 text-sm transition-colors duration-150",
              listItemSelectedClassName: "bg-blue-50 text-slate-950",
              listItemFocusedClassName: "bg-blue-50 text-slate-950",
              listItemFlagClassName: "mr-0 h-4 w-5 rounded-[2px] object-cover",
              listItemCountryNameClassName:
                "mr-auto text-sm font-medium text-slate-900",
              listItemDialCodeClassName: "text-xs font-medium text-slate-500",
              preferredListDividerClassName: "my-1 bg-slate-200",
            },
          }}
          dialCodePreviewStyleProps={{
            className: cn(
              "shrink-0 border-slate-300 bg-slate-50 px-3 text-sm font-medium text-slate-700 transition-[border-color,box-shadow,background-color] duration-200 group-focus-within/phone:border-blue-500 group-focus-within/phone:bg-white",
              error &&
                "border-red-300 bg-red-50/40 group-focus-within/phone:border-red-500",
              disabled && "bg-slate-100 text-slate-400",
            ),
          }}
          style={containerStyles}
          inputProps={{
            id,
            autoComplete: "tel-national",
            inputMode: "tel",
            "aria-describedby": describedBy,
            "aria-invalid": error ? "true" : "false",
            "aria-required": required,
          }}
        />
      </div>

      {helperText && (
        <p id={helperId} className='text-xs leading-5 text-slate-500'>
          {helperText}
        </p>
      )}

      <div className='min-h-[1.25rem]'>
        <FieldError error={error} id={errorId} />
      </div>
    </div>
  );
}
