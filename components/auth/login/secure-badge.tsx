import { ShieldCheck } from "lucide-react";

interface SecureBadgeProps {
  label: string;
}

export function SecureBadge({ label }: SecureBadgeProps) {
  return (
    <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-200/90 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>
      <ShieldCheck className='h-3.5 w-3.5' aria-hidden='true' />
      {label}
    </span>
  );
}
