"use client";

import type { SupportTicket } from "@/components/support/types";
import { PRIORITY_COLORS, STATUS_COLORS } from "@/components/support/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  ArrowUpDown,
  Calendar,
  ChevronRight,
  Download,
  MessageSquare,
  User,
} from "lucide-react";
import { useState } from "react";

interface AdminTicketManagerProps {
  tickets: SupportTicket[];
  selectedTicketId?: string;
  onSelectTicket: (ticket: SupportTicket) => void;
  onTicketsUpdate: () => void;
  className?: string;
}

const statusColors = STATUS_COLORS;
const priorityColors = PRIORITY_COLORS;

export function AdminTicketManager({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onTicketsUpdate,
  className,
}: AdminTicketManagerProps) {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredTickets = tickets
    .filter((ticket) => {
      if (filterStatus && ticket.status !== filterStatus) return false;
      if (filterPriority && ticket.priority !== filterPriority) return false;
      return true;
    })
    .sort((a, b) => {
      const aValue = String(a[sortBy as keyof typeof a] ?? "");
      const bValue = String(b[sortBy as keyof typeof b] ?? "");

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const uniqueStatuses = Array.from(new Set(tickets.map((t) => t.status)));
  const uniquePriorities = Array.from(new Set(tickets.map((t) => t.priority)));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(filteredTickets.map((t) => t.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelectTicket = (ticketId: string, checked: boolean) => {
    if (checked) {
      setSelectedTickets((prev) => [...prev, ticketId]);
    } else {
      setSelectedTickets((prev) => prev.filter((id) => id !== ticketId));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedTickets.length === 0) return;

    try {
      const promises = selectedTickets.map((ticketId) => {
        if (action === "close") {
          return fetch(API_ENDPOINTS.SUPPORT.STATUS(ticketId), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "closed" }),
            credentials: "include",
          });
        }
        // Add more bulk actions as needed
        return Promise.resolve();
      });

      await Promise.all(promises);
      setSelectedTickets([]);
      onTicketsUpdate();
    } catch (error) {
      console.error("Failed to perform bulk action:", error);
    }
  };

  const exportTickets = () => {
    const csvContent = [
      [
        "Ticket Number",
        "Subject",
        "Status",
        "Priority",
        "Customer",
        "Created",
        "Updated",
      ],
      ...filteredTickets.map((ticket) => [
        ticket.ticketNumber,
        ticket.subject,
        ticket.status,
        ticket.priority,
        `${ticket.user?.firstName ?? ""} ${ticket.user?.lastName ?? ""}`.trim(),
        new Date(ticket.createdAt).toLocaleString(),
        new Date(ticket.updatedAt).toLocaleString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `support-tickets-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <MessageSquare className='h-5 w-5' />
            Ticket Management ({filteredTickets.length})
          </CardTitle>

          <div className='flex items-center gap-2'>
            {selectedTickets.length > 0 && (
              <div className='flex items-center gap-2'>
                <span className='text-sm text-muted-foreground'>
                  {selectedTickets.length} selected
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='sm'>
                      Bulk Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkAction("close")}>
                      Close Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("assign")}
                    >
                      Assign to Me
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <Button variant='outline' size='sm' onClick={exportTickets}>
              <Download className='h-4 w-4 mr-2' />
              Export
            </Button>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className='flex flex-wrap gap-2 mt-4'>
          <div className='flex items-center gap-2'>
            <Checkbox
              checked={
                selectedTickets.length === filteredTickets.length &&
                filteredTickets.length > 0
              }
              onCheckedChange={handleSelectAll}
            />
            <span className='text-sm'>Select All</span>
          </div>

          <Select
            value={filterStatus || "all"}
            onValueChange={(value) =>
              setFilterStatus(value === "all" ? null : value)
            }
          >
            <SelectTrigger className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              {uniqueStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterPriority || "all"}
            onValueChange={(value) =>
              setFilterPriority(value === "all" ? null : value)
            }
          >
            <SelectTrigger className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Priority</SelectItem>
              {uniquePriorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='updatedAt'>Last Updated</SelectItem>
              <SelectItem value='createdAt'>Created</SelectItem>
              <SelectItem value='priority'>Priority</SelectItem>
              <SelectItem value='status'>Status</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant='outline'
            size='sm'
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className='h-4 w-4' />
          </Button>
        </div>
      </CardHeader>

      <CardContent className='flex-1 p-0 overflow-hidden'>
        <div className='h-full overflow-y-auto'>
          {filteredTickets.length === 0 ? (
            <div className='text-center text-muted-foreground py-8 px-4'>
              No tickets found matching the current filters.
            </div>
          ) : (
            <div className='divide-y'>
              {filteredTickets.map((ticket) => {
                const isSelected = selectedTicketId === ticket.id;
                const isBulkSelected = selectedTickets.includes(ticket.id);
                const messages = ticket.messages ?? [];
                const lastMessage = messages[messages.length - 1];

                return (
                  <div
                    key={ticket.id}
                    className={cn(
                      "cursor-pointer hover:bg-accent/50 transition-colors",
                      isSelected && "bg-accent",
                    )}
                  >
                    <div className='p-4'>
                      <div className='flex items-start gap-3'>
                        <Checkbox
                          checked={isBulkSelected}
                          onCheckedChange={(checked) =>
                            handleSelectTicket(ticket.id, checked as boolean)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />

                        <div
                          className='flex-1 min-w-0'
                          onClick={() => onSelectTicket(ticket)}
                        >
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

                          <div className='flex items-center gap-2 text-xs text-muted-foreground mb-1'>
                            <User className='h-3 w-3' />
                            {ticket.user?.firstName} {ticket.user?.lastName}
                            <span>•</span>
                            <span>{ticket.user?.email}</span>
                          </div>

                          {lastMessage && (
                            <p className='text-xs text-muted-foreground truncate mb-1'>
                              <MessageSquare className='inline h-3 w-3 mr-1' />
                              {lastMessage.sender?.firstName ||
                                lastMessage.sender?.email ||
                                "Support"}
                              : {lastMessage.message}
                            </p>
                          )}

                          <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                            <div className='flex items-center gap-1'>
                              <Calendar className='h-3 w-3' />
                              Created{" "}
                              {format(
                                new Date(ticket.createdAt),
                                "MMM d, h:mm a",
                              )}
                            </div>
                            <div>
                              Updated{" "}
                              {format(
                                new Date(ticket.updatedAt),
                                "MMM d, h:mm a",
                              )}
                            </div>
                          </div>

                          {ticket.order && (
                            <div className='mt-2'>
                              <Badge variant='outline' className='text-xs'>
                                Order:{" "}
                                {ticket.order.accessOrderId || ticket.order.id}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className='flex items-center gap-1'>
                          <ChevronRight className='h-4 w-4 text-muted-foreground' />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
