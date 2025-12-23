"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { forwardRef, useState } from "react";
import { FieldError } from "./FieldError";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  showIcon?: boolean;
}

/**
 * Password input with built-in visibility toggle and proper ARIA attributes
 * Eliminates duplicate password toggle logic across forms
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, showIcon = true, id, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `password-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;

    return (
      <div className='space-y-2'>
        {label && (
          <Label htmlFor={inputId} className='text-sm font-medium'>
            {label}
            {props.required && (
              <span className='text-destructive ml-1' aria-label='required'>
                *
              </span>
            )}
          </Label>
        )}
        <div className='relative'>
          {showIcon && (
            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
          )}
          <Input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={`${showIcon ? "pl-10" : ""} pr-10 ${
              error ? "border-destructive focus-visible:ring-destructive" : ""
            } ${className}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
            aria-required={props.required}
            {...props}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded p-0.5'
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={0}
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
  }
);

PasswordInput.displayName = "PasswordInput";
