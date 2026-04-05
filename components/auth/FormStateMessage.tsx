<<<<<<< HEAD
<<<<<<< HEAD
import { X } from "lucide-react";

type FormStateMessageProps = {
  type?: "error" | "success";
  message: string;
  details?: string;
  onDismiss?: () => void;
};

export function FormStateMessage({
  type = "error",
  message,
  details,
  onDismiss,
}: FormStateMessageProps) {
  const isError = type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={[
        "relative rounded-2xl border p-4 pr-12 text-sm",
        isError
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800",
      ].join(" ")}
    >
      <p className='font-semibold'>{message}</p>
      {details ? <p className='mt-1 opacity-90'>{details}</p> : null}
      {onDismiss ? (
        <button
          type='button'
          onClick={onDismiss}
          className='absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-current hover:bg-black/5'
          aria-label='Dismiss message'
        >
          <X className='h-4 w-4' />
        </button>
      ) : null}
=======
=======
>>>>>>> 79f18b8adbed41541c366ef4077ec9a710540515
"use client";

import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface FormStateMessageProps {
  type: "error" | "success" | "info";
  message: string;
  details?: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
  showIcon?: boolean;
}

/**
 * FormStateMessage - Animated form feedback component
 * Features:
 * - Slide-in animation from top
 * - Auto-dismiss after configurable delay
 * - Accessible with proper ARIA attributes
 * - Respects prefers-reduced-motion
 * - Medical-appropriate styling
 */
export function FormStateMessage({
  type,
  message,
  details,
  onDismiss,
  autoDismissMs = 5000,
  showIcon = true,
}: FormStateMessageProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    if (type === "success" && autoDismissMs > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [type, autoDismissMs]);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 200);
  };

  if (!isVisible) return null;

  const baseClasses =
    "p-4 rounded-lg border flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300 transition-all";

  const typeClasses = {
    error:
      "bg-red-50 border-red-200 text-red-900 error-message animate-in fade-in slide-in-from-top-2",
    success:
      "bg-green-50 border-green-200 text-green-900 success-message animate-in fade-in slide-in-from-top-2",
    info: "bg-blue-50 border-blue-200 text-blue-900 animate-in fade-in slide-in-from-top-2",
  };

  const iconClasses = {
    error: "text-red-600",
    success: "text-green-600",
    info: "text-blue-600",
  };

  const Icon =
    type === "error"
      ? AlertCircle
      : type === "success"
        ? CheckCircle2
        : AlertCircle;

  const roleText = {
    error: "alert",
    success: "status",
    info: "status",
  };

  return (
    <div
      className={`${baseClasses} ${typeClasses[type]} ${isDismissing ? "opacity-0" : "opacity-100"}`}
      role={roleText[type]}
      aria-live={type === "error" ? "assertive" : "polite"}
      aria-atomic='true'
    >
      {showIcon && (
        <Icon
          className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconClasses[type]} ${
            type === "error" ? "error-icon-pulse" : ""
          }`}
          aria-hidden='true'
        />
      )}
      <div className='flex-1 min-w-0'>
        <p
          className={`font-semibold text-sm ${type === "success" ? "break-words" : ""}`}
        >
          {message}
        </p>
        {details && <p className='text-sm mt-1 opacity-90'>{details}</p>}
      </div>
      {type !== "success" && (
        <button
          onClick={handleDismiss}
          className='flex-shrink-0 p-1 rounded-lg hover:bg-current hover:bg-opacity-10 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
          aria-label='Dismiss message'
          type='button'
        >
          <X className='h-4 w-4' />
        </button>
      )}
<<<<<<< HEAD
>>>>>>> 79f18b8adbed41541c366ef4077ec9a710540515
=======
>>>>>>> 79f18b8adbed41541c366ef4077ec9a710540515
    </div>
  );
}
