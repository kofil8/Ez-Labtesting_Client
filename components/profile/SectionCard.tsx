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
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <header className='mb-4 flex items-center gap-2 border-b border-slate-100 pb-3'>
        {icon}
        <h2 className='text-base font-semibold text-slate-900'>{title}</h2>
      </header>
      <dl>{children}</dl>
    </section>
  );
}
