"use client";

import { trackEzLabEvent } from "@/lib/analytics";
import { homepageTrustBadgeCopy } from "@/lib/copyContent";
import { Hospital, Lock, ShieldCheck } from "lucide-react";
import { useEffect } from "react";

const icons = [ShieldCheck, Hospital, Lock];

interface CompactTrustBadgesProps {
  placement: "hero" | "final-cta";
  className?: string;
}

export function CompactTrustBadges({
  placement,
  className = "",
}: CompactTrustBadgesProps) {
  useEffect(() => {
    trackEzLabEvent("trust_badge_impression", {
      placement,
      badges: homepageTrustBadgeCopy.map((badge) => badge.title),
    });
  }, [placement]);

  return (
    <div
      className={`flex flex-wrap gap-2 ${className}`}
      aria-label='Trust and security badges'
      data-experiment='trust-badges-v1'
      data-placement={placement}
    >
      {homepageTrustBadgeCopy.map((badge, index) => {
        const Icon = icons[index] ?? ShieldCheck;

        return (
          <span
            key={badge.title}
            className='inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200'
            aria-label={`${badge.title}: ${badge.label}`}
          >
            <Icon className='h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300' />
            <span>{badge.title}</span>
            <span className='hidden font-semibold text-slate-500 dark:text-slate-400 sm:inline'>
              {badge.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}
