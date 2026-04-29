"use client";

import {
  Transaction,
  TransactionHistory,
} from "@/components/transaction/TransactionHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import {
  getOrdersByUserId,
  UserOrderSummary,
} from "@/lib/services/order.service";
import { AlertCircle, Loader2, Receipt } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function mapOrderToTransaction(order: UserOrderSummary): Transaction {
  const normalizedStatus = (order.status || "").toUpperCase();

  const isRefund =
    normalizedStatus === "REFUNDED" || normalizedStatus === "REFUND_PENDING";

  const status: Transaction["status"] =
    normalizedStatus === "FAILED" ||
    normalizedStatus === "CANCELLED" ||
    normalizedStatus === "LAB_SUBMISSION_FAILED_FINAL"
      ? "failed"
      : normalizedStatus === "PENDING_PAYMENT" ||
          normalizedStatus === "LAB_SUBMISSION_PENDING" ||
          normalizedStatus === "LAB_SUBMISSION_RETRYING" ||
          normalizedStatus === "MANUAL_REVIEW" ||
          normalizedStatus === "REFUND_PENDING"
        ? "pending"
        : "completed";

  const orderNumber =
    order.orderNumber || `ORD-${order.id.slice(0, 8).toUpperCase()}`;

  return {
    id: order.id,
    type: isRefund ? "refund" : "payment",
    amount: Number(order.total || 0),
    status,
    date: order.updatedAt || order.createdAt,
    description: isRefund
      ? `Refund for ${orderNumber}`
      : `Payment for ${orderNumber}`,
    paymentMethod: "card",
    last4: "••••",
  };
}

export function CustomerTransactionHistory() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<UserOrderSummary[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id || !isAuthenticated) {
        setOrders([]);
        return;
      }

      setIsLoadingOrders(true);
      setError(null);

      try {
        const result = await getOrdersByUserId(user.id);
        setOrders(result);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load transaction history.",
        );
      } finally {
        setIsLoadingOrders(false);
      }
    };

    if (!isAuthLoading) {
      loadOrders();
    }
  }, [isAuthenticated, isAuthLoading, user?.id]);

  const transactions = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime(),
        )
        .map(mapOrderToTransaction),
    [orders],
  );

  if (isAuthLoading || isLoadingOrders) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-28 w-full rounded-xl' />
        <Skeleton className='h-24 w-full rounded-xl' />
        <Skeleton className='h-40 w-full rounded-xl' />
      </div>
    );
  }

  if (!isAuthenticated || !user?.id) {
    return (
      <Card className='border-slate-200'>
        <CardContent className='pt-8 pb-8 text-center'>
          <AlertCircle className='h-10 w-10 mx-auto text-slate-400 mb-3' />
          <h2 className='text-xl font-semibold text-slate-900'>
            Sign in required
          </h2>
          <p className='text-slate-600 mt-2 mb-5'>
            Please sign in to view your transaction history.
          </p>
          <Button asChild>
            <Link href='/login?from=/dashboard/customer/transactions'>
              Go to Sign In
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='border-rose-200 bg-rose-50/40'>
        <CardContent className='pt-6 pb-6'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h2 className='text-lg font-semibold text-rose-700'>
                Unable to load transactions
              </h2>
              <p className='mt-1 text-sm text-rose-700/90'>{error}</p>
            </div>
            <Button
              variant='outline'
              onClick={() => window.location.reload()}
              className='shrink-0'
            >
              <Loader2 className='h-4 w-4 mr-2' />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className='border-sky-200 bg-sky-50/30'>
        <CardContent className='pt-10 pb-10 text-center'>
          <Receipt className='h-14 w-14 mx-auto text-slate-400 mb-4' />
          <h2 className='text-2xl font-semibold text-slate-900'>
            No transactions yet
          </h2>
          <p className='text-slate-600 mt-2 mb-6'>
            Once you place an order, your payment and refund records will appear
            here.
          </p>
          <Button asChild size='lg'>
            <Link href='/tests'>Browse Tests</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <TransactionHistory transactions={transactions} />;
}
