import { X } from "lucide-react";

type FormStateMessageProps = {
  type?: "error" | "success";
  message: string;
  details?: string;
  onDismiss?: () => void;
};

export function FormStateMessage({
  type = "error",
  message,
  details,
  onDismiss,
}: FormStateMessageProps) {
  const isError = type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={[
        "relative rounded-2xl border p-4 pr-12 text-sm",
        isError
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800",
      ].join(" ")}
    >
      <p className='font-semibold'>{message}</p>
      {details ? <p className='mt-1 opacity-90'>{details}</p> : null}
      {onDismiss ? (
        <button
          type='button'
          onClick={onDismiss}
          className='absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-current hover:bg-black/5'
          aria-label='Dismiss message'
        >
          <X className='h-4 w-4' />
        </button>
      ) : null}
    </div>
  );
}
