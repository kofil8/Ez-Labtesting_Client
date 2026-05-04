import { FieldError } from "@/components/shared/FieldError";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

interface FormInputProps extends React.ComponentPropsWithoutRef<typeof Input> {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, icon: Icon, error, className, ...props }, ref) => {
    const describedBy = [props["aria-describedby"], error ? `${id}-error` : ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div className='space-y-2'>
        <Label htmlFor={id} className='text-[13px] font-medium text-slate-700'>
          {label}
        </Label>
        <div className='group relative'>
          <Icon
            className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600'
            aria-hidden='true'
          />
          <Input
            ref={ref}
            id={id}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={describedBy || undefined}
            className={cn(
              "h-12 rounded-xl border border-slate-300 bg-white pl-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-slate-900/[0.03] focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-cyan-300/50",
              error && "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-200",
              className,
            )}
            {...props}
          />
        </div>
        <FieldError error={error} id={`${id}-error`} />
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
