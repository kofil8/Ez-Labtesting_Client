"use client";

import {
  Clock,
  HeartPulse,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const popularTestsLinks = [
  { href: "/tests", label: "Browse All Tests" },
  { href: "/tests?search=annual%20checkup", label: "Annual Checkup" },
  { href: "/tests?search=heart%20lipid", label: "Heart Health" },
  { href: "/tests?search=thyroid", label: "Thyroid Panel" },
  { href: "/tests?search=diabetes", label: "Diabetes Screening" },
  { href: "/tests?search=std", label: "STD Testing" },
];

const companyLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/#state-availability", label: "State Availability" },
  { href: "/lab-partners", label: "Lab Partners" },
  { href: "/find-lab-center", label: "Find a Draw Center" },
  { href: "/help-center", label: "Help Center" },
  { href: "/support", label: "Contact Support" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/hipaa-notice", label: "HIPAA Notice" },
  { href: "/accessibility", label: "Accessibility" },
];

export function SiteFooter() {
  return (
    <footer className='bg-slate-950 text-slate-300 pb-20 sm:pb-16 lg:pb-12'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        {/* Main 4-Column Balanced Grid */}
        <div className='grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8'>
          {/* Col 1: Brand, Description & Trust Badges */}
          <div className='lg:col-span-4'>
            <Link href='/' className='mb-4 inline-flex items-center gap-2.5'>
              <div className='relative h-8 w-8 overflow-hidden rounded-lg'>
                <Image
                  src='/images/logo.svg'
                  alt='EzLabTesting Logo'
                  fill
                  className='object-contain'
                  unoptimized
                />
              </div>
              <span className='text-lg font-bold tracking-tight text-white'>
                EzLabTesting
              </span>
            </Link>
            <p className='mb-5 max-w-sm text-sm leading-relaxed text-slate-400'>
              Confidential, physician-approved clinical lab testing ordered online with 4,000+ CLIA-certified draw centers across the USA.
            </p>

            {/* Visual Trust Chips */}
            <div className='flex flex-wrap items-center gap-2'>
              <div className='inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-xs font-medium text-slate-300'>
                <ShieldCheck className='h-3.5 w-3.5 text-emerald-400' />
                <span>HIPAA Compliant</span>
              </div>
              <div className='inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-xs font-medium text-slate-300'>
                <Shield className='h-3.5 w-3.5 text-sky-400' />
                <span>CLIA Certified Labs</span>
              </div>
            </div>
          </div>

          {/* Col 2: Popular Tests */}
          <div className='lg:col-span-3 lg:pl-4'>
            <h4 className='mb-4 text-xs font-bold uppercase tracking-wider text-white'>
              Popular Tests
            </h4>
            <ul className='space-y-2.5'>
              {popularTestsLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-sm text-slate-400 transition-colors hover:text-sky-400'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company & How it Works */}
          <div className='lg:col-span-2'>
            <h4 className='mb-4 text-xs font-bold uppercase tracking-wider text-white'>
              Company
            </h4>
            <ul className='space-y-2.5'>
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-sm text-slate-400 transition-colors hover:text-sky-400'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Support & Contact */}
          <div className='lg:col-span-3'>
            <h4 className='mb-4 text-xs font-bold uppercase tracking-wider text-white'>
              Support &amp; Contact
            </h4>
            <ul className='space-y-3.5 text-sm text-slate-400'>
              <li>
                <a
                  href='mailto:support@ezlabtesting.com'
                  className='group flex items-center gap-2.5 transition-colors hover:text-sky-400'
                >
                  <span className='flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-slate-400 group-hover:text-sky-400'>
                    <Mail className='h-3.5 w-3.5' />
                  </span>
                  <span>support@ezlabtesting.com</span>
                </a>
              </li>
              <li>
                <a
                  href='tel:18003952227'
                  className='group flex items-center gap-2.5 transition-colors hover:text-sky-400'
                >
                  <span className='flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-slate-400 group-hover:text-sky-400'>
                    <Phone className='h-3.5 w-3.5' />
                  </span>
                  <span>1-800-EZ-LABS (395-2227)</span>
                </a>
              </li>
              <li className='flex items-start gap-2.5 text-xs text-slate-500'>
                <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-900 text-slate-400'>
                  <Clock className='h-3.5 w-3.5' />
                </span>
                <div className='pt-0.5 leading-relaxed'>
                  <p className='text-slate-300 font-medium'>Mon–Fri 8:00 AM – 8:00 PM EST</p>
                  <p className='text-slate-500'>Sat–Sun 9:00 AM – 5:00 PM EST</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Condensed Legal Disclaimer */}
        <div className='border-t border-slate-800/80 py-5'>
          <p className='text-xs leading-relaxed text-slate-500'>
            <strong className='font-semibold text-slate-400'>Disclaimer: </strong>
            EzLabTesting facilitates laboratory test ordering and independent physician network review. Laboratory testing is performed by CLIA-certified partner labs (including Quest Diagnostics, Labcorp, and ACCESS). Services are for wellness and informational screening and do not constitute medical advice or diagnosis. If you are experiencing a medical emergency, please call <strong>911</strong> immediately.
          </p>
        </div>

        {/* Footer Bottom Bar: Copyright, Legal Links & Payment Badges */}
        <div className='border-t border-slate-800/80 pt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          {/* Copyright & Legal Navigation */}
          <div className='flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500'>
            <span>&copy; {new Date().getFullYear()} EzLabTesting. All rights reserved.</span>
            <span className='hidden sm:inline text-slate-700'>•</span>
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
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

          {/* Payment Badges & HSA/FSA Eligibility */}
          <div className='flex flex-wrap items-center gap-2'>
            {/* Visa */}
            <span className='inline-flex h-6 items-center rounded border border-slate-800 bg-slate-900 px-2 text-[10px] font-semibold tracking-wider text-slate-300'>
              VISA
            </span>
            {/* Mastercard */}
            <span className='inline-flex h-6 items-center rounded border border-slate-800 bg-slate-900 px-2 text-[10px] font-semibold tracking-wider text-slate-300'>
              MASTERCARD
            </span>
            {/* Amex */}
            <span className='inline-flex h-6 items-center rounded border border-slate-800 bg-slate-900 px-2 text-[10px] font-semibold tracking-wider text-slate-300'>
              AMEX
            </span>
            {/* Apple Pay / Google Pay */}
            <span className='inline-flex h-6 items-center rounded border border-slate-800 bg-slate-900 px-2 text-[10px] font-semibold tracking-wider text-slate-300'>
              APPLE PAY
            </span>
            {/* Bold HSA / FSA Accepted Badge */}
            <span className='inline-flex h-6 items-center gap-1 rounded border border-emerald-500/30 bg-emerald-950/40 px-2 text-[10px] font-bold tracking-wide text-emerald-400'>
              <HeartPulse className='h-3 w-3' />
              HSA / FSA ACCEPTED
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
