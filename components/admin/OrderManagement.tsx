"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hook/use-toast";
import {
  getAllOrders,
  retryOrderAccessPlacement,
} from "@/lib/services/order.service";
import { subscribeToManualReviewQueueUpdates } from "@/lib/services/notifications.socket";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types/order";
import { Eye, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { OrderDetailDialog } from "./OrderDetailDialog";

const REVIEW_STATUSES = new Set([
  "LAB_SUBMISSION_FAILED",
  "MANUAL_REVIEW_REQUIRED",
]);

function formatStatusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function OrderManagement() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [requeueingOrderId, setRequeueingOrderId] = useState<string | null>(
    null,
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const ordersData = await getAllOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast({
        title: "Error",
        description: "Unable to load orders. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, [loadData]);

  useEffect(() => {
    const unsubscribe = subscribeToManualReviewQueueUpdates(() => {
      void loadData();
    });

    return unsubscribe;
  }, [loadData]);

  const statusOptions = useMemo(() => {
    return Array.from(new Set(orders.map((order) => order.status))).sort();
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (order) => String(order.status) === statusFilter,
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          (order.orderNumber || "").toLowerCase().includes(query) ||
          order.customerInfo.email.toLowerCase().includes(query) ||
          order.customerInfo.firstName.toLowerCase().includes(query) ||
          order.customerInfo.lastName.toLowerCase().includes(query) ||
          order.customerInfo.phone.toLowerCase().includes(query) ||
          `${order.customerInfo.firstName} ${order.customerInfo.lastName}`
            .toLowerCase()
            .includes(query)
      );
    }

    return filtered;
  }, [searchQuery, statusFilter, orders]);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleSave = async (order: Order) => {
    setOrders(orders.map((o) => (o.id === order.id ? order : o)));
    toast({
      title: "Order updated",
      description: `Order ${order.id} has been updated in this view.`,
    });
    setIsDialogOpen(false);
  };

  const handleRequeue = async (orderId: string) => {
    try {
      setRequeueingOrderId(orderId);
      await retryOrderAccessPlacement(orderId);
      await loadData();
      toast({
        title: "Lab submission requeued",
        description: `Order ${orderId} is back in the lab submission queue.`,
      });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Requeue failed",
        description: error?.message || "Unable to requeue this order.",
        variant: "destructive",
      });
    } finally {
      setRequeueingOrderId(null);
    }
  };

  const getStatusBadge = (
    status: Order["status"],
    manualReviewRequired?: boolean,
  ) => {
    const normalizedStatus = String(status);
    const variants: Record<string, string> = {
      PENDING_PAYMENT: "bg-yellow-500",
      PAYMENT_FAILED: "bg-red-500",
      AWAITING_USER_CONFIRMATION: "bg-yellow-500",
      READY_FOR_LAB_SUBMISSION: "bg-blue-500",
      LAB_SUBMISSION_IN_PROGRESS: "bg-blue-500",
      LAB_SUBMISSION_FAILED: "bg-red-500",
      MANUAL_REVIEW_REQUIRED: "bg-amber-600",
      SUBMITTED_TO_LAB: "bg-blue-500",
      REQUISITION_READY: "bg-green-500",
      COMPLETED: "bg-green-500",
      CANCELLED: "bg-red-500",
      pending: "bg-yellow-500",
      processing: "bg-blue-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return (
      <Badge className={variants[normalizedStatus] || "bg-gray-500"}>
        {manualReviewRequired
          ? "Manual Review"
          : formatStatusLabel(normalizedStatus)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className='text-center py-12'>Loading orders...</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Order Management</h2>
          <p className='text-muted-foreground'>
            View and manage customer orders
          </p>
        </div>
      </div>

      <Card>
        <CardContent className='p-4'>
          <div className='flex items-center space-x-2 mb-4 gap-4'>
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search orders by ID, customer name, or email...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-8'
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {formatStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant='outline' size='icon' onClick={loadData}>
              <RefreshCw className='h-4 w-4' />
            </Button>
          </div>
        </CardContent>
        <CardContent className='p-0 pb-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className='text-center py-8'>
                    <p className='text-muted-foreground'>
                      {searchQuery || statusFilter !== "all"
                        ? "No orders found matching your filters."
                        : "No orders found."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <span className='font-mono text-sm'>{order.id}</span>
                      {order.orderNumber && (
                        <p className='text-xs text-muted-foreground'>
                          {order.orderNumber}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className='font-medium'>
                          {order.customerInfo.firstName}{" "}
                          {order.customerInfo.lastName}
                        </span>
                        <p className='text-xs text-muted-foreground'>
                          {order.customerInfo.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className='text-sm'>
                        {order.itemCount ?? order.tests.length} test
                        {(order.itemCount ?? order.tests.length) !== 1
                          ? "s"
                          : ""}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className='font-semibold'>
                        {formatCurrency(order.totalAmount)}
                      </span>
                      {order.discount && order.discount > 0 && (
                        <p className='text-xs text-muted-foreground'>
                          Discount: {formatCurrency(order.discount)}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-wrap gap-2'>
                        {getStatusBadge(
                          order.status,
                          order.manualReviewRequired,
                        )}
                        {REVIEW_STATUSES.has(String(order.status)) && (
                          <Badge variant='outline'>Needs action</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>
                        {(order.paymentStatus || order.paymentMethod).toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className='text-sm text-muted-foreground'>
                        {formatDate(order.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-end gap-2'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleView(order)}
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OrderDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        order={selectedOrder}
        onSave={handleSave}
        onRequeue={handleRequeue}
        isRequeueing={selectedOrder?.id === requeueingOrderId}
      />
    </div>
  );
}
