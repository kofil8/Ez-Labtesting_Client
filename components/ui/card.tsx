import * as React from "react";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "flat" | "outline";
  size?: "sm" | "md" | "lg";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "min-h-fit",
      md: "min-h-[200px]",
      lg: "min-h-[300px]",
    };

    const variantClasses = {
      default:
        "rounded-xl border-2 border-blue-100 dark:border-cyan-900/40 bg-white dark:bg-gray-900 text-foreground shadow-md shadow-blue-50/30 dark:shadow-cyan-900/10 hover:shadow-lg hover:shadow-blue-100/40 dark:hover:shadow-cyan-800/20 hover:border-blue-200 dark:hover:border-cyan-800",
      elevated:
        "rounded-xl border-0 bg-white dark:bg-gray-900 text-foreground shadow-lg shadow-blue-100/50 dark:shadow-cyan-900/30 hover:shadow-xl hover:shadow-blue-200/60 dark:hover:shadow-cyan-800/40",
      flat: "rounded-lg border-0 bg-gray-50 dark:bg-gray-800 text-foreground hover:bg-gray-100 dark:hover:bg-gray-700",
      outline:
        "rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent hover:border-blue-300 dark:hover:border-cyan-800",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "transition-all duration-200 ease-out gpu-accelerated",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-tight tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-neutral-600 dark:text-neutral-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-4 flex-grow", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between gap-3 p-6 pt-4 border-t border-gray-100 dark:border-gray-800",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProps,
};
