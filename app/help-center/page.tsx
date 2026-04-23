"use client";

import { EnhancedSupportChat } from "@/components/support/EnhancedSupportChat";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import {
  addSupportMessage,
  createSupportTicket,
  getSupportTicketById,
  getSupportTickets,
} from "@/lib/services/support.service";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CreditCard,
  Mail,
  MessageCircle,
  Phone,
  TestTube,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function HelpCenterPage() {
  const { isAuthenticated } = useAuth();
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [ticketList, setTicketList] = useState<any[]>([]);

  const openSupportAssistant = () => {
    window.dispatchEvent(
      new CustomEvent("ezlab:open-assistant", {
        detail: { contextKey: "support" },
      }),
    );
  };

  const activeTicket = useMemo(() => {
    if (!ticket) return undefined;

    return {
      id: ticket.id,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      created: new Date(ticket.createdAt),
      updated: new Date(ticket.updatedAt),
      messages: (ticket.messages || []).map((message: any) => ({
        id: message.id,
        sender: message.senderType === "support" ? "support" : "user",
        message: message.message,
        timestamp: new Date(message.createdAt),
      })),
    };
  }, [ticket]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadTickets = async () => {
      try {
        const response = await getSupportTickets({ page: 1, limit: 20 });
        setTicketList(response.data);
        if (!activeTicketId && response.data.length > 0) {
          setActiveTicketId(response.data[0].id);
        }
      } catch {
        // Keep the page usable without forcing an error state.
      }
    };

    loadTickets();
  }, [activeTicketId, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !activeTicketId) {
      setTicket(null);
      return;
    }

    const loadActiveTicket = async () => {
      setLoadingTicket(true);
      try {
        const data = await getSupportTicketById(activeTicketId);
        setTicket(data);
      } catch {
        setTicket(null);
      } finally {
        setLoadingTicket(false);
      }
    };

    loadActiveTicket();
  }, [activeTicketId, isAuthenticated]);

  const quickLinks = [
    {
      title: "Browse tests",
      description: "Review available lab tests and panels.",
      href: "/tests",
      icon: TestTube,
    },
    {
      title: "Orders and results",
      description: "Track order status and open reports.",
      href: "/results",
      icon: CreditCard,
    },
    {
      title: "How it works",
      description: "See the full order-to-results flow.",
      href: "/how-it-works",
      icon: BookOpen,
    },
  ];

  const contactCards = [
    {
      title: "Chat support",
      description: "Fastest option for order and result questions.",
      actionLabel: "Open chat",
      onClick: openSupportAssistant,
      icon: MessageCircle,
    },
    {
      title: "Email support",
      description: "Good for non-urgent questions and follow-up.",
      actionLabel: "support@ezlabtesting.com",
      href: "mailto:support@ezlabtesting.com",
      icon: Mail,
    },
    {
      title: "Phone support",
      description: "Speak with the care team directly.",
      actionLabel: "+1 (702) 483-7477",
      href: "tel:+17024837477",
      meta: "Mon-Fri, 8am-8pm EST",
      icon: Phone,
    },
  ];

  return (
    <div className='min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eef7ff_34%,#f8fbfd_100%)] py-10 sm:py-12'>
      <div className='container mx-auto max-w-7xl px-4'>
        <div className='space-y-8'>
          <section className='rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,rgba(14,165,233,0.12)_0%,rgba(255,255,255,0.96)_52%,rgba(16,185,129,0.08)_100%)] px-6 py-7 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.35)] sm:px-8'>
            <div className='max-w-3xl'>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-sky-700'>
                Support
              </p>
              <h1 className='mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl'>
                Get help without the noise
              </h1>
              <p className='mt-3 text-sm leading-7 text-slate-600 sm:text-base'>
                Use chat for quick help, email for follow-up, or open a ticket to
                keep one issue tracked in a single thread.
              </p>
            </div>
          </section>

          <div className='grid gap-4 md:grid-cols-3'>
            {contactCards.map((card) => (
              <Card
                key={card.title}
                className='rounded-[28px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]'
              >
                <CardHeader>
                  <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700'>
                    <card.icon className='h-5 w-5' />
                  </div>
                  <CardTitle className='pt-2 text-lg'>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                  {"onClick" in card ? (
                    <button
                      type='button'
                      onClick={card.onClick}
                      className='text-sm font-semibold text-sky-700 transition-colors hover:text-sky-800'
                    >
                      {card.actionLabel}
                    </button>
                  ) : (
                    <a
                      href={card.href}
                      className='text-sm font-semibold text-sky-700 transition-colors hover:text-sky-800'
                    >
                      {card.actionLabel}
                    </a>
                  )}
                  {"meta" in card && card.meta ? (
                    <p className='text-xs text-slate-500'>{card.meta}</p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className='rounded-[30px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]'>
            <CardHeader>
              <CardTitle className='text-xl text-slate-950'>Common tasks</CardTitle>
              <CardDescription>
                Jump directly to the pages customers use most often.
              </CardDescription>
            </CardHeader>
            <CardContent className='grid gap-3 md:grid-cols-3'>
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='rounded-[22px] border border-slate-200/80 bg-slate-50/70 p-4 transition-colors hover:border-slate-300 hover:bg-white'
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm'>
                    <link.icon className='h-5 w-5' />
                  </div>
                  <p className='mt-4 text-sm font-semibold text-slate-950'>
                    {link.title}
                  </p>
                  <p className='mt-1 text-sm leading-6 text-slate-600'>
                    {link.description}
                  </p>
                </Link>
              ))}
            </CardContent>
          </Card>

          {isAuthenticated ? (
            <div className='grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]'>
              <Card className='rounded-[30px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]'>
                <CardHeader>
                  <CardTitle className='text-xl text-slate-950'>Your tickets</CardTitle>
                  <CardDescription>
                    Continue an existing conversation or open a new issue.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                  {ticketList.length === 0 ? (
                    <p className='text-sm text-slate-500'>No tickets yet.</p>
                  ) : (
                    ticketList.map((ticketItem) => (
                      <button
                        key={ticketItem.id}
                        className={cn(
                          "w-full rounded-[22px] border p-3 text-left transition-colors",
                          activeTicketId === ticketItem.id
                            ? "border-sky-500 bg-sky-50"
                            : "border-slate-200 bg-slate-50/70 hover:bg-white",
                        )}
                        onClick={() => setActiveTicketId(ticketItem.id)}
                      >
                        <p className='text-sm font-semibold text-slate-900'>
                          {ticketItem.subject}
                        </p>
                        <p className='mt-1 text-xs text-slate-500'>
                          {ticketItem.status.replace("_", " ")} • {ticketItem.priority}
                        </p>
                      </button>
                    ))
                  )}
                </CardContent>
              </Card>

              <div className='min-w-0'>
                {loadingTicket ? (
                  <Card className='rounded-[30px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]'>
                    <CardContent className='py-10 text-center text-slate-500'>
                      Loading support conversation...
                    </CardContent>
                  </Card>
                ) : (
                  <EnhancedSupportChat
                    ticket={activeTicket}
                    onNewTicket={async (subject, message) => {
                      const created = await createSupportTicket({
                        subject,
                        message,
                        category: "general",
                        priority: "medium",
                      });
                      setActiveTicketId(created.id);
                      const response = await getSupportTickets({
                        page: 1,
                        limit: 20,
                      });
                      setTicketList(response.data);
                    }}
                    onSendMessage={async (ticketId, message) => {
                      await addSupportMessage(ticketId, message);
                      const data = await getSupportTicketById(ticketId);
                      setTicket(data);
                    }}
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
