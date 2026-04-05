import { EmptyValue } from "@/components/profile/EmptyValue";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface InfoRowProps {
  label: string;
  value?: string | ReactNode | null;
  className?: string;
  emptyContent?: ReactNode;
}

export function InfoRow({
  label,
  value,
  className,
  emptyContent,
}: InfoRowProps) {
  const hasValue =
    value !== null &&
    value !== undefined &&
    !(typeof value === "string" && value.trim().length === 0);

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0",
        className,
      )}
    >
      <dt className='text-sm font-medium text-slate-700'>{label}</dt>
      <dd className='text-sm text-slate-900 text-right'>
        {hasValue ? value : emptyContent || <EmptyValue />}
      </dd>
    </div>
  );
}
