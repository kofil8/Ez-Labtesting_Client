"use client";

import type { SupportTicket } from "@/components/support/types";
import { PRIORITY_COLORS, STATUS_COLORS } from "@/components/support/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_ENDPOINTS } from "@/lib/api-contracts/endpoints";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, Clock, Package, User } from "lucide-react";

interface TicketDetailsPanelProps {
  ticket: SupportTicket;
  isAdmin?: boolean;
  onStatusChange?: (status: string) => void;
  className?: string;
}

const statusColors = STATUS_COLORS;
const priorityColors = PRIORITY_COLORS;

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export function TicketDetailsPanel({
  ticket,
  isAdmin = false,
  onStatusChange,
  className,
}: TicketDetailsPanelProps) {
  const handleStatusChange = async (newStatus: string) => {
    if (!isAdmin) return;

    try {
      const response = await fetch(API_ENDPOINTS.SUPPORT.STATUS(ticket.id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      onStatusChange?.(newStatus);
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    }
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg'>Ticket Details</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Ticket Number & Status */}
        <div className='flex items-center justify-between'>
          <span className='text-sm font-semibold'>#{ticket.ticketNumber}</span>
          <div className='flex gap-2'>
            <Badge
              className={cn("text-xs text-white", statusColors[ticket.status])}
            >
              {ticket.status.replace(/_/g, " ")}
            </Badge>
            <Badge
              className={cn(
                "text-xs text-white",
                priorityColors[ticket.priority],
              )}
            >
              {ticket.priority}
            </Badge>
          </div>
        </div>

        {/* Subject */}
        <div>
          <h3 className='font-medium text-sm'>{ticket.subject}</h3>
          <p className='text-xs text-muted-foreground mt-1'>
            Category: {ticket.category}
          </p>
        </div>

        {/* Status Control (Admin Only) */}
        {isAdmin && onStatusChange && (
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Update Status</label>
            <Select
              value={ticket.status.toLowerCase()}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Customer Info (Admin Only) */}
        {isAdmin && ticket.user && (
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm'>
              <User className='h-4 w-4 text-muted-foreground' />
              <span className='font-medium'>Customer:</span>
            </div>
            <p className='text-sm ml-6'>
              {ticket.user.firstName} {ticket.user.lastName}
            </p>
            <p className='text-xs text-muted-foreground ml-6'>
              {ticket.user.email}
            </p>
          </div>
        )}

        {/* Order Info */}
        {ticket.order && (
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm'>
              <Package className='h-4 w-4 text-muted-foreground' />
              <span className='font-medium'>Related Order:</span>
            </div>
            <p className='text-sm ml-6'>
              {ticket.order.accessOrderId || ticket.order.id}
            </p>
            <div className='flex gap-2 ml-6'>
              <Badge variant='outline' className='text-xs'>
                {ticket.order.orderStatus}
              </Badge>
              <Badge variant='outline' className='text-xs'>
                {ticket.order.paymentStatus}
              </Badge>
            </div>
            {ticket.order.requisitionPdfUrl && (
              <Button
                variant='link'
                size='sm'
                className='ml-6 h-auto p-0'
                asChild
              >
                <a
                  href={ticket.order.requisitionPdfUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  View Requisition
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Dates */}
        <div className='space-y-2 pt-2 border-t'>
          <div className='flex items-center gap-2 text-sm'>
            <Calendar className='h-4 w-4 text-muted-foreground' />
            <span className='text-muted-foreground'>Created:</span>
            <span className='text-sm'>
              {format(new Date(ticket.createdAt), "MMM d, yyyy h:mm a")}
            </span>
          </div>
          <div className='flex items-center gap-2 text-sm'>
            <Clock className='h-4 w-4 text-muted-foreground' />
            <span className='text-muted-foreground'>Response Target:</span>
            <span className='text-sm'>
              {format(new Date(ticket.responseTarget), "MMM d, h:mm a")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
