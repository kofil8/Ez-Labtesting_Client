'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowDownRight, ArrowUpRight, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Transaction {
  id: string
  type: 'payment' | 'refund'
  amount: number
  status: 'completed' | 'pending' | 'failed'
  date: string
  description: string
  paymentMethod?: 'card' | 'ach'
  last4?: string
}

interface TransactionCardProps {
  transaction: Transaction
  index?: number
}

export function TransactionCard({ transaction, index = 0 }: TransactionCardProps) {
  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950',
      badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    },
    pending: {
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 dark:bg-yellow-950',
      badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    },
    failed: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-950',
      badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
  }

  const config = statusConfig[transaction.status]
  const Icon = config.icon
  const isPayment = transaction.type === 'payment'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-all cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={cn(config.bg, "p-3 rounded-full")}>
                {isPayment ? (
                  <ArrowUpRight className={cn(config.color, "h-5 w-5")} />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-blue-600" />
                )}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {transaction.description}
                  </h3>
                  <Icon className={cn(config.color, "h-4 w-4")} />
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                
                {transaction.paymentMethod && transaction.last4 && (
                  <p className="text-xs text-muted-foreground">
                    {transaction.paymentMethod === 'card' ? 'Card' : 'Bank Account'} ending in {transaction.last4}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right space-y-2">
              <p className={cn(
                "text-lg font-bold",
                isPayment ? "text-red-600" : "text-green-600"
              )}>
                {isPayment ? '-' : '+'}{formatCurrency(transaction.amount)}
              </p>
              <Badge className={config.badge}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
            <span>Transaction ID: {transaction.id}</span>
            <span className="group-hover:text-primary transition-colors cursor-pointer">
              View Details →
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

