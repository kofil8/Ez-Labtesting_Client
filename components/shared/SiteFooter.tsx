"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Shield,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  const socialLinks = [
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      color: "hover:text-blue-600",
    },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-500" },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      color: "hover:text-pink-600",
    },
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn",
      color: "hover:text-blue-700",
    },
  ];

  const quickLinks = [
    { href: "/tests", label: "Browse Tests" },
    { href: "/find-lab-center", label: "Find a Lab Center" },
    { href: "/results", label: "View Results" },
    { href: "/cart", label: "Shopping Cart" },
    { href: "/transactions", label: "Order History" },
  ];

  const supportLinks = [
    { href: "/help-center", label: "Help Center" },
    { href: "/faqs", label: "FAQs" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/test-preparation", label: "Test Preparation" },
  ];

  const legalLinks = [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
    { href: "/hipaa-notice", label: "HIPAA Notice" },
    { href: "/accessibility", label: "Accessibility" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className='relative border-t-2 border-blue-100 dark:border-cyan-900/40 bg-gradient-to-br from-cyan-50/50 via-blue-50/30 to-teal-50/50 dark:from-slate-950 dark:via-cyan-950/20 dark:to-slate-950'>
      {/* Subtle medical gradient background blobs */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none opacity-15 dark:opacity-10'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl animate-blob' />
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-blob animation-delay-2000' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/30 rounded-full blur-3xl animate-blob animation-delay-4000' />
      </div>

      <div className='relative container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          className='py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 bg-gradient-to-br from-cyan-100/50 via-blue-100/40 to-teal-100/50 dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-teal-950/20'
        >
          {/* Company Info - Awsmd style */}
          <motion.div
            variants={itemVariants}
            className='sm:col-span-2 lg:col-span-2 p-6 sm:p-8'
          >
            <Link href='/' className='inline-flex items-center gap-2 mb-4'>
              <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-xl gradient-medical flex items-center justify-center shadow-xl'>
                <Image
                  className='w-full h-full object-cover'
                  src='/images/logo.png'
                  alt='Ez LabTesting'
                  width={40}
                  height={40}
                  unoptimized
                />
              </div>
              <span className='text-lg sm:text-xl font-black text-gradient-medical'>
                Ez LabTesting
              </span>
            </Link>
            <p className='text-gray-600 dark:text-gray-300 mb-6 max-w-sm text-xs sm:text-sm leading-relaxed'>
              We would love to hear from you. Empowering you to take control of
              your health with direct-to-consumer lab testing. HIPAA-secure,
              CLIA-certified, and trusted by thousands.
            </p>

            {/* Trust Badges - Medical style */}
            <div className='flex flex-wrap gap-2 mb-6'>
              <div className='flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card border-2 border-cyan-300 dark:border-cyan-700 hover:scale-105 transition-transform bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/50 dark:to-blue-950/50'>
                <Shield className='h-4 w-4 text-cyan-600 dark:text-cyan-400' />
                <span className='text-xs font-bold text-gradient-medical'>
                  HIPAA Secure
                </span>
              </div>
              <div className='flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card border-2 border-emerald-300 dark:border-emerald-700 hover:scale-105 transition-transform bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/50 dark:to-teal-950/50'>
                <Award className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                <span className='text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'>
                  CLIA Certified
                </span>
              </div>
            </div>

            {/* Social Links - Medical style */}
            <div className='flex flex-wrap gap-2 sm:gap-3'>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg glass-card border-2 border-blue-200 dark:border-cyan-800 flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-2 ${social.color} hover:border-current shadow-md hover:shadow-lg`}
                >
                  <social.icon className='h-3 w-3 sm:h-4 sm:w-4' />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className='font-black text-base mb-4 text-gray-900 dark:text-white'>
              Quick Links
            </h3>
            <ul className='space-y-2'>
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group'
                  >
                    <ArrowRight className='h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all' />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h3 className='font-black text-base mb-4 text-gray-900 dark:text-white'>
              Support
            </h3>
            <ul className='space-y-2'>
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group'
                  >
                    <ArrowRight className='h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all' />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Legal */}
          <motion.div variants={itemVariants}>
            <h3 className='font-black text-base mb-4 text-gray-900 dark:text-white'>
              Legal
            </h3>
            <ul className='space-y-2 mb-4'>
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group'
                  >
                    <ArrowRight className='h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all' />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className='space-y-2 text-xs'>
              <a
                href='mailto:support@kevinlab.com'
                className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors'
              >
                <Mail className='h-3 w-3' />
                support@kevinlab.com
              </a>
              <a
                href='tel:1-800-LAB-TEST'
                className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors'
              >
                <Phone className='h-3 w-3' />
                1-800-LAB-TEST
              </a>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <MapPin className='h-3 w-3' />
                Nationwide Coverage
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className='py-4 border-t border-slate-200 dark:border-slate-800'
        >
          <div className='flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground'>
            <p>
              &copy; {new Date().getFullYear()} Ez LabTesting. All rights
              reserved.
            </p>
            <p className='text-[10px]'>
              CLIA-certified laboratories • HIPAA-compliant • Available 24/7
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
