"use client";

import { FieldError } from "@/components/shared/FieldError";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";

type PasswordInputProps = Omit<
  React.ComponentPropsWithoutRef<typeof Input>,
  "type"
> & {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { id, label, error, required, className, ...props }: PasswordInputProps,
    ref,
  ) {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className='space-y-1.5'>
        <Label htmlFor={id}>
          {label}
          {required ? " *" : ""}
        </Label>
        <div className='relative'>
          <Input
            id={id}
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={className}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />
          <button
            type='button'
            onClick={() => setShowPassword((current) => !current)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700'
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </button>
        </div>
        <FieldError error={error} id={`${id}-error`} />
      </div>
    );
  },
);
