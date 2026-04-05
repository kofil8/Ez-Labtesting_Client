import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value?: ReactNode | null | undefined;
  emptyText?: string;
  className?: string;
}

/**
 * Reusable info card for displaying a labeled value with icon
 */
export function InfoCard({
  icon,
  label,
  value,
  emptyText = "Not provided",
  className,
}: InfoCardProps) {
  const isEmpty = value === null || value === undefined || value === "";

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors",
        className,
      )}
    >
      <div className='flex-shrink-0 text-primary mt-0.5'>{icon}</div>
      <div className='flex-1 min-w-0'>
        <p className='text-sm text-muted-foreground font-medium mb-1'>
          {label}
        </p>
        <p className='text-sm font-medium text-foreground break-words'>
          {isEmpty ? emptyText : value}
        </p>
      </div>
    </div>
  );
}
