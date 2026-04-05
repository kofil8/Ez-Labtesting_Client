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
  } as const;

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
      <div className='min-w-0 flex-1'>
        <p
          className={`text-sm font-semibold ${type === "success" ? "break-words" : ""}`}
        >
          {message}
        </p>
        {details ? <p className='mt-1 text-sm opacity-90'>{details}</p> : null}
      </div>
      {type !== "success" ? (
        <button
          onClick={handleDismiss}
          className='flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-current hover:bg-opacity-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
          aria-label='Dismiss message'
          type='button'
        >
          <X className='h-4 w-4' />
        </button>
      ) : null}
    </div>
  );
}
