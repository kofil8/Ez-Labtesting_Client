import { AlertCircle } from "lucide-react";

interface FieldErrorProps {
  error?: string;
  id?: string;
  className?: string;
}

/**
 * Form field error message with proper ARIA attributes
 * Should be linked to form inputs via aria-describedby
 */
export function FieldError({ error, id, className = "" }: FieldErrorProps) {
  if (!error) return null;

  return (
    <p
      id={id}
      role='alert'
      aria-live='polite'
      className={`text-xs text-destructive font-medium mt-1.5 flex items-center gap-1 ${className}`}
    >
      <AlertCircle className='h-3 w-3 flex-shrink-0' />
      <span>{error}</span>
    </p>
  );
}
