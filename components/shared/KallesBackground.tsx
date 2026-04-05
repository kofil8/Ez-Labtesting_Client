"use client";

import { usePathname } from "next/navigation";

export function KallesBackground() {
  const pathname = usePathname();

  if (
    pathname?.includes("/login") ||
    pathname?.includes("/signup") ||
    pathname?.includes("/register") ||
    pathname?.includes("/forgot-password") ||
    pathname?.includes("/verify-otp") ||
    pathname?.includes("/reset-password")
  ) {
    return null;
  }

  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(8,145,178,0.12),transparent_38%),radial-gradient(circle_at_88%_8%,rgba(14,116,144,0.08),transparent_34%),linear-gradient(180deg,#f7fbff_0%,#f2f9fb_45%,#f7fbff_100%)]' />

      <div className='absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl' />
      <div className='absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl' />
      <div className='absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl' />

      <div
        className='absolute inset-0 opacity-[0.06]'
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.15) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
    </div>
  );
}
