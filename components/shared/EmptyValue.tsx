import { cn } from "@/lib/utils";

interface EmptyValueProps {
  variant?: "default" | "minimal";
  className?: string;
}

/**
 * Renders "Not provided" / "Not set" consistently
 */
export function EmptyValue({
  variant = "default",
  className,
}: EmptyValueProps) {
  if (variant === "minimal") {
    return (
      <span className={cn("text-muted-foreground italic", className)}>
        Not provided
      </span>
    );
  }

  return (
    <span
      className={cn("text-muted-foreground/70 text-sm font-medium", className)}
    >
      Not provided
    </span>
  );
}
