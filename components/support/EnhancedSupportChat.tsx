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

function getStatusIcon(status: string) {
  if (status === "resolved") {
    return <CheckCircle className='h-4 w-4 text-emerald-600' />;
  }
  if (status === "in_progress") {
    return <Clock className='h-4 w-4 text-sky-600' />;
  }
  if (status === "closed") {
    return <X className='h-4 w-4 text-slate-600' />;
  }
  return <AlertCircle className='h-4 w-4 text-amber-600' />;
}

function getStatusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
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

  return (
    <Card className='flex h-full max-h-screen flex-col rounded-[30px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]'>
      <CardHeader className='border-b border-slate-100 bg-slate-50/70 pb-4'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700'>
              <MessageCircle className='h-5 w-5' />
            </div>
            <div>
              <CardTitle className='text-lg text-slate-950'>
                {ticket ? "Support ticket" : "Open a support ticket"}
              </CardTitle>
              <p className='mt-1 text-sm text-slate-500'>
                {ticket
                  ? ticket.subject
                  : "Describe the issue once and keep updates in one thread."}
              </p>
            </div>
          </div>

          {onClose ? (
            <button
              onClick={onClose}
              className='rounded-xl p-2 transition-colors hover:bg-slate-100'
            >
              <X className='h-4 w-4 text-slate-500' />
            </button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className='flex-1 overflow-auto p-5'>
        {ticket ? (
          <div className='space-y-4'>
            <div className='flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-3'>
              <div className='flex items-center gap-2 text-sm font-medium text-slate-900'>
                {getStatusIcon(ticket.status)}
                {getStatusLabel(ticket.status)}
              </div>
              <div className='text-xs text-slate-500'>
                Created {new Date(ticket.created).toLocaleDateString()}
              </div>
            </div>

            <div className='max-h-[420px] space-y-3 overflow-y-auto pr-1'>
              {ticket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "support" ? (
                    <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-700'>
                      <MessageCircle className='h-4 w-4' />
                    </div>
                  ) : null}

                  <div
                    className={`max-w-[32rem] rounded-[22px] px-4 py-3 ${
                      msg.sender === "user"
                        ? "bg-sky-600 text-white"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    <p className='text-sm leading-6'>{msg.message}</p>
                    <p
                      className={`mt-2 text-xs ${
                        msg.sender === "user" ? "text-sky-100" : "text-slate-500"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {msg.sender === "user" ? (
                    <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white'>
                      <User className='h-4 w-4' />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className='space-y-2 border-t border-slate-100 pt-4'>
              <div className='flex gap-2'>
                <Input
                  placeholder='Type a message'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={sending || ticket.status === "closed"}
                  className='rounded-2xl border-slate-200'
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={
                    !newMessage.trim() || sending || ticket.status === "closed"
                  }
                  className='rounded-2xl'
                >
                  <Send className='h-4 w-4' />
                </Button>
              </div>
              {ticket.status === "closed" ? (
                <p className='text-xs text-amber-600'>
                  This ticket is closed. Open a new ticket to continue.
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <div className='space-y-5'>
            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='rounded-[22px] border border-slate-200 bg-slate-50/70 p-4'>
                <p className='text-sm font-semibold text-slate-950'>Best for urgent help</p>
                <p className='mt-1 text-sm leading-6 text-slate-600'>
                  Use chat or phone if an order is blocked or a result needs fast follow-up.
                </p>
                <Button variant='outline' className='mt-3 rounded-full'>
                  <Phone className='h-4 w-4' />
                  Call support
                </Button>
              </div>
              <div className='rounded-[22px] border border-slate-200 bg-slate-50/70 p-4'>
                <p className='text-sm font-semibold text-slate-950'>Best for tracked issues</p>
                <p className='mt-1 text-sm leading-6 text-slate-600'>
                  Open one ticket for billing, requisition, or results questions you want documented.
                </p>
              </div>
            </div>

            <div className='space-y-3 border-t border-slate-100 pt-5'>
              <p className='text-sm font-semibold text-slate-950'>Create a ticket</p>

              <div className='space-y-2'>
                <label className='text-xs font-medium uppercase tracking-[0.18em] text-slate-500'>
                  Subject
                </label>
                <Input
                  placeholder='Briefly describe the issue'
                  value={newTicketForm.subject}
                  onChange={(e) =>
                    setNewTicketForm({
                      ...newTicketForm,
                      subject: e.target.value,
                    })
                  }
                  disabled={creating}
                  className='rounded-2xl border-slate-200'
                />
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-medium uppercase tracking-[0.18em] text-slate-500'>
                  Message
                </label>
                <Textarea
                  placeholder='Include the order number and what you need help with.'
                  value={newTicketForm.message}
                  onChange={(e) =>
                    setNewTicketForm({
                      ...newTicketForm,
                      message: e.target.value,
                    })
                  }
                  rows={5}
                  disabled={creating}
                  className='rounded-2xl border-slate-200'
                />
              </div>

              <Button
                onClick={handleCreateTicket}
                disabled={
                  !newTicketForm.subject.trim() ||
                  !newTicketForm.message.trim() ||
                  creating
                }
                className='rounded-full'
              >
                {creating ? "Creating..." : "Create ticket"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
