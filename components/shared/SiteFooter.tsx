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
  { href: "/lab-partners", label: "Lab Partners" },
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

export function SiteFooter({
  showDeveloperCredit = false,
}: {
  showDeveloperCredit?: boolean;
}) {
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
