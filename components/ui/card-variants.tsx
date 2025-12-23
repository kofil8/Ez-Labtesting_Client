import { cn } from "@/lib/utils";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

/**
 * Interactive Card - Best for clickable items like tests, panels, transactions
 */
export const InteractiveCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "cursor-pointer group hover:scale-105 active:scale-100",
      className
    )}
    {...props}
  />
));
InteractiveCard.displayName = "InteractiveCard";

/**
 * Stat Card - Best for displaying metrics and statistics
 */
export const StatCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode;
    label?: string;
    value?: string | number;
  }
>(({ className, icon, label, value, children, ...props }, ref) => (
  <Card
    ref={ref}
    variant='elevated'
    size='sm'
    className={cn(
      "flex flex-col items-center justify-center text-center py-8",
      className
    )}
    {...props}
  >
    {icon && (
      <div className='mb-3 text-blue-600 dark:text-cyan-400'>{icon}</div>
    )}
    {label && (
      <p className='text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2'>
        {label}
      </p>
    )}
    {value && (
      <p className='text-2xl font-bold text-foreground mb-2'>{value}</p>
    )}
    {children}
  </Card>
));
StatCard.displayName = "StatCard";

/**
 * Feature Card - Best for showcasing features with icon and description
 */
export const FeatureCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
  }
>(({ className, icon, title, description, children, ...props }, ref) => (
  <Card
    ref={ref}
    variant='flat'
    className={cn(
      "p-6 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors",
      className
    )}
    {...props}
  >
    {icon && (
      <div className='mb-4 h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400'>
        {icon}
      </div>
    )}
    {title && <h3 className='font-semibold text-foreground mb-2'>{title}</h3>}
    {description && (
      <p className='text-sm text-gray-600 dark:text-gray-400'>{description}</p>
    )}
    {children}
  </Card>
));
FeatureCard.displayName = "FeatureCard";

/**
 * Compact Card - Best for dense layouts with minimal content
 */
export const CompactCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    variant='outline'
    size='sm'
    className={cn("p-4", className)}
    {...props}
  />
));
CompactCard.displayName = "CompactCard";

/**
 * Alert Card - Best for important notifications or warnings
 */
export const AlertCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "info" | "success" | "warning" | "error";
    title?: string;
  }
>(({ className, variant = "info", title, children, ...props }, ref) => {
  const variantStyles = {
    info: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    success:
      "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
    warning:
      "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
    error: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
  };

  return (
    <Card
      ref={ref}
      className={cn("border-2", variantStyles[variant], className)}
      {...props}
    >
      <CardContent className='pt-6'>
        {title && <p className='font-semibold mb-2 text-foreground'>{title}</p>}
        <div className='text-sm'>{children}</div>
      </CardContent>
    </Card>
  );
});
AlertCard.displayName = "AlertCard";

/**
 * Form Card - Best for form content with header and footer
 */
export const FormCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
  }
>(({ className, title, description, children, ...props }, ref) => (
  <Card
    ref={ref}
    variant='elevated'
    className={cn("flex flex-col", className)}
    {...props}
  >
    {(title || description) && (
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
    )}
    <CardContent className='flex-1'>{children}</CardContent>
  </Card>
));
FormCard.displayName = "FormCard";
