import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-primary shadow-sm shadow-blue-500/20 hover:bg-primary/90 hover:shadow-md hover:shadow-blue-500/30",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary shadow-sm shadow-emerald-500/20 hover:bg-secondary/90 hover:shadow-md hover:shadow-emerald-500/30",
        destructive:
          "bg-destructive text-destructive-foreground border-destructive shadow-sm hover:bg-destructive/90 hover:shadow-md",
        outline:
          "text-foreground border-blue-200 dark:border-cyan-800/40 bg-blue-50/50 dark:bg-cyan-950/20 hover:bg-blue-100/70 dark:hover:bg-cyan-900/30",
        medical:
          "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent shadow-sm shadow-cyan-500/20 hover:shadow-md hover:shadow-cyan-500/30",
        success:
          "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-sm shadow-emerald-500/20 hover:shadow-md hover:shadow-emerald-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
