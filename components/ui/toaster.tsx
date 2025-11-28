"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position='top-right'
      richColors
      closeButton
      expand={true}
      duration={4000}
      toastOptions={{
        className: "modern-toast",
        classNames: {
          toast:
            "modern-toast-base group toast group-[.toaster]:backdrop-blur-2xl group-[.toaster]:border-2 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:transition-all group-[.toaster]:duration-300 group-[.toaster]:p-5 group-[.toaster]:min-w-[320px] group-[.toaster]:max-w-[420px]",
          description:
            "group-[.toast]:text-white/90 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:leading-relaxed",
          title:
            "group-[.toast]:text-white group-[.toast]:font-bold group-[.toast]:text-base group-[.toast]:mb-1",
          actionButton:
            "group-[.toast]:bg-white/20 group-[.toast]:text-white group-[.toast]:hover:bg-white/30 group-[.toast]:rounded-lg group-[.toast]:transition-all group-[.toast]:font-semibold group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:backdrop-blur-sm",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-white/80 group-[.toast]:hover:bg-white/20 group-[.toast]:rounded-lg group-[.toast]:transition-all",
          closeButton:
            "group-[.toast]:text-white/70 group-[.toast]:hover:text-white group-[.toast]:hover:bg-white/10 group-[.toast]:rounded-lg group-[.toast]:transition-all",
          success:
            "group-[.toast]:bg-gradient-to-br group-[.toast]:from-green-500 group-[.toast]:via-emerald-500 group-[.toast]:to-teal-500 group-[.toast]:text-white group-[.toast]:border-green-400/40 group-[.toast]:shadow-xl group-[.toast]:shadow-green-500/30",
          error:
            "group-[.toast]:bg-gradient-to-br group-[.toast]:from-red-500 group-[.toast]:via-rose-500 group-[.toast]:to-pink-500 group-[.toast]:text-white group-[.toast]:border-red-400/40 group-[.toast]:shadow-xl group-[.toast]:shadow-red-500/30",
          info: "group-[.toast]:bg-gradient-to-br group-[.toast]:from-blue-500 group-[.toast]:via-indigo-500 group-[.toast]:to-purple-500 group-[.toast]:text-white group-[.toast]:border-blue-400/40 group-[.toast]:shadow-xl group-[.toast]:shadow-blue-500/30",
          warning:
            "group-[.toast]:bg-gradient-to-br group-[.toast]:from-yellow-500 group-[.toast]:via-orange-500 group-[.toast]:to-amber-500 group-[.toast]:text-white group-[.toast]:border-yellow-400/40 group-[.toast]:shadow-xl group-[.toast]:shadow-yellow-500/30",
        },
      }}
    />
  );
}
