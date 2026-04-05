import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface InlineErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Inline error display with optional retry button
 */
export function InlineError({
  message = "Unable to load profile. Please try again.",
  onRetry,
  className,
}: InlineErrorProps) {
  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg border border-destructive/30 bg-destructive/5 ${
        className || ""
      }`}
    >
      <AlertCircle className='h-5 w-5 text-destructive flex-shrink-0 mt-0.5' />
      <div className='flex-1'>
        <p className='text-sm font-medium text-destructive'>{message}</p>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant='outline'
          size='sm'
          className='flex-shrink-0'
        >
          Retry
        </Button>
      )}
    </div>
  );
}
