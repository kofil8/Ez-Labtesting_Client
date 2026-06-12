"use client";

import { CreateTicketDialog } from "@/components/support/CreateTicketDialog";
import { SupportChat } from "@/components/support/SupportChat";
import type { SupportTicket } from "@/components/support/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { useSupport } from "@/lib/hooks/useSupport";
import { format } from "date-fns";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Clock,
  HelpCircle,
  Loader2,
  Mail,
  MessageSquare,
  Package,
  Phone,
  Plus,
} from "lucide-react";
import { useState } from "react";

interface CustomerSupportHubProps {
  className?: string;
}

export function CustomerSupportHub({ className }: CustomerSupportHubProps) {
  const { user } = useAuth();
  const {
    tickets,
    selectedTicket,
    isLoading,
    selectTicket,
    prependTicket,
    setSelectedTicket,
  } = useSupport();
  const [activeTab, setActiveTab] = useState("tickets");

  const handleSelectTicket = async (ticket: SupportTicket) => {
    await selectTicket(ticket);
    setActiveTab("chat");
  };

  const handleTicketCreated = (newTicket: SupportTicket) => {
    prependTicket(newTicket);
    handleSelectTicket(newTicket);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPEN":
      case "AWAITING_ADMIN":
        return <AlertCircle className='h-4 w-4 text-orange-500' />;
      case "IN_PROGRESS":
        return <Clock className='h-4 w-4 text-blue-500' />;
      case "WAITING_FOR_CUSTOMER":
        return <MessageSquare className='h-4 w-4 text-purple-500' />;
      case "RESOLVED":
      case "CLOSED":
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      default:
        return <HelpCircle className='h-4 w-4 text-gray-500' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
      case "AWAITING_ADMIN":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "WAITING_FOR_CUSTOMER":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "RESOLVED":
      case "CLOSED":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const quickActions = [
    {
      title: "Browse Tests",
      description: "View our available lab tests",
      icon: BookOpen,
      href: "/tests",
      color: "text-blue-600",
    },
    {
      title: "Order Status",
      description: "Track your current orders",
      icon: Package,
      href: "/dashboard/customer/results",
      color: "text-green-600",
    },
    {
      title: "Call Support",
      description: "Speak with our care team",
      icon: Phone,
      href: "tel:+17024837477",
      color: "text-purple-600",
    },
    {
      title: "Email Us",
      description: "Send us a detailed message",
      icon: Mail,
      href: "mailto:support@ezlabtesting.com",
      color: "text-orange-600",
    },
  ];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Welcome Section */}
      <Card className='border-0 bg-gradient-to-r from-blue-50 to-indigo-50'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Welcome to Support
              </h1>
              <p className='text-gray-600 mt-1'>
                We are here to help with any questions about your orders, tests,
                or results.
              </p>
            </div>
            <div className='hidden md:block'>
              <HelpCircle className='h-12 w-12 text-blue-500' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {quickActions.map((action) => (
          <a key={action.title} href={action.href} className='group'>
            <Card className='border-0 shadow-sm hover:shadow-md transition-shadow'>
              <CardContent className='p-4 text-center'>
                <action.icon
                  className={`h-8 w-8 mx-auto mb-2 ${action.color}`}
                />
                <h3 className='font-medium text-sm'>{action.title}</h3>
                <p className='text-xs text-gray-500 mt-1'>
                  {action.description}
                </p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='space-y-4'
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='tickets' className='flex items-center gap-2'>
            <MessageSquare className='h-4 w-4' />
            My Tickets ({tickets.length})
          </TabsTrigger>
          <TabsTrigger value='chat' className='flex items-center gap-2'>
            <MessageSquare className='h-4 w-4' />
            Conversation
          </TabsTrigger>
        </TabsList>

        <TabsContent value='tickets' className='space-y-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-4'>
              <CardTitle className='text-lg'>Support Tickets</CardTitle>
              <CreateTicketDialog onTicketCreated={handleTicketCreated} />
            </CardHeader>
            <CardContent className='space-y-3'>
              {tickets.length === 0 ? (
                <div className='text-center py-8'>
                  <MessageSquare className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    No support tickets yet
                  </h3>
                  <p className='text-gray-500 mb-4'>
                    Create your first ticket to get help from our support team.
                  </p>
                  <CreateTicketDialog onTicketCreated={handleTicketCreated} />
                </div>
              ) : (
                tickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className='cursor-pointer hover:shadow-md transition-shadow'
                    onClick={() => handleSelectTicket(ticket)}
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-2'>
                            <span className='text-sm font-semibold text-gray-900'>
                              #{ticket.ticketNumber}
                            </span>
                            <Badge className={getStatusColor(ticket.status)}>
                              <div className='flex items-center gap-1'>
                                {getStatusIcon(ticket.status)}
                                {ticket.status.replace(/_/g, " ")}
                              </div>
                            </Badge>
                            <Badge variant='outline' className='capitalize'>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <h3 className='font-medium text-gray-900 mb-1'>
                            {ticket.subject}
                          </h3>
                          <p className='text-sm text-gray-500 mb-2'>
                            Category: {ticket.category}
                          </p>
                          <div className='flex items-center gap-4 text-xs text-gray-500'>
                            <span>
                              Created{" "}
                              {format(
                                new Date(ticket.createdAt),
                                "MMM d, yyyy",
                              )}
                            </span>
                            <span>
                              Updated{" "}
                              {format(
                                new Date(ticket.updatedAt),
                                "MMM d, h:mm a",
                              )}
                            </span>
                          </div>
                        </div>
                        <div className='flex items-center'>
                          <Plus className='h-4 w-4 text-gray-400' />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='chat' className='h-[600px]'>
          {selectedTicket ? (
            <Card className='h-full flex flex-col'>
              <CardHeader className='pb-4 border-b'>
                <div className='flex items-start justify-between'>
                  <div>
                    <CardTitle className='text-lg'>
                      #{selectedTicket.ticketNumber}: {selectedTicket.subject}
                    </CardTitle>
                    <p className='text-sm text-gray-500 mt-1'>
                      Created{" "}
                      {format(
                        new Date(selectedTicket.createdAt),
                        "MMM d, yyyy",
                      )}{" "}
                      • Status: {selectedTicket.status.replace(/_/g, " ")}
                    </p>
                  </div>
                  <Badge className={getStatusColor(selectedTicket.status)}>
                    <div className='flex items-center gap-1'>
                      {getStatusIcon(selectedTicket.status)}
                      {selectedTicket.status.replace(/_/g, " ")}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='flex-1 p-0 overflow-hidden'>
                <SupportChat
                  ticketId={selectedTicket.id}
                  currentUserId={user?.id || ""}
                  initialMessages={selectedTicket.messages || []}
                  ticketStatus={selectedTicket.status}
                  className='h-full'
                />
              </CardContent>
            </Card>
          ) : (
            <Card className='h-full flex items-center justify-center'>
              <CardContent className='text-center'>
                <MessageSquare className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Select a ticket to chat
                </h3>
                <p className='text-gray-500 mb-4'>
                  Choose a ticket from your tickets list to start a conversation
                  with our support team.
                </p>
                <Button
                  variant='outline'
                  onClick={() => setActiveTab("tickets")}
                >
                  View My Tickets
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
