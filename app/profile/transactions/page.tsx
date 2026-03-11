"use client";

import { AccountSidebar } from "@/components/profile/AccountSidebar";
import { TransactionHistory } from "@/components/transaction/TransactionHistory";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function ProfileTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // TODO: Fetch actual transactions from API
    // For now, using mock data
    setTransactions([
      {
        id: "txn-001",
        type: "payment",
        amount: 99.99,
        status: "completed",
        date: new Date().toISOString(),
        description: "Blood Panel Test - Order #ORD-123",
        paymentMethod: "card",
        last4: "4242",
      },
      {
        id: "txn-002",
        type: "payment",
        amount: 149.99,
        status: "completed",
        date: new Date(Date.now() - 86400000).toISOString(),
        description: "Comprehensive Metabolic Test - Order #ORD-122",
        paymentMethod: "card",
        last4: "4242",
      },
      {
        id: "txn-003",
        type: "refund",
        amount: 50,
        status: "completed",
        date: new Date(Date.now() - 172800000).toISOString(),
        description: "Partial Refund - Order #ORD-121",
        paymentMethod: "card",
        last4: "4242",
      },
    ]);
  }, []);

  return (
    <main className='w-full bg-white'>
      <div className='mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10'>
        <div className='mb-6 flex items-center gap-2'>
          <Button asChild variant='ghost' size='sm'>
            <Link href='/profile' className='flex items-center gap-1'>
              <ChevronLeft className='w-4 h-4' />
              Back to Profile
            </Link>
          </Button>
        </div>

        <div className='grid gap-6 md:grid-cols-4'>
          {/* Sidebar */}
          <AccountSidebar />

          {/* Main Content */}
          <div className='md:col-span-3'>
            <div className='space-y-6'>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>
                  Transactions
                </h1>
                <p className='mt-2 text-slate-600'>
                  View your payment and refund history
                </p>
              </div>

              {/* Transaction History */}
              <TransactionHistory transactions={transactions} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
