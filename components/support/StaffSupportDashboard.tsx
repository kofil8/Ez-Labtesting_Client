"use client";

import { AdminSupportAnalytics } from "@/components/support/AdminSupportAnalytics";
import { AdminTicketManager } from "@/components/support/AdminTicketManager";
import { SupportChat } from "@/components/support/SupportChat";
import { TicketDetailsPanel } from "@/components/support/TicketDetailsPanel";
import type { SupportTicket } from "@/components/support/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupport } from "@/lib/hooks/useSupport";
import { format } from "date-fns";
import {
  ArrowLeft,
  BarChart3,
  Loader2,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

interface StaffSupportDashboardProps {
  roleLabel: "Admin Panel" | "Super Admin Panel";
  currentUserId: string;
}

export function StaffSupportDashboard({
  roleLabel,
  currentUserId,
}: StaffSupportDashboardProps) {
  const {
    tickets,
    selectedTicket,
    isLoading,
    error,
    loadTickets,
    selectTicket,
    updateSelectedTicketStatus,
    setSelectedTicket,
  } = useSupport();

  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [activeTab, setActiveTab] = useState<"tickets" | "analytics">("tickets");

  const handleSelectTicket = async (ticket: SupportTicket) => {
    await selectTicket(ticket);
    setMobileView("chat");
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
    setMobileView("list");
  };

  const handleStatusChange = (newStatus: string) => {
    updateSelectedTicketStatus(newStatus);
  };

  const openCount = tickets.filter(
    (t) => t.status === "OPEN" || t.status === "AWAITING_ADMIN",
  ).length;
  const inProgressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const waitingCount = tickets.filter((t) => t.status === "WAITING_FOR_CUSTOMER").length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Support Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage customer support tickets and monitor team performance
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {roleLabel}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="destructive" className="px-3 py-1">
            Open / Awaiting: {openCount}
          </Badge>
          <Badge variant="default" className="px-3 py-1">
            In Progress: {inProgressCount}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Waiting for Customer: {waitingCount}
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            Total: {tickets.length}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "tickets" | "analytics")}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Ticket Management
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="flex-1 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={loadTickets}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-12 gap-6 flex-1 min-h-0">
              {/* Ticket list — hidden on mobile when chat is open */}
              <div
                className={`lg:col-span-4 ${mobileView === "chat" ? "hidden lg:block" : ""}`}
              >
                <AdminTicketManager
                  tickets={tickets}
                  selectedTicketId={selectedTicket?.id}
                  onSelectTicket={handleSelectTicket}
                  onTicketsUpdate={loadTickets}
                  className="h-full"
                />
              </div>

              {/* Chat + details — hidden on mobile when list is shown */}
              <div
                className={`lg:col-span-8 ${mobileView === "list" ? "hidden lg:block" : ""}`}
              >
                {selectedTicket ? (
                  <div className="grid lg:grid-cols-3 gap-6 h-full">
                    {/* Chat area */}
                    <div className="lg:col-span-2">
                      <Card className="h-full flex flex-col">
                        <CardHeader className="pb-4 border-b">
                          <div className="flex items-center gap-2 mb-2 lg:hidden">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleBackToList}
                              className="h-auto p-0"
                            >
                              <ArrowLeft className="h-4 w-4 mr-1" />
                              Back
                            </Button>
                          </div>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                #{selectedTicket.ticketNumber}:{" "}
                                {selectedTicket.subject}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                Created{" "}
                                {format(
                                  new Date(selectedTicket.createdAt),
                                  "MMM d, yyyy",
                                )}{" "}
                                •{" "}
                                {selectedTicket.status.replace(/_/g, " ")}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 overflow-hidden">
                          <SupportChat
                            ticketId={selectedTicket.id}
                            currentUserId={currentUserId}
                            initialMessages={selectedTicket.messages ?? []}
                            ticketStatus={selectedTicket.status}
                            className="h-full"
                          />
                        </CardContent>
                      </Card>
                    </div>

                    {/* Details panel */}
                    <div className="hidden lg:block lg:col-span-1">
                      <TicketDetailsPanel
                        ticket={selectedTicket}
                        isAdmin={true}
                        onStatusChange={handleStatusChange}
                        className="h-full"
                      />
                    </div>
                  </div>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Select a ticket to respond
                      </h3>
                      <p className="text-muted-foreground">
                        Choose a ticket from the list to view the customer
                        conversation and provide support
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="flex-1 min-h-0">
          <AdminSupportAnalytics
            tickets={tickets}
            className="h-full overflow-y-auto"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
