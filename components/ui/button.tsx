import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 gpu-accelerated",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-blue-500/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 hover:shadow-xl hover:-translate-y-0.5",
        outline:
          "border-2 border-primary/30 bg-background shadow-sm hover:bg-primary/5 hover:text-primary hover:border-primary hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground shadow-md shadow-emerald-500/20 hover:bg-secondary/90 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5",
        ghost: "hover:bg-primary/5 hover:text-primary hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 hover:from-cyan-400 hover:via-blue-400 hover:to-blue-500",
        medical:
          "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-0.5 hover:from-blue-400 hover:via-cyan-400 hover:to-teal-400",
        success:
          "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 hover:from-emerald-400 hover:to-teal-500",
        warning:
          "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:from-amber-400 hover:to-orange-500",
        glass:
          "backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-2 border-blue-100/40 dark:border-cyan-900/40 shadow-lg shadow-blue-50/30 hover:bg-white/90 dark:hover:bg-gray-900/90 hover:shadow-xl hover:border-blue-200 dark:hover:border-cyan-800",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
