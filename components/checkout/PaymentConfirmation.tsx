"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Download,
  Mail,
  Share2,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";

interface PaymentConfirmationProps {
  orderId: string;
  amount: number;
  date: string;
  email: string;
  tests: Array<{ name: string; price: number }>;
  paymentMethod:
    | "card"
    | "link"
    | "paypal"
    | "google_pay"
    | "apple_pay"
    | "crypto";
  last4?: string;
}

export function PaymentConfirmation({
  orderId,
  amount,
  date,
  email,
  tests,
  paymentMethod,
  last4,
}: PaymentConfirmationProps) {
  const paymentMethodLabel =
    paymentMethod === "card"
      ? "Card"
      : paymentMethod === "link"
        ? "Link"
        : paymentMethod === "paypal"
          ? "PayPal"
          : paymentMethod === "google_pay"
            ? "Google Pay"
            : paymentMethod === "apple_pay"
              ? "Apple Pay"
              : "Crypto";

  return (
    <div className='max-w-3xl mx-auto'>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className='flex justify-center mb-8'
      >
        <div className='relative'>
          <div className='absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-30 animate-pulse' />
          <div className='relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-6'>
            <img
              src='/images/mx-merchant-logo.png'
              alt='Mx Merchant'
              className='h-12 w-auto mx-auto mb-2'
            />
            <CheckCircle2 className='h-16 w-16 text-white mx-auto' />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='text-center mb-8'
      >
        <h1 className='text-4xl font-bold mb-2 text-blue-700'>
          Payment Successful!
        </h1>
        <p className='text-muted-foreground text-lg'>
          Your payment was securely processed by Mx Merchant.
          <br />
          Order confirmed and receipt sent to your email.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className='mb-6 overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-6 border-b'>
            <div className='flex justify-between items-center'>
              <div>
                <p className='text-sm text-muted-foreground'>Order Number</p>
                <p className='text-2xl font-bold'>{orderId}</p>
              </div>
              <div className='text-right'>
                <p className='text-sm text-muted-foreground'>Total Charged</p>
                <p className='text-3xl font-bold text-blue-600'>
                  {formatCurrency(amount)}
                </p>
              </div>
            </div>
          </div>
          <CardContent className='p-6 space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>
                  Payment Method
                </p>
                <p className='font-semibold flex items-center gap-2'>
                  <img
                    src='/images/mx-merchant-logo.png'
                    alt='Mx Merchant'
                    className='h-5 w-auto'
                  />
                  {paymentMethodLabel}
                  {last4 && ` •••• ${last4}`}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>
                  Transaction Date
                </p>
                <p className='font-semibold'>
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className='pt-4 border-t'>
              <p className='text-sm text-muted-foreground mb-3'>
                Confirmation sent to
              </p>
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4 text-muted-foreground' />
                <p className='font-semibold'>{email}</p>
              </div>
            </div>

            <div className='pt-4 border-t'>
              <p className='text-sm text-muted-foreground mb-3'>
                Tests Ordered
              </p>
              <div className='space-y-2'>
                {tests.map((test, index) => (
                  <div
                    key={index}
                    className='flex justify-between items-center p-3 bg-muted/50 rounded-lg'
                  >
                    <span className='font-medium'>{test.name}</span>
                    <span className='font-semibold'>
                      {formatCurrency(test.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className='pt-4 border-t'>
              <div className='flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border mt-2'>
                <div className='flex items-center gap-2'>
                  <ShieldCheckIcon className='h-6 w-6 text-blue-600' />
                  <span className='text-sm font-medium text-blue-700'>
                    Your payment is protected by{" "}
                    <span className='font-bold'>PCI DSS</span> &{" "}
                    <span className='font-bold'>SSL encryption</span>
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <img
                    src='/images/pci-dss-badge.png'
                    alt='PCI DSS Compliant'
                    className='h-6 w-auto'
                  />
                  <img
                    src='/images/ssl-badge.png'
                    alt='SSL Secured'
                    className='h-6 w-auto'
                  />
                </div>
              </div>
              <div className='text-center mt-4'>
                <p className='text-xs text-muted-foreground'>
                  For questions about your payment, contact{" "}
                  <a
                    href='mailto:support@ezlabtesting.com'
                    className='underline'
                  >
                    support@ezlabtesting.com
                  </a>
                  <br />
                  <span className='block mt-2 text-blue-700 font-semibold'>
                    Thank you for trusting EzLabTesting and Mx Merchant for your
                    secure payment!
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className='bg-blue-50 dark:bg-blue-950 rounded-lg p-6 mb-6'
      >
        <div className='flex items-start gap-3'>
          <Calendar className='h-5 w-5 text-blue-600 mt-0.5' />
          <div>
            <h3 className='font-semibold text-blue-900 dark:text-blue-100 mb-1'>
              Next Steps
            </h3>
            <ul className='text-sm text-blue-800 dark:text-blue-200 space-y-1'>
              <li>• Visit a nearby lab within 7 days to provide your sample</li>
              <li>• Bring your order confirmation and a valid ID</li>
              <li>
                • Results will be available in your dashboard in 24-48 hours
              </li>
              <li>• You&apos;ll receive an email notification when ready</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className='grid grid-cols-1 sm:grid-cols-3 gap-4'
      >
        <Button className='gap-2' variant='outline'>
          <Download className='h-4 w-4' />
          Download Receipt
        </Button>
        <Button className='gap-2' variant='outline'>
          <Share2 className='h-4 w-4' />
          Share Details
        </Button>
        <Button asChild className='gap-2'>
          <Link href='/results'>View Dashboard</Link>
        </Button>
      </motion.div>
    </div>
  );
}
