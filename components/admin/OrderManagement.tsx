"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getAllOrders, updateOrder, deleteOrder } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types/order";
import { Eye, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { OrderDetailDialog } from "./OrderDetailDialog";

export function OrderManagement() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const ordersData = await getAllOrders();
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter orders based on search query and status
  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customerInfo.email.toLowerCase().includes(query) ||
          order.customerInfo.firstName.toLowerCase().includes(query) ||
          order.customerInfo.lastName.toLowerCase().includes(query) ||
          order.customerInfo.phone.toLowerCase().includes(query) ||
          `${order.customerInfo.firstName} ${order.customerInfo.lastName}`
            .toLowerCase()
            .includes(query)
      );
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders]);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleDelete = async (order: Order) => {
    if (
      confirm(
        `Are you sure you want to delete order "${order.id}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteOrder(order.id);
        setOrders(orders.filter((o) => o.id !== order.id));
        toast({
          title: "Order deleted",
          description: `Order ${order.id} has been removed.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete order.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async (order: Order) => {
    try {
      const updatedOrder = await updateOrder(order.id, order);
      setOrders(orders.map((o) => (o.id === order.id ? updatedOrder : o)));
      toast({
        title: "Order updated",
        description: `Order ${order.id} has been updated.`,
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    const variants = {
      pending: "bg-yellow-500",
      processing: "bg-blue-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return (
      <Badge className={variants[status] || "bg-gray-500"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='processing'>Processing</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='cancelled'>Cancelled</SelectItem>
              </SelectContent>
            </Select>
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
                        {order.tests.length} test
                        {order.tests.length !== 1 ? "s" : ""}
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
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <Badge variant='outline'>
                        {order.paymentMethod.toUpperCase()}
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
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDelete(order)}
                        >
                          <Trash2 className='h-4 w-4 text-destructive' />
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
      />
    </div>
  );
}

