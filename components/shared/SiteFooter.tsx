"use client";

import { Mail, MapPin, Phone } from "lucide-react";
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

export function SiteFooter() {
  return (
    <footer className='bg-slate-900 text-slate-300'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        {/* Main grid */}
        <div className='grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4'>
          {/* Brand */}
          <div>
            <Link href='/' className='inline-flex items-center gap-2 mb-4'>
              <div className='w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center'>
                <span className='text-white text-xs font-extrabold'>EZ</span>
              </div>
              <span className='text-white font-bold text-base'>
                Ez LabTesting
              </span>
            </Link>
            <p className='text-sm leading-relaxed text-slate-400'>
              Affordable, confidential lab testing for everyone. Order online,
              visit a draw center near you, and get results in days — all at
              discounted cash prices with no insurance required.
            </p>
          </div>

          {/* Tests */}
          <div>
            <h4 className='text-xs font-bold uppercase tracking-widest text-white mb-4'>
              Tests
            </h4>
            <ul className='space-y-2.5'>
              {testsLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-sm text-slate-400 hover:text-white transition-colors'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className='text-xs font-bold uppercase tracking-widest text-white mb-4'>
              Company
            </h4>
            <ul className='space-y-2.5'>
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-sm text-slate-400 hover:text-white transition-colors'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='text-xs font-bold uppercase tracking-widest text-white mb-4'>
              Contact
            </h4>
            <ul className='space-y-3'>
              <li>
                <a
                  href='mailto:support@ezlabtesting.com'
                  className='flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors'
                >
                  <Mail className='h-4 w-4 shrink-0' />
                  support@ezlabtesting.com
                </a>
              </li>
              <li>
                <a
                  href='tel:18003952227'
                  className='flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors'
                >
                  <Phone className='h-4 w-4 shrink-0' />
                  1-800-EZ-LABS
                </a>
              </li>
              <li className='flex items-start gap-2'>
                <MapPin className='h-4 w-4 shrink-0 mt-0.5 text-slate-500' />
                <span className='text-xs text-slate-500 leading-relaxed'>
                  Mon–Fri 8am–6pm EST
                  <br />
                  Nationwide Lab Network
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='border-t border-slate-800 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
          <p className='text-xs text-slate-500'>
            &copy; {new Date().getFullYear()} Ez LabTesting. All rights
            reserved.
          </p>
          <div className='flex flex-wrap gap-4'>
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className='text-xs text-slate-500 hover:text-slate-300 transition-colors'
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
