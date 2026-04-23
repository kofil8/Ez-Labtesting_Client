"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CreditCard,
  XCircle,
} from "lucide-react";

interface Transaction {
  id: string;
  type: "payment" | "refund";
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
  paymentMethod?:
    | "card"
    | "link"
    | "paypal"
    | "google_pay"
    | "apple_pay"
    | "crypto";
  last4?: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  index?: number;
}

const STATUS_CONFIG = {
  completed: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  pending: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
  },
  failed: {
    icon: XCircle,
    color: "text-rose-600",
    bg: "bg-rose-50",
    badge: "border-rose-200 bg-rose-50 text-rose-700",
  },
} as const;

function getPaymentMethodLabel(method?: Transaction["paymentMethod"]) {
  if (method === "card") return "Card";
  if (method === "link") return "Link";
  if (method === "paypal") return "PayPal";
  if (method === "google_pay") return "Google Pay";
  if (method === "apple_pay") return "Apple Pay";
  if (method === "crypto") return "Crypto";
  return "Payment";
}

export function TransactionCard({
  transaction,
  index = 0,
}: TransactionCardProps) {
  const config = STATUS_CONFIG[transaction.status];
  const StatusIcon = config.icon;
  const isPayment = transaction.type === "payment";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Card className='rounded-[24px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)] transition-all hover:border-slate-300 hover:shadow-[0_24px_60px_-38px_rgba(15,23,42,0.38)]'>
        <CardContent className='p-5'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
            <div className='flex items-start gap-4'>
              <div className={cn("rounded-2xl p-3", config.bg)}>
                {isPayment ? (
                  <ArrowUpRight className={cn("h-5 w-5", config.color)} />
                ) : (
                  <ArrowDownRight className='h-5 w-5 text-emerald-600' />
                )}
              </div>

              <div className='space-y-2'>
                <div className='flex flex-wrap items-center gap-2'>
                  <h3 className='text-sm font-semibold text-slate-950 sm:text-base'>
                    {transaction.description}
                  </h3>
                  <Badge
                    variant='outline'
                    className={cn("rounded-full border text-xs", config.badge)}
                  >
                    <StatusIcon className='mr-1 h-3.5 w-3.5' />
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
                  </Badge>
                </div>

                <p className='text-sm text-slate-600'>
                  {new Date(transaction.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <div className='flex flex-wrap items-center gap-2 text-xs text-slate-500'>
                  <span className='inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1'>
                    <CreditCard className='h-3.5 w-3.5' />
                    {getPaymentMethodLabel(transaction.paymentMethod)}
                    {transaction.last4 ? ` •••• ${transaction.last4}` : ""}
                  </span>
                  <span className='rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1'>
                    {transaction.id}
                  </span>
                </div>
              </div>
            </div>

            <div className='text-left sm:text-right'>
              <p
                className={cn(
                  "text-lg font-semibold",
                  isPayment ? "text-slate-950" : "text-emerald-700",
                )}
              >
                {isPayment ? "-" : "+"}
                {formatCurrency(transaction.amount)}
              </p>
              <p className='mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                {isPayment ? "Payment" : "Refund"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
