import { Lock, Shield } from "lucide-react";

interface SecurityBadgeProps {
  variant?: "full" | "compact";
  className?: string;
  children?: React.ReactNode;
}

/**
 * Security and compliance badge for medical data trust
 * Shows HIPAA compliance and SSL encryption status
 */
export function SecurityBadge({
  variant = "full",
  className = "",
  children,
}: SecurityBadgeProps) {
  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-center gap-2 text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium ${className}`}
        role='img'
        aria-label='Secure and HIPAA compliant'
      >
        <Shield className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
        <span>{children || "Secure & HIPAA Compliant"}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center gap-2 sm:gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 ${className}`}
      role='img'
      aria-label='This form is secure with 256-bit SSL encryption and HIPAA compliant'
    >
      <Lock className='h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400' />
      <span className='text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300'>
        {children || (
          <>
            <span className='hidden sm:inline'>🔒 256-bit SSL Encryption</span>
            <span className='sm:hidden'>🔒 SSL Encrypted</span>
            <span className='mx-1.5 sm:mx-2'>•</span>
            <span>HIPAA Compliant</span>
          </>
        )}
      </span>
    </div>
  );
}
