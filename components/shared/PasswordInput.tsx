"use client";

import { FieldError } from "@/components/shared/FieldError";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { forwardRef, useId, useState } from "react";

interface PasswordInputProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Input>,
  "type"
> {
  label?: string;
  labelClassName?: string;
  error?: string;
  showIcon?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      labelClassName = "text-sm font-medium",
      error,
      showIcon = true,
      id,
      className = "",
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id ?? `password-${generatedId}`;
    const errorId = `${inputId}-error`;

    return (
      <div className='space-y-2'>
        {label ? (
          <Label htmlFor={inputId} className={labelClassName}>
            {label}
            {props.required ? (
              <span className='ml-1 text-destructive' aria-label='required'>
                *
              </span>
            ) : null}
          </Label>
        ) : null}
        <div className='relative'>
          {showIcon ? (
            <Lock className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600' />
          ) : null}
          <Input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={`${showIcon ? "pl-10" : ""} pr-10 ${className}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
            aria-required={props.required}
            {...props}
          />
          <button
            type='button'
            onClick={() => setShowPassword((current) => !current)}
            className='absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </button>
        </div>
        <FieldError error={error} id={errorId} />
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
