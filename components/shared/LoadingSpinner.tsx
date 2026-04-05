import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({
  className,
  size = "md",
  text = "Loading...",
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      role='status'
      aria-live='polite'
      aria-label={text}
    >
      <Loader2 className={cn("animate-spin text-primary", sizes[size])} />
      <span className='sr-only'>{text}</span>
    </div>
  );
}
