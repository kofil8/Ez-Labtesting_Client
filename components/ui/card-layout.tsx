import { cn } from "@/lib/utils";
import React from "react";

interface CardGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const gapClasses = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

/**
 * Responsive card grid component
 * Automatically handles responsive column layout
 */
export function CardGrid({
  children,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
  gap = "md",
  className,
}: CardGridProps) {
  const gridColsClass = cn(
    `grid`,
    columns.mobile && `grid-cols-${columns.mobile}`,
    columns.tablet && `sm:grid-cols-${columns.tablet}`,
    columns.desktop && `lg:grid-cols-${columns.desktop}`,
    gapClasses[gap]
  );

  return <div className={cn(gridColsClass, className)}>{children}</div>;
}

interface CardListProps {
  children: React.ReactNode;
  layout?: "vertical" | "horizontal";
  gap?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Card list component for stacked or inline layouts
 */
export function CardList({
  children,
  layout = "vertical",
  gap = "md",
  className,
}: CardListProps) {
  const layoutClass =
    layout === "vertical" ? "flex flex-col" : "flex flex-row flex-wrap";

  return (
    <div className={cn(layoutClass, gapClasses[gap], className)}>
      {children}
    </div>
  );
}

interface CardContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

/**
 * Card container with max-width constraint
 */
export function CardContainer({
  children,
  maxWidth = "lg",
  className,
}: CardContainerProps) {
  return (
    <div className={cn("w-full", maxWidthClasses[maxWidth], className)}>
      {children}
    </div>
  );
}
