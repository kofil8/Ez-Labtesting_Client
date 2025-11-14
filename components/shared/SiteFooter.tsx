"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Facebook,
  Heart,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Shield,
  Sparkles,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Successfully subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });

    setEmail("");
    setIsSubmitting(false);
  };

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
    { href: "/results", label: "View Results" },
    { href: "/cart", label: "Shopping Cart" },
    { href: "/transactions", label: "Order History" },
  ];

  const supportLinks = [
    { href: "#", label: "Help Center" },
    { href: "#", label: "FAQs" },
    { href: "#", label: "How It Works" },
    { href: "#", label: "Test Preparation" },
  ];

  const legalLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/hipaa", label: "HIPAA Notice" },
    { href: "#", label: "Accessibility" },
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
    <footer className='relative border-t bg-white dark:bg-gray-950'>
      {/* Subtle background gradients - Awsmd style */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none opacity-20'>
        <div className='absolute top-0 left-1/4 w-96 h-96 awsmd-gradient-purple-pink rounded-full blur-3xl' />
        <div className='absolute bottom-0 right-1/4 w-96 h-96 awsmd-gradient-blue-purple rounded-full blur-3xl' />
      </div>

      <div className='relative container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Newsletter Section - Awsmd style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='py-16 border-b border-gray-200 dark:border-gray-800'
        >
          <div className='max-w-4xl mx-auto text-center'>
            <div className='inline-flex items-center gap-2 px-6 py-3 awsmd-rounded bg-white dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-sm font-bold mb-6 shadow-lg'>
              <Sparkles className='h-5 w-5 animate-pulse' />
              <span>Stay Updated</span>
            </div>
            <h3 className='text-3xl mb-6 text-gradient-cosmic text-center text-4xl mb-8'>
              <span className='awsmd-gradient-text'>Subscribe</span>
              <span className='text-gray-900 dark:text-white'>
                {" "}
                to Our Newsletter
              </span>
            </h3>

            <p className='text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed'>
              Get exclusive health tips, special offers, and the latest updates
              delivered to your inbox.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className='flex flex-col sm:flex-row gap-4 max-w-lg mx-auto'
            >
              <div className='relative flex-1'>
                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <Input
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='pl-12 h-14 awsmd-rounded bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 focus:border-purple-500 text-base font-medium'
                />
              </div>
              <Button
                type='submit'
                size='lg'
                disabled={isSubmitting}
                className='h-14 px-8 awsmd-gradient-cosmic text-white hover:opacity-90 transition-all shadow-xl hover:shadow-2xl awsmd-rounded font-bold button-shine'
              >
                {isSubmitting ? (
                  "Subscribing..."
                ) : (
                  <>
                    Subscribe
                    <Send className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform' />
                  </>
                )}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          className='py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8'
        >
          {/* Company Info - Awsmd style */}
          <motion.div variants={itemVariants} className='lg:col-span-2'>
            <Link href='/' className='inline-flex items-center gap-3 mb-6'>
              <div className='w-14 h-14 awsmd-rounded awsmd-gradient-cosmic flex items-center justify-center shadow-xl'>
                <img
                  className='w-full h-full object-cover'
                  src='/images/logo.png'
                  alt='EZ Lab Testing'
                />
              </div>
              <span className='text-3xl font-black awsmd-gradient-text'>
                EZ Lab Testing
              </span>
            </Link>
            <p className='text-gray-600 dark:text-gray-300 mb-8 max-w-sm text-base leading-relaxed'>
              We would love to hear from you. Empowering you to take control of
              your health with direct-to-consumer lab testing. HIPAA-secure,
              CLIA-certified, and trusted by thousands.
            </p>

            {/* Trust Badges - Awsmd style */}
            <div className='flex flex-wrap gap-3 mb-8'>
              <div className='flex items-center gap-2 px-4 py-3 awsmd-rounded awsmd-glass-card border-2 border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform'>
                <Shield className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                <span className='text-sm font-bold'>HIPAA Secure</span>
              </div>
              <div className='flex items-center gap-2 px-4 py-3 awsmd-rounded awsmd-glass-card border-2 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform'>
                <Award className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                <span className='text-sm font-bold'>CLIA Certified</span>
              </div>
            </div>

            {/* Social Links - Awsmd style */}
            <div className='flex gap-4'>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-12 h-12 awsmd-rounded awsmd-glass-card border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-2 ${social.color} hover:border-current shadow-lg hover:shadow-xl`}
                >
                  <social.icon className='h-6 w-6' />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className='font-black text-xl mb-6 text-gray-900 dark:text-white'>
              Quick Links
            </h3>
            <ul className='space-y-3'>
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group'
                  >
                    <ArrowRight className='h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all' />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h3 className='font-black text-xl mb-6 text-gray-900 dark:text-white'>
              Support
            </h3>
            <ul className='space-y-3'>
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group'
                  >
                    <ArrowRight className='h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all' />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Legal */}
          <motion.div variants={itemVariants}>
            <h3 className='font-black text-xl mb-6 text-gray-900 dark:text-white'>
              Legal
            </h3>
            <ul className='space-y-3 mb-6'>
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group'
                  >
                    <ArrowRight className='h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all' />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className='space-y-3 text-sm'>
              <a
                href='mailto:support@kevinlab.com'
                className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors'
              >
                <Mail className='h-4 w-4' />
                support@kevinlab.com
              </a>
              <a
                href='tel:1-800-LAB-TEST'
                className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors'
              >
                <Phone className='h-4 w-4' />
                1-800-LAB-TEST
              </a>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <MapPin className='h-4 w-4' />
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
          className='py-6 border-t border-slate-200 dark:border-slate-800'
        >
          <div className='flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground'>
            <p>
              &copy; {new Date().getFullYear()} EZ Lab Testing. All rights
              reserved.
            </p>
            <div className='flex items-center gap-4'>
              <span className='hidden sm:inline'>Made with</span>
              <Heart className='h-4 w-4 text-red-500 animate-pulse' />
              <span className='hidden sm:inline'>for your health</span>
            </div>
            <p className='text-xs'>
              CLIA-certified laboratories • HIPAA-compliant • Available 24/7
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
