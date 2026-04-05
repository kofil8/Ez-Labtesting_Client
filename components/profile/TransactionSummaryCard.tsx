"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ChevronRight, Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  type: "payment" | "refund";
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
}

export function TransactionSummaryCard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading transactions - in real app, fetch from API
    const loadTransactions = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call to fetch user transactions
        // const data = await getTransactions()
        // setTransactions(data)

        // For now, use mock data
        setTransactions([
          {
            id: "1",
            type: "payment",
            amount: 99.99,
            status: "completed",
            date: new Date().toISOString(),
          },
          {
            id: "2",
            type: "payment",
            amount: 149.99,
            status: "completed",
            date: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "3",
            type: "refund",
            amount: 50,
            status: "completed",
            date: new Date(Date.now() - 172800000).toISOString(),
          },
        ]);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const completedCount = transactions.filter(
    (t) => t.status === "completed",
  ).length;
  const totalAmount = transactions.reduce((sum, t) => {
    return t.type === "payment" ? sum - t.amount : sum + t.amount;
  }, 0);

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <TrendingUp className='w-5 h-5 text-green-600' />
            <CardTitle className='text-lg'>Transactions</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {loading ? (
          <div className='flex items-center justify-center py-6'>
            <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <>
            <div className='grid grid-cols-2 gap-3'>
              <div className='p-3 rounded-lg bg-green-50 border border-green-200'>
                <p className='text-xs text-muted-foreground'>Completed</p>
                <p className='text-lg font-semibold text-green-700 mt-1'>
                  {completedCount}
                </p>
              </div>
              <div className='p-3 rounded-lg bg-blue-50 border border-blue-200'>
                <p className='text-xs text-muted-foreground'>Net Amount</p>
                <p className='text-lg font-semibold text-blue-700 mt-1'>
                  {formatCurrency(Math.abs(totalAmount))}
                </p>
              </div>
            </div>
            <p className='text-xs text-muted-foreground text-center'>
              Total transactions: {transactions.length}
            </p>
          </>
        )}
      </CardContent>

      <CardFooter className='border-t pt-3'>
        <Button asChild variant='outline' size='sm' className='w-full'>
          <Link
            href='/profile/transactions'
            className='flex items-center justify-between'
          >
            View History
            <ChevronRight className='w-4 h-4' />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
