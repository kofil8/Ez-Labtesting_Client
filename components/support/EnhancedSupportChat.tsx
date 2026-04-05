"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MessageCircle,
  Phone,
  Send,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

export interface ChatMessage {
  id: string;
  sender: "user" | "support";
  message: string;
  timestamp: Date;
  attachments?: string[];
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  created: Date;
  updated: Date;
  messages: ChatMessage[];
}

interface EnhancedSupportChatProps {
  ticket?: SupportTicket;
  onNewTicket?: (subject: string, message: string) => Promise<void>;
  onSendMessage?: (ticketId: string, message: string) => Promise<void>;
  isOpen?: boolean;
  onClose?: () => void;
}

export function EnhancedSupportChat({
  ticket,
  onNewTicket,
  onSendMessage,
  isOpen = true,
  onClose,
}: EnhancedSupportChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    subject: "",
    message: "",
  });
  const [creating, setCreating] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !ticket) return;

    setSending(true);
    try {
      await onSendMessage?.(ticket.id, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicketForm.subject.trim() || !newTicketForm.message.trim()) return;

    setCreating(true);
    try {
      await onNewTicket?.(newTicketForm.subject, newTicketForm.message);
      setNewTicketForm({ subject: "", message: "" });
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className='w-4 h-4 text-emerald-600' />;
      case "in_progress":
        return <Clock className='w-4 h-4 text-blue-600 animate-spin' />;
      case "closed":
        return <X className='w-4 h-4 text-slate-600' />;
      default:
        return <AlertCircle className='w-4 h-4 text-amber-600' />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
  };

  return (
    <Card className='h-full max-h-screen flex flex-col bg-white dark:bg-slate-900'>
      {/* Header */}
      <CardHeader className='flex-shrink-0 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/50 pb-4 border-b border-slate-200 dark:border-slate-700'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <MessageCircle className='w-5 h-5 text-blue-600' />
            <div>
              <CardTitle className='text-lg'>
                {ticket ? "Support Ticket" : "Contact Support"}
              </CardTitle>
              {ticket && (
                <p className='text-xs text-muted-foreground mt-0.5'>
                  {ticket.subject}
                </p>
              )}
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className='p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className='flex-1 overflow-auto p-4 space-y-4'>
        {ticket ? (
          <>
            {/* Ticket Status */}
            <div className='flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700'>
              <div className='flex items-center gap-2'>
                {getStatusIcon(ticket.status)}
                <span className='text-sm font-medium'>
                  {getStatusLabel(ticket.status)}
                </span>
              </div>
              <div className='text-xs text-muted-foreground'>
                Created {new Date(ticket.created).toLocaleDateString()}
              </div>
            </div>

            {/* Messages */}
            <div className='space-y-3 max-h-96 overflow-y-auto'>
              {ticket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "support" && (
                    <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0'>
                      <MessageCircle className='w-4 h-4 text-blue-600' />
                    </div>
                  )}
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-100 dark:bg-slate-700 text-foreground rounded-bl-none"
                    }`}
                  >
                    <p className='text-sm'>{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "user"
                          ? "text-blue-100"
                          : "text-muted-foreground"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {msg.sender === "user" && (
                    <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0'>
                      <User className='w-4 h-4 text-white' />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className='space-y-2 flex-shrink-0'>
              <div className='flex gap-2'>
                <Input
                  placeholder='Type your message...'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={sending || ticket.status === "closed"}
                  className='text-sm'
                />
                <Button
                  size='sm'
                  onClick={handleSendMessage}
                  disabled={
                    !newMessage.trim() || sending || ticket.status === "closed"
                  }
                  className='flex-shrink-0'
                >
                  <Send className='w-4 h-4' />
                </Button>
              </div>
              {ticket.status === "closed" && (
                <p className='text-xs text-amber-600 dark:text-amber-400'>
                  This ticket is closed. Create a new ticket to continue.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className='space-y-4'>
            {/* Quick Links */}
            <div className='space-y-2'>
              <p className='text-sm font-semibold text-muted-foreground'>
                Need quick help?
              </p>
              <div className='grid grid-cols-2 gap-2'>
                <Button variant='outline' className='text-xs h-auto py-2'>
                  <Phone className='w-3 h-3 mr-1' />
                  Call Us
                </Button>
                <Button variant='outline' className='text-xs h-auto py-2'>
                  View FAQs
                </Button>
              </div>
            </div>

            {/* New Ticket Form */}
            <div className='space-y-3 border-t border-slate-200 dark:border-slate-700 pt-4'>
              <p className='text-sm font-semibold'>Create a Support Ticket</p>

              <div className='space-y-2'>
                <label className='text-xs font-medium text-muted-foreground'>
                  Subject
                </label>
                <Input
                  placeholder='Brief description of your issue'
                  value={newTicketForm.subject}
                  onChange={(e) =>
                    setNewTicketForm({
                      ...newTicketForm,
                      subject: e.target.value,
                    })
                  }
                  disabled={creating}
                  className='text-sm'
                />
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-medium text-muted-foreground'>
                  Details
                </label>
                <Textarea
                  placeholder='Please provide details about your issue...'
                  value={newTicketForm.message}
                  onChange={(e) =>
                    setNewTicketForm({
                      ...newTicketForm,
                      message: e.target.value,
                    })
                  }
                  disabled={creating}
                  rows={4}
                  className='text-sm'
                />
              </div>

              <Button
                onClick={handleCreateTicket}
                disabled={
                  !newTicketForm.subject.trim() ||
                  !newTicketForm.message.trim() ||
                  creating
                }
                className='w-full'
              >
                {creating ? "Creating..." : "Create Ticket"}
              </Button>
            </div>

            {/* Info Box */}
            <div className='bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-1'>
              <p className='font-semibold'>Expected Response Times:</p>
              <p>• High priority: 1-2 hours</p>
              <p>• Medium priority: 4-8 hours</p>
              <p>• Low priority: 24 hours</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
