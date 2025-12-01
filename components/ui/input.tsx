import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border-2 border-blue-100 dark:border-cyan-900/40 bg-background px-4 py-2 text-base shadow-sm shadow-blue-50/20 transition-all duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 focus-visible:border-primary focus-visible:shadow-md focus-visible:shadow-blue-200/30 hover:border-primary/40 hover:shadow-md hover:shadow-blue-100/30 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm gpu-accelerated",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
