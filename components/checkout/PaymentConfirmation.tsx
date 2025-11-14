'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Download, Mail, Share2, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

interface PaymentConfirmationProps {
  orderId: string
  amount: number
  date: string
  email: string
  tests: Array<{ name: string; price: number }>
  paymentMethod: 'card' | 'ach'
  last4?: string
}

export function PaymentConfirmation({
  orderId,
  amount,
  date,
  email,
  tests,
  paymentMethod,
  last4
}: PaymentConfirmationProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex justify-center mb-8"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-30 animate-pulse" />
          <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full p-6">
            <CheckCircle2 className="h-16 w-16 text-white" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground text-lg">
          Your order has been confirmed and is being processed
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="text-2xl font-bold">{orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(amount)}</p>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                <p className="font-semibold">
                  {paymentMethod === 'card' ? 'Credit Card' : 'ACH Bank Transfer'}
                  {last4 && ` •••• ${last4}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transaction Date</p>
                <p className="font-semibold">
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">Confirmation sent to</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="font-semibold">{email}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">Tests Ordered</p>
              <div className="space-y-2">
                {tests.map((test, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">{test.name}</span>
                    <span className="font-semibold">{formatCurrency(test.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 mb-6"
      >
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Next Steps
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Visit a nearby lab within 7 days to provide your sample</li>
              <li>• Bring your order confirmation and a valid ID</li>
              <li>• Results will be available in your dashboard in 24-48 hours</li>
              <li>• You'll receive an email notification when ready</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Button className="gap-2" variant="outline">
          <Download className="h-4 w-4" />
          Download Receipt
        </Button>
        <Button className="gap-2" variant="outline">
          <Share2 className="h-4 w-4" />
          Share Details
        </Button>
        <Button asChild className="gap-2">
          <Link href="/results">
            View Dashboard
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}

