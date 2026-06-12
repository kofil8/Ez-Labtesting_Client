import { BadgeCheck, LockKeyhole, Shield } from "lucide-react";

const TRUST_ITEMS = [
  { label: "HIPAA compliant", icon: Shield },
  { label: "Encrypted data", icon: LockKeyhole },
  { label: "Trusted labs", icon: BadgeCheck },
] as const;

export function TrustChips() {
  return (
    <div className='mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 border-t border-slate-200/80 pt-4 text-[11px] font-medium text-slate-500 sm:text-xs'>
      {TRUST_ITEMS.map((item, index) => {
        const Icon = item.icon;

        return (
          <div key={item.label} className='inline-flex items-center gap-1.5'>
            {index > 0 ? (
              <span className='hidden h-3.5 w-px bg-slate-200 sm:inline-block' />
            ) : null}
            <Icon className='h-3.5 w-3.5 text-slate-400' aria-hidden='true' />
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
