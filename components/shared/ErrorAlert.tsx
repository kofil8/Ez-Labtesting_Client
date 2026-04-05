import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  className?: string;
}

/**
 * Reusable error alert component with proper ARIA attributes
 * Displays error messages with consistent styling and accessibility
 */
export function ErrorAlert({ message, className = "" }: ErrorAlertProps) {
  return (
    <div
      role='alert'
      aria-live='polite'
      className={`p-4 rounded-xl bg-destructive/10 border-2 border-destructive/30 ${className}`}
    >
      <div className='flex items-center gap-3'>
        <AlertCircle className='h-5 w-5 text-destructive flex-shrink-0' />
        <p className='text-sm font-medium text-destructive'>{message}</p>
      </div>
    </div>
  );
}
