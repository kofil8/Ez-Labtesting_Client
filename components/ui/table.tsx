import React from "react";
import { cn } from "@/lib/utils";

export const Table: React.FC<
  React.HTMLAttributes<HTMLTableElement>
> = ({ children, className, ...props }) => {
  return (
    <table
      className={cn("w-full border-collapse border border-gray-300", className)}
      {...props}
    >
      {children}
    </table>
  );
};

export const TableHeader: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ children, className, ...props }) => {
  return (
    <thead className={cn("bg-gray-100", className)} {...props}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ children, className, ...props }) => {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<
  React.HTMLAttributes<HTMLTableRowElement>
> = ({ children, className, ...props }) => {
  return (
    <tr className={cn("border-b", className)} {...props}>
      {children}
    </tr>
  );
};

export const TableHead = ({
  children,
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <th className={cn("px-4 py-2 text-left font-semibold", className)} {...props}>
      {children}
    </th>
  );
};

export const TableCell = ({
  children,
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <td className={cn("px-4 py-2", className)} {...props}>
      {children}
    </td>
  );
};
