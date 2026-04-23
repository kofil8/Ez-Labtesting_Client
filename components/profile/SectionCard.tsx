import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  icon,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-slate-200/80 bg-white/92 p-5 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6",
        className,
      )}
    >
      <header className='mb-5 flex items-center gap-3 border-b border-slate-100 pb-4'>
        {icon ? (
          <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700'>
            {icon}
          </div>
        ) : null}
        <h2 className='text-base font-semibold text-slate-900'>{title}</h2>
      </header>
      <dl>{children}</dl>
    </section>
  );
}
