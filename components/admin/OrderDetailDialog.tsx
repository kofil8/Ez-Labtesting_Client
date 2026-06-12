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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import {
  adminApproveRefund,
  adminManualReorder,
  adminRequestRefund,
} from "@/lib/services/order.service";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types/order";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSave: (order: Order) => void;
  onRequeue?: (orderId: string) => void | Promise<void>;
  isRequeueing?: boolean;
}

const REVIEW_STATUSES = new Set([
  "LAB_SUBMISSION_FAILED",
  "MANUAL_REVIEW_REQUIRED",
]);

const ORDER_STATUS_OPTIONS: Order["status"][] = [
  "PENDING_PAYMENT",
  "PAYMENT_FAILED",
  "AWAITING_USER_CONFIRMATION",
  "READY_FOR_LAB_SUBMISSION",
  "LAB_SUBMISSION_IN_PROGRESS",
  "LAB_SUBMISSION_FAILED",
  "MANUAL_REVIEW_REQUIRED",
  "SUBMITTED_TO_LAB",
  "REQUISITION_READY",
  "COMPLETED",
  "CANCELLED",
  "pending",
  "processing",
  "completed",
  "cancelled",
];

function formatStatusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function OrderDetailDialog({
  open,
  onOpenChange,
  order,
  onSave,
  onRequeue,
  isRequeueing = false,
}: OrderDetailDialogProps) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const { control, register, handleSubmit, reset, setValue } = useForm<Order>({
    defaultValues: {
      status: "pending",
      paymentMethod: "card",
    },
  });

  const status = useWatch({ control, name: "status" });
  const isManualReviewOrder =
    Boolean(order?.manualReviewRequired) ||
    Boolean(order?.status && REVIEW_STATUSES.has(String(order.status)));

  const isCancelledWithPayment =
    (String(order?.status) === "CANCELLED" ||
      String(order?.status) === "cancelled") &&
    (String(order?.paymentStatus) === "SUCCEEDED" ||
      String(order?.paymentStatus) === "succeeded");

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [showRefundForm, setShowRefundForm] = useState(false);

  useEffect(() => {
    if (order) {
      reset(order);
    }
  }, [order, reset]);

  const prevOrderIdRef = React.useRef<string | undefined>(undefined);
  if (order?.id !== prevOrderIdRef.current) {
    prevOrderIdRef.current = order?.id;
    if (actionError !== null) setActionError(null);
    if (actionSuccess !== null) setActionSuccess(null);
    if (showRefundForm) setShowRefundForm(false);
    if (refundReason !== "") setRefundReason("");
  }

  const handleManualReorder = async () => {
    if (!order) return;
    try {
      setActionLoading("reorder");
      setActionError(null);
      await adminManualReorder(order.id);
      setActionSuccess("Order has been re-queued for lab submission.");
    } catch (e: any) {
      setActionError(e?.message || "Failed to re-order");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRequestRefund = async () => {
    if (!order) return;
    try {
      setActionLoading("request-refund");
      setActionError(null);
      await adminRequestRefund(order.id, refundReason || undefined);
      setActionSuccess(
        "Refund request recorded. A superadmin must approve it.",
      );
      setShowRefundForm(false);
    } catch (e: any) {
      setActionError(e?.message || "Failed to request refund");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveRefund = async () => {
    if (!order) return;
    try {
      setActionLoading("approve-refund");
      setActionError(null);
      const refund = await adminApproveRefund(
        order.id,
        refundReason || undefined,
      );
      setActionSuccess(
        `Refund of $${refund.amount.toFixed(2)} issued successfully (ID: ${refund.refundId}).`,
      );
      setShowRefundForm(false);
    } catch (e: any) {
      setActionError(e?.message || "Failed to approve refund");
    } finally {
      setActionLoading(null);
    }
  };

  const onSubmit = (data: Order) => {
    if (!order) return;
    const orderData: Order = {
      ...order,
      ...data,
      updatedAt: new Date().toISOString(),
      completedAt:
        (data.status === "completed" || data.status === "COMPLETED") &&
        order.status !== "completed" &&
        order.status !== "COMPLETED"
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
            {isManualReviewOrder && (
              <div className='rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-200'>
                This order needs operations review before the lab submission can
                continue.
              </div>
            )}
            {isCancelledWithPayment && (
              <div className='rounded-md border border-red-200 bg-red-50 px-3 py-3 space-y-3 dark:border-red-900 dark:bg-red-950/20'>
                <p className='text-sm font-semibold text-red-900 dark:text-red-200'>
                  This order was cancelled by the lab (ACCESS) but payment was
                  collected. Admin action required.
                </p>
                {actionError && (
                  <p className='text-sm text-red-700 dark:text-red-400'>
                    {actionError}
                  </p>
                )}
                {actionSuccess && (
                  <p className='text-sm text-green-700 dark:text-green-400'>
                    {actionSuccess}
                  </p>
                )}
                <div className='flex flex-wrap gap-2'>
                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    onClick={handleManualReorder}
                    disabled={actionLoading !== null}
                  >
                    {actionLoading === "reorder"
                      ? "Re-ordering..."
                      : "Manual Re-order to Lab"}
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    onClick={() => {
                      setShowRefundForm((v) => !v);
                      setActionError(null);
                    }}
                    disabled={actionLoading !== null}
                  >
                    {showRefundForm
                      ? "Cancel"
                      : isSuperAdmin
                        ? "Issue Refund"
                        : "Request Refund"}
                  </Button>
                </div>
                {showRefundForm && (
                  <div className='space-y-2 pt-1'>
                    <Label className='text-sm text-red-900 dark:text-red-200'>
                      Reason{" "}
                      {!isSuperAdmin &&
                        "(will be submitted for superadmin approval)"}
                    </Label>
                    <Textarea
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      placeholder='Enter reason for refund...'
                      rows={2}
                      className='text-sm'
                    />
                    <div className='flex gap-2'>
                      {isSuperAdmin ? (
                        <Button
                          type='button'
                          size='sm'
                          variant='destructive'
                          onClick={handleApproveRefund}
                          disabled={actionLoading !== null}
                        >
                          {actionLoading === "approve-refund"
                            ? "Processing..."
                            : "Approve & Issue Refund"}
                        </Button>
                      ) : (
                        <Button
                          type='button'
                          size='sm'
                          variant='outline'
                          onClick={handleRequestRefund}
                          disabled={actionLoading !== null}
                        >
                          {actionLoading === "request-refund"
                            ? "Submitting..."
                            : "Submit Refund Request"}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
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
                    {ORDER_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {formatStatusLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Payment Status</Label>
                <div className='flex h-10 items-center gap-2 rounded-md border px-3'>
                  <Badge variant='outline'>
                    {(order.paymentStatus || order.paymentMethod).toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <Label className='text-muted-foreground'>Manual Review</Label>
                <p>
                  {order.manualReviewRequired ? "Required" : "Not required"}
                </p>
              </div>
              <div>
                <Label className='text-muted-foreground'>ACCESS Order</Label>
                <p>{order.accessOrderId || "Not submitted"}</p>
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
            {order.customerInfo.address.street && (
              <div className='space-y-2'>
                <Label>Address</Label>
                <Input
                  value={`${order.customerInfo.address.street}, ${order.customerInfo.address.city}, ${order.customerInfo.address.state} ${order.customerInfo.address.zipCode}`}
                  readOnly
                  className='bg-muted'
                />
              </div>
            )}
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
                  <Input
                    value={order.promoCode}
                    readOnly
                    className='bg-muted'
                  />
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
            {isManualReviewOrder && onRequeue && (
              <Button
                type='button'
                variant='outline'
                onClick={() => onRequeue(order.id)}
                disabled={isRequeueing}
              >
                {isRequeueing ? "Requeueing..." : "Requeue lab submission"}
              </Button>
            )}
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
