"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types/order";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSave: (order: Order) => void;
}

export function OrderDetailDialog({
  open,
  onOpenChange,
  order,
  onSave,
}: OrderDetailDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<Order>({
    defaultValues: {
      status: "pending",
      paymentMethod: "card",
    },
  });

  const status = watch("status");
  const totalAmount = watch("totalAmount");
  const subtotal = watch("subtotal");
  const discount = watch("discount");

  useEffect(() => {
    if (order) {
      reset(order);
    }
  }, [order, reset]);

  const onSubmit = (data: Order) => {
    if (!order) return;
    const orderData: Order = {
      ...order,
      ...data,
      updatedAt: new Date().toISOString(),
      completedAt:
        data.status === "completed" && order.status !== "completed"
          ? new Date().toISOString()
          : order.completedAt,
    };
    onSave(orderData);
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto pb-0'>
        <DialogHeader>
          <DialogTitle>Order Details - {order.id}</DialogTitle>
          <DialogDescription>
            View and manage order information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Order Status Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Order Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='status'>Status *</Label>
                <Select
                  value={status}
                  onValueChange={(value: Order["status"]) =>
                    setValue("status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='pending'>Pending</SelectItem>
                    <SelectItem value='processing'>Processing</SelectItem>
                    <SelectItem value='completed'>Completed</SelectItem>
                    <SelectItem value='cancelled'>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='paymentMethod'>Payment Method</Label>
                <Select
                  value={watch("paymentMethod")}
                  onValueChange={(value: "ach" | "card") =>
                    setValue("paymentMethod", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='card'>Card</SelectItem>
                    <SelectItem value='ach'>ACH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Customer Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>First Name</Label>
                <Input
                  value={order.customerInfo.firstName}
                  readOnly
                  className='bg-muted'
                />
              </div>
              <div className='space-y-2'>
                <Label>Last Name</Label>
                <Input
                  value={order.customerInfo.lastName}
                  readOnly
                  className='bg-muted'
                />
              </div>
              <div className='space-y-2'>
                <Label>Email</Label>
                <Input
                  value={order.customerInfo.email}
                  readOnly
                  className='bg-muted'
                />
              </div>
              <div className='space-y-2'>
                <Label>Phone</Label>
                <Input
                  value={order.customerInfo.phone}
                  readOnly
                  className='bg-muted'
                />
              </div>
              <div className='space-y-2'>
                <Label>Date of Birth</Label>
                <Input
                  value={order.customerInfo.dateOfBirth}
                  readOnly
                  className='bg-muted'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Address</Label>
              <Input
                value={`${order.customerInfo.address.street}, ${order.customerInfo.address.city}, ${order.customerInfo.address.state} ${order.customerInfo.address.zipCode}`}
                readOnly
                className='bg-muted'
              />
            </div>
          </div>

          {/* Tests Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Tests</h3>
            <div className='border rounded-lg p-4 space-y-2'>
              {order.tests.map((test, index) => (
                <div
                  key={index}
                  className='flex justify-between items-center p-2 hover:bg-accent rounded'
                >
                  <span className='text-sm font-medium'>{test.testName}</span>
                  <span className='text-sm'>{formatCurrency(test.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Pricing</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='subtotal'>Subtotal</Label>
                <Input
                  id='subtotal'
                  type='number'
                  step='0.01'
                  {...register("subtotal", { valueAsNumber: true })}
                  readOnly
                  className='bg-muted'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='discount'>Discount</Label>
                <Input
                  id='discount'
                  type='number'
                  step='0.01'
                  {...register("discount", { valueAsNumber: true })}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='totalAmount'>Total Amount *</Label>
                <Input
                  id='totalAmount'
                  type='number'
                  step='0.01'
                  {...register("totalAmount", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>
              {order.promoCode && (
                <div className='space-y-2'>
                  <Label>Promo Code</Label>
                  <Input value={order.promoCode} readOnly className='bg-muted' />
                </div>
              )}
            </div>
          </div>

          {/* Dates Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Timeline</h3>
            <div className='grid grid-cols-3 gap-4 text-sm'>
              <div>
                <Label className='text-muted-foreground'>Created</Label>
                <p>
                  {new Date(order.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {order.updatedAt && (
                <div>
                  <Label className='text-muted-foreground'>Last Updated</Label>
                  <p>
                    {new Date(order.updatedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
              {order.completedAt && (
                <div>
                  <Label className='text-muted-foreground'>Completed</Label>
                  <p>
                    {new Date(order.completedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className='pt-4 pb-6'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button type='submit'>Update Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

