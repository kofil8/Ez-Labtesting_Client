"use client";

import { Clock, Mail, Phone, Shield, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const testsLinks = [
  { href: "/tests", label: "Browse All Tests" },
  { href: "/tests?search=annual%20checkup", label: "Annual Checkup" },
  { href: "/tests?search=heart%20lipid", label: "Heart Health" },
  { href: "/tests?search=thyroid", label: "Thyroid" },
  { href: "/tests?search=diabetes", label: "Diabetes Screening" },
  { href: "/tests?search=std", label: "STD Testing" },
  { href: "/tests?search=drug", label: "Drug Testing" },
];

const companyLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/#state-availability", label: "State Availability" },
  { href: "/lab-partners", label: "CLIA-Certified Lab Partners" },
  { href: "/find-lab-center", label: "Find a Draw Center" },
  { href: "/help-center", label: "Help Center" },
  { href: "/support", label: "Contact Support" },
];

const legalLinks = [
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/hipaa-notice", label: "HIPAA Privacy Notice" },
  { href: "/#result-disclaimer", label: "Test Result Disclaimer" },
  { href: "/#not-for-emergency-use", label: "Not for Emergency Use" },
  { href: "/accessibility", label: "Accessibility" },
];

export function SiteFooter({
  showDeveloperCredit = false,
}: {
  showDeveloperCredit?: boolean;
}) {
  return (
    <>
      {/* Compliance Info */}
      <section className='bg-white dark:bg-slate-950'>
        <div className='container mx-auto px-4 pb-10 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
          <div className='border-t border-slate-200 pt-6 dark:border-slate-800'>
            <p className='mb-4 text-xs leading-6 text-slate-500'>
              <strong className='text-slate-600 dark:text-slate-400'>
                Important Notice:
              </strong>{" "}
              EzLabTesting is an online lab test ordering and result access
              platform. Laboratory testing and sample collection are performed
              by independent authorized partner laboratories. Availability,
              ordering rules, partner locations, and turnaround times may vary
              by state, ZIP code, test type, and lab partner. EzLabTesting does
              not provide emergency care. If you are experiencing a medical
              emergency, call 911 immediately.
            </p>
            <p className='text-xs leading-6 text-slate-500'>
              <strong className='text-slate-600 dark:text-slate-400'>
                Physician Services:
              </strong>{" "}
              Every order placed through EzLabTesting is reviewed and approved
              by an independent licensed physician or healthcare provider before
              lab fulfillment. Test results should be shared with your primary
              care physician. Our services comply with CLIA (Clinical Laboratory
              Improvement Amendments) regulations. All partner laboratories are
              CLIA-certified and meet federal quality standards for laboratory
              testing.
            </p>
          </div>
        </div>
      </section>

      <footer className='bg-slate-950 text-slate-300'>
        <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
          {/* Main Content */}
          <div className='grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4'>
            {/* About Section */}
            <div className='lg:col-span-1'>
              <Link href='/' className='mb-6 inline-flex items-center gap-2'>
                <div className='relative h-8 w-8 overflow-hidden rounded-lg'>
                  <Image
                    src='/images/logo.svg'
                    alt='EzLabTesting'
                    fill
                    className='object-contain'
                    unoptimized
                  />
                </div>
                <span className='text-base font-bold text-white'>
                  EzLabTesting
                </span>
              </Link>
              <p className='mb-4 text-sm leading-relaxed text-slate-400'>
                Online lab test ordering and result access platform. Laboratory
                testing and sample collection are performed by independent
                authorized partner laboratories.
              </p>
              {/* Trust Badges */}
              <div className='flex flex-wrap gap-2'>
                <div className='inline-flex items-center gap-1.5 rounded bg-slate-900 px-2 py-1 text-xs text-slate-400'>
                  <Shield className='h-3 w-3 text-emerald-500' />
                  <span>HIPAA Compliant</span>
                </div>
                <div className='inline-flex items-center gap-1.5 rounded bg-slate-900 px-2 py-1 text-xs text-slate-400'>
                  <Stethoscope className='h-3 w-3 text-sky-500' />
                  <span>CLIA Certified</span>
                </div>
              </div>
            </div>

            {/* Tests Section */}
            <div>
              <h4 className='mb-6 text-xs font-bold uppercase tracking-widest text-white'>
                Tests
              </h4>
              <ul className='space-y-3'>
                {testsLinks.map((link) => (
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

            {/* Company Section */}
            <div>
              <h4 className='mb-6 text-xs font-bold uppercase tracking-widest text-white'>
                Company
              </h4>
              <ul className='space-y-3'>
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

            {/* Contact Section */}
            <div>
              <h4 className='mb-6 text-xs font-bold uppercase tracking-widest text-white'>
                Contact
              </h4>
              <ul className='space-y-4'>
                <li>
                  <a
                    href='mailto:support@ezlabtesting.com'
                    className='flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-sky-400'
                  >
                    <Mail className='h-4 w-4 shrink-0' />
                    <span>support@ezlabtesting.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href='tel:18003952227'
                    className='flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-sky-400'
                  >
                    <Phone className='h-4 w-4 shrink-0' />
                    <span>1-800-EZ-LABS</span>
                  </a>
                </li>
                <li className='flex items-start gap-3'>
                  <Clock className='mt-0.5 h-4 w-4 shrink-0 text-slate-500' />
                  <div className='text-xs leading-relaxed text-slate-500'>
                    <p className='text-slate-300'>Mon-Fri 8am-8pm EST</p>
                    <p className='text-slate-600'>Sat-Sun 9am-5pm EST</p>
                    <p className='text-slate-600'>
                      Availability varies by location
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className='border-t border-slate-800' />

          <div className='py-8'>
            {/* Legal Links - Improved Mobile Layout */}
            <div className='mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4'>
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className='text-xs text-slate-500 transition-colors hover:text-slate-300'
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className='max-w-4xl text-xs leading-6 text-slate-500'>
              EzLabTesting does not provide medical advice, diagnosis, or
              treatment. Availability, ordering rules, and physician review
              requirements vary by state, ZIP code, test type, and lab partner.
            </p>
          </div>

          {/* Footer Bottom */}
          <div className='border-t border-slate-800 py-6'>
            <div className='flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p>
                  &copy; {new Date().getFullYear()} EzLabTesting. All rights
                  reserved.
                </p>
              </div>

              {showDeveloperCredit && (
                <div>
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
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
