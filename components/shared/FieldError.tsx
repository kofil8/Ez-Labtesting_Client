import { AlertCircle } from "lucide-react";

interface FieldErrorProps {
  error?: string;
  id?: string;
  className?: string;
}

export function FieldError({ error, id, className = "" }: FieldErrorProps) {
  if (!error) return null;

  return (
    <p
      id={id}
      role='alert'
      aria-live='polite'
      className={`mt-1.5 flex items-center gap-1 text-xs font-medium text-destructive ${className}`}
    >
      <AlertCircle className='h-3 w-3 flex-shrink-0' />
      <span>{error}</span>
    </p>
  );
}
