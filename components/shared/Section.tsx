import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  withDivider?: boolean;
}

/**
 * Section component with title, optional icon, and content
 */
export function Section({
  title,
  icon,
  children,
  className,
  contentClassName,
  withDivider = false,
}: SectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {/* Header */}
      <div className='flex items-center gap-2'>
        {icon && <div className='text-primary'>{icon}</div>}
        <h3 className='text-lg font-semibold text-foreground'>{title}</h3>
      </div>

      {/* Divider */}
      {withDivider && <div className='h-px bg-border' />}

      {/* Content */}
      <div className={cn("space-y-3", contentClassName)}>{children}</div>
    </section>
  );
}
