"use client";

import { useRestrictionStatus } from "@/lib/context/RestrictionStatusContext";
import {
  getRestrictionAvailabilityLabel,
  getRestrictionIpDisplay,
  getRestrictionStateDisplay,
  isRestrictionBlocked,
} from "@/lib/restrictions/presentation";
import { Mail, MapPin, Phone, Radar, ShieldAlert } from "lucide-react";
import Link from "next/link";

const testsLinks = [
  { href: "/tests", label: "Browse All Tests" },
  { href: "/tests?categorySlug=std", label: "STD Testing" },
  { href: "/tests?categorySlug=general-health", label: "General Health" },
  { href: "/tests?categorySlug=hormones", label: "Hormones" },
  { href: "/tests?categorySlug=cardiac", label: "Heart Health" },
  { href: "/tests?categorySlug=metabolic", label: "Diabetes" },
  { href: "/tests?categorySlug=thyroid", label: "Thyroid" },
];

const companyLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/lab-partner", label: "Lab Partners" },
  { href: "/find-lab-center", label: "Draw Center Locator" },
  { href: "/faqs", label: "FAQs" },
  { href: "/help-center", label: "Help Center" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/hipaa-notice", label: "HIPAA Notice" },
  { href: "/accessibility", label: "Accessibility" },
];

function formatLocationTimestamp(lastCheckedAt: string | null): string | null {
  if (!lastCheckedAt) {
    return null;
  }

  const date = new Date(lastCheckedAt);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function SiteFooter({
  showDeveloperCredit = false,
}: {
  showDeveloperCredit?: boolean;
}) {
  const {
    status: restrictionStatus,
    isLoading,
    lastCheckedAt,
  } = useRestrictionStatus();
  const stateLabel = getRestrictionStateDisplay(restrictionStatus);
  const ipLabel = getRestrictionIpDisplay(restrictionStatus);
  const availabilityLabel = getRestrictionAvailabilityLabel(restrictionStatus);
  const isRestricted = isRestrictionBlocked(restrictionStatus);
  const lastCheckedLabel = formatLocationTimestamp(lastCheckedAt);
  const locationSourceLabel =
    restrictionStatus?.source === "ip_lookup"
      ? "IP lookup"
      : restrictionStatus?.source === "geo_header"
        ? "Network region"
        : restrictionStatus?.source === "checkout_state"
          ? "Checkout state"
          : "Pending signal";

  const cardToneClasses = isRestricted
    ? "border-amber-400/35 bg-amber-500/[0.08] text-amber-50"
    : restrictionStatus
      ? "border-emerald-400/30 bg-emerald-500/[0.08] text-emerald-50"
      : "border-slate-700/80 bg-slate-950/70 text-slate-100";
  const statusChipClasses = isRestricted
    ? "border-amber-400/30 bg-amber-400/10 text-amber-100"
    : restrictionStatus
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
      : "border-slate-700 bg-slate-900/80 text-slate-200";

  return (
    <footer className='bg-slate-900 text-slate-300'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4'>
          <div>
            <Link href='/' className='mb-4 inline-flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600'>
                <span className='text-xs font-extrabold text-white'>EZ</span>
              </div>
              <span className='text-base font-bold text-white'>
                Ez LabTesting
              </span>
            </Link>
            <p className='text-sm leading-relaxed text-slate-400'>
              Affordable, confidential lab testing for everyone. Order online,
              visit a draw center near you, and get results in days - all at
              discounted cash prices with no insurance required.
            </p>
          </div>

          <div>
            <h4 className='mb-4 text-xs font-bold uppercase tracking-widest text-white'>
              Tests
            </h4>
            <ul className='space-y-2.5'>
              {testsLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-sm text-slate-400 transition-colors hover:text-white'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='mb-4 text-xs font-bold uppercase tracking-widest text-white'>
              Company
            </h4>
            <ul className='space-y-2.5'>
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-sm text-slate-400 transition-colors hover:text-white'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='mb-4 text-xs font-bold uppercase tracking-widest text-white'>
              Contact
            </h4>
            <ul className='space-y-3'>
              <li>
                <a
                  href='mailto:support@ezlabtesting.com'
                  className='flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white'
                >
                  <Mail className='h-4 w-4 shrink-0' />
                  support@ezlabtesting.com
                </a>
              </li>
              <li>
                <a
                  href='tel:18003952227'
                  className='flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white'
                >
                  <Phone className='h-4 w-4 shrink-0' />
                  1-800-EZ-LABS
                </a>
              </li>
              <li className='flex items-start gap-2'>
                <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-slate-500' />
                <span className='text-xs leading-relaxed text-slate-500'>
                  Mon-Fri 8am-6pm EST
                  <br />
                  Nationwide Lab Network
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className='pb-8 flex justify-center'>
          <div
            className={`w-full max-w-fit rounded-2xl border px-4 py-4 sm:px-6 shadow-lg ${cardToneClasses}`}
          >
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-4'>
                <div className='rounded-full border border-white/10 bg-slate-950/40 p-2 sm:p-2.5'>
                  {isRestricted ? (
                    <ShieldAlert className='h-4 w-4 sm:h-5 sm:w-5' />
                  ) : (
                    <Radar className='h-4 w-4 sm:h-5 sm:w-5' />
                  )}
                </div>

                <div className='flex-1'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p className='text-sm font-semibold text-white sm:text-base'>
                      {isLoading && !restrictionStatus
                        ? "Refreshing signal..."
                        : availabilityLabel}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] sm:px-2.5 ${statusChipClasses}`}
                    >
                      {locationSourceLabel}
                    </span>
                  </div>
                  <div className='mt-1 flex flex-wrap items-center text-[11px] text-slate-300 sm:text-xs'>
                    <span>
                      {stateLabel
                        ? `Region: ${stateLabel}`
                        : "Region unavailable"}
                    </span>
                    <span className='mx-2 opacity-40'>|</span>
                    <span>IP: {ipLabel || "Unavailable"}</span>
                    <span className='mx-2 opacity-40'>|</span>
                    <span>Checked: {lastCheckedLabel || "Pending"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='border-t border-slate-800 py-6'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div className='text-xs text-slate-500'>
              <p>
                &copy; {new Date().getFullYear()} Ez LabTesting. All rights
                reserved.
              </p>
            </div>

            {showDeveloperCredit && (
              <div className='text-xs text-slate-500 md:text-center text-left'>
                <a
                  href='https://www.kofil.online/en/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='transition-colors hover:text-slate-300'
                >
                  Developed by Engr. Kofil
                </a>
              </div>
            )}

            <div className='flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 md:justify-end'>
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className='transition-colors hover:text-slate-300'
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
