"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";
import type { KeyboardEvent } from "react";

const CODE_LENGTH = 6;

type SixDigitCodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  onComplete?: (value: string) => void;
  className?: string;
  inputClassName?: string;
};

export function SixDigitCodeInput({
  value,
  onChange,
  ariaLabel = "Verification code",
  autoFocus = false,
  disabled = false,
  onComplete,
  className,
  inputClassName,
}: SixDigitCodeInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const sanitizedValue = value.replace(/\D/g, "").slice(0, CODE_LENGTH);
  const digits = Array.from(
    { length: CODE_LENGTH },
    (_, index) => sanitizedValue[index] || "",
  );

  function commitValue(nextDigits: string[], focusIndex?: number) {
    const nextValue = nextDigits.join("").slice(0, CODE_LENGTH);
    onChange(nextValue);

    if (nextValue.length === CODE_LENGTH) {
      onComplete?.(nextValue);
    }

    if (typeof focusIndex === "number") {
      requestAnimationFrame(() => inputsRef.current[focusIndex]?.focus());
    }
  }

  function updateDigit(index: number, rawValue: string) {
    const digit = rawValue.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    commitValue(
      nextDigits,
      digit ? Math.min(index + 1, CODE_LENGTH - 1) : index,
    );
  }

  function handlePaste(pastedValue: string) {
    const pastedDigits = pastedValue.replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pastedDigits) return;

    const nextDigits = Array.from(
      { length: CODE_LENGTH },
      (_, index) => pastedDigits[index] || "",
    );
    commitValue(nextDigits, Math.min(pastedDigits.length, CODE_LENGTH) - 1);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      const nextDigits = [...digits];
      nextDigits[index - 1] = "";
      commitValue(nextDigits, index - 1);
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputsRef.current[index - 1]?.focus();
      return;
    }

    if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      event.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  }

  return (
    <div
      className={cn(
        "grid w-full max-w-xs grid-cols-6 gap-2",
        className,
      )}
      aria-label={ariaLabel}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputsRef.current[index] = node;
          }}
          type='text'
          inputMode='numeric'
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && index === 0}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => {
            event.preventDefault();
            handlePaste(event.clipboardData.getData("text"));
          }}
          className={cn(
            "h-11 w-full rounded-lg border border-blue-100 bg-white text-center text-lg font-semibold text-slate-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 sm:h-12",
            inputClassName,
          )}
          aria-label={`${ariaLabel} digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
