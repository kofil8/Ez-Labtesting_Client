"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import {
  getOrdersByUserId,
  UserOrderSummary,
} from "@/lib/services/order.service";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { ChevronRight, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function RecentOrdersCard() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<UserOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id || !isAuthenticated) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getOrdersByUserId(user.id);
        setOrders(data.slice(0, 3));
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthLoading) {
      loadOrders();
    }
  }, [user, isAuthLoading, isAuthenticated]);

  const getStatusColor = (status: string) => {
    const normalized = status.toUpperCase();

    switch (normalized) {
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "LAB_ORDER_PLACED":
      case "PAID":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "PENDING_PAYMENT":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "FAILED":
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const toStatusLabel = (status: string) => {
    const normalized = status.replaceAll("_", " ").toLowerCase();
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <ShoppingBag className='w-5 h-5 text-blue-600' />
            <CardTitle className='text-lg'>Recent Orders</CardTitle>
          </div>
          <span className='text-sm text-muted-foreground'>
            {orders.length} orders
          </span>
        </div>
      </CardHeader>

      <CardContent className='space-y-3'>
        {loading ? (
          <div className='flex items-center justify-center py-6'>
            <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className='flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors'
            >
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium truncate'>
                  Order #{order.id}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {formatDateShort(order.createdAt)} | {formatCurrency(order.total)}
                </p>
              </div>
              <Badge
                variant='outline'
                className={`ml-2 ${getStatusColor(order.status)} text-xs`}
              >
                {toStatusLabel(order.status)}
              </Badge>
            </div>
          ))
        ) : (
          <div className='text-center py-6'>
            <p className='text-sm text-muted-foreground'>No orders yet</p>
          </div>
        )}
      </CardContent>

      <CardFooter className='border-t pt-3'>
        <Button asChild variant='outline' size='sm' className='w-full'>
          <Link
            href='/profile/orders'
            className='flex items-center justify-between'
          >
            View All Orders
            <ChevronRight className='w-4 h-4' />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
