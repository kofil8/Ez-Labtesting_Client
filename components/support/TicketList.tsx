"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronRight, MessageSquare } from "lucide-react";
import { useState } from "react";

interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status:
    | "OPEN"
    | "AWAITING_ADMIN"
    | "IN_PROGRESS"
    | "WAITING_FOR_CUSTOMER"
    | "RESOLVED"
    | "CLOSED";
  createdAt: string;
  updatedAt: string;
  responseTarget: string;
  messages: Array<{
    id: string;
    ticketId: string;
    senderId: string;
    senderType: "CUSTOMER" | "ADMIN" | "SYSTEM";
    message: string;
    createdAt: string;
    sender: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
  }>;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  order?: {
    id: string;
    orderStatus: string;
    paymentStatus: string;
    accessOrderId?: string;
    requisitionPdfUrl?: string;
  };
}

interface TicketListProps {
  tickets: SupportTicket[];
  selectedTicketId?: string;
  onSelectTicket: (ticket: SupportTicket) => void;
  isAdmin?: boolean;
  className?: string;
}

const statusColors: Record<string, string> = {
  OPEN: "bg-yellow-500",
  AWAITING_ADMIN: "bg-orange-500",
  IN_PROGRESS: "bg-blue-500",
  WAITING_FOR_CUSTOMER: "bg-purple-500",
  RESOLVED: "bg-green-500",
  CLOSED: "bg-gray-500",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-400",
  MEDIUM: "bg-blue-400",
  HIGH: "bg-orange-400",
  URGENT: "bg-red-500",
};

export function TicketList({
  tickets,
  selectedTicketId,
  onSelectTicket,
  isAdmin = false,
  className,
}: TicketListProps) {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredTickets = filterStatus
    ? tickets.filter((t) => t.status === filterStatus)
    : tickets;

  const uniqueStatuses = Array.from(new Set(tickets.map((t) => t.status)));

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Filter Buttons */}
      <div className='p-3 border-b'>
        <div className='flex flex-wrap gap-2'>
          <Button
            variant={filterStatus === null ? "default" : "outline"}
            size='sm'
            onClick={() => setFilterStatus(null)}
          >
            All ({tickets.length})
          </Button>
          {uniqueStatuses.map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size='sm'
              onClick={() => setFilterStatus(status)}
            >
              {status.replace(/_/g, " ")} (
              {tickets.filter((t) => t.status === status).length})
            </Button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className='flex-1 overflow-y-auto'>
        {filteredTickets.length === 0 ? (
          <div className='text-center text-muted-foreground py-8 px-4'>
            No tickets found.
          </div>
        ) : (
          <div className='divide-y'>
            {filteredTickets.map((ticket) => {
              const isSelected = selectedTicketId === ticket.id;
              const lastMessage = ticket.messages[ticket.messages.length - 1];

              return (
                <Card
                  key={ticket.id}
                  className={cn(
                    "cursor-pointer border-0 rounded-none hover:bg-accent/50 transition-colors",
                    isSelected && "bg-accent",
                  )}
                  onClick={() => onSelectTicket(ticket)}
                >
                  <CardContent className='p-4'>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='text-sm font-semibold'>
                            #{ticket.ticketNumber}
                          </span>
                          <Badge
                            className={cn(
                              "text-xs text-white",
                              statusColors[ticket.status],
                            )}
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
                        <h3 className='font-medium text-sm truncate mb-1'>
                          {ticket.subject}
                        </h3>
                        {isAdmin && ticket.user && (
                          <p className='text-xs text-muted-foreground'>
                            {ticket.user.firstName} {ticket.user.lastName} (
                            {ticket.user.email})
                          </p>
                        )}
                        {lastMessage && (
                          <p className='text-xs text-muted-foreground truncate mt-1'>
                            <MessageSquare className='inline h-3 w-3 mr-1' />
                            {lastMessage.sender.firstName ||
                              lastMessage.sender.email}
                            : {lastMessage.message}
                          </p>
                        )}
                        <p className='text-xs text-muted-foreground mt-1'>
                          Updated{" "}
                          {format(new Date(ticket.updatedAt), "MMM d, h:mm a")}
                        </p>
                      </div>
                      <ChevronRight className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
