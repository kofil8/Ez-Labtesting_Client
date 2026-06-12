"use client";

import { SupportChat } from "@/components/support/SupportChat";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import {
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

type SupportCenterContentProps = {
  ordersHref?: string;
};

export function SupportCenterContent({
  ordersHref = "/dashboard/customer/results",
}: SupportCenterContentProps) {
  const { isAuthenticated, user } = useAuth();
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

  const normalizedMessages = useMemo(() => {
    if (!ticket?.messages) return [];
    return ticket.messages.map((m: any) => ({
      id: m.id,
      ticketId: ticket.id,
      senderId: m.sender?.id ?? "",
      senderType:
        m.senderType === "CUSTOMER" || m.senderType === "customer"
          ? "CUSTOMER"
          : m.senderType === "SYSTEM" || m.senderType === "system"
            ? "SYSTEM"
            : "ADMIN",
      sender: {
        id: m.sender?.id ?? "",
        firstName: m.sender?.firstName ?? "",
        lastName: m.sender?.lastName ?? "",
        email: m.sender?.email ?? "",
        role: m.sender?.role,
      },
      message: m.message,
      createdAt: m.createdAt,
    }));
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
      const timeoutId = window.setTimeout(() => setTicket(null), 0);
      return () => window.clearTimeout(timeoutId);
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
      href: ordersHref,
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
    <div className='space-y-8'>
      <section className='rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-5 py-6 shadow-xl shadow-blue-100/25 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-cyan-950/30 dark:shadow-black/30 sm:px-6 lg:px-7'>
        <div className='max-w-3xl'>
          <p className='text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300'>
            Support
          </p>
          <h1 className='mt-2 text-2xl font-extrabold tracking-normal text-slate-950 dark:text-slate-100 sm:text-3xl'>
            Get help without the noise
          </h1>
          <p className='mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base'>
            Use chat for quick help, email for follow-up, or open a ticket to
            keep one issue tracked in a single thread.
          </p>
        </div>
      </section>

      <div className='grid gap-4 md:grid-cols-3'>
        {contactCards.map((card) => (
          <Card
            key={card.title}
            className='rounded-[28px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30'
          >
            <CardHeader>
              <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 dark:bg-cyan-950/30 dark:text-cyan-300'>
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
                  className='text-sm font-semibold text-sky-700 transition-colors hover:text-sky-800 dark:text-cyan-300 dark:hover:text-cyan-200'
                >
                  {card.actionLabel}
                </button>
              ) : (
                <a
                  href={card.href}
                  className='text-sm font-semibold text-sky-700 transition-colors hover:text-sky-800 dark:text-cyan-300 dark:hover:text-cyan-200'
                >
                  {card.actionLabel}
                </a>
              )}
              {"meta" in card && card.meta ? (
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                  {card.meta}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className='rounded-[30px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30'>
        <CardHeader>
          <CardTitle className='text-xl text-slate-950 dark:text-slate-100'>
            Common tasks
          </CardTitle>
          <CardDescription>
            Jump directly to the pages customers use most often.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-3 md:grid-cols-3'>
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='rounded-[22px] border border-slate-200/80 bg-slate-50/70 p-4 transition-colors hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-900/80'
            >
              <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm dark:bg-slate-950 dark:text-cyan-300'>
                <link.icon className='h-5 w-5' />
              </div>
              <p className='mt-4 text-sm font-semibold text-slate-950 dark:text-slate-100'>
                {link.title}
              </p>
              <p className='mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300'>
                {link.description}
              </p>
            </Link>
          ))}
        </CardContent>
      </Card>

      {isAuthenticated ? (
        <div className='grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]'>
          <Card className='rounded-[30px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30'>
            <CardHeader>
              <CardTitle className='text-xl text-slate-950 dark:text-slate-100'>
                Your tickets
              </CardTitle>
              <CardDescription>
                Continue an existing conversation or open a new issue.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              {ticketList.length === 0 ? (
                <p className='text-sm text-slate-500 dark:text-slate-400'>
                  No tickets yet.
                </p>
              ) : (
                ticketList.map((ticketItem) => (
                  <button
                    key={ticketItem.id}
                    className={cn(
                      "w-full rounded-[22px] border p-3 text-left transition-colors",
                      activeTicketId === ticketItem.id
                        ? "border-sky-500 bg-sky-50 dark:border-cyan-700 dark:bg-cyan-950/30"
                        : "border-slate-200 bg-slate-50/70 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-900/80",
                    )}
                    onClick={() => setActiveTicketId(ticketItem.id)}
                  >
                    <p className='text-sm font-semibold text-slate-900 dark:text-slate-100'>
                      {ticketItem.subject}
                    </p>
                    <p className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
                      {ticketItem.status.replace("_", " ")} /{" "}
                      {ticketItem.priority}
                    </p>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <div className='min-w-0'>
            {loadingTicket ? (
              <Card className='rounded-[30px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30'>
                <CardContent className='py-10 text-center text-slate-500 dark:text-slate-400'>
                  Loading support conversation...
                </CardContent>
              </Card>
            ) : ticket ? (
              <Card
                className='rounded-[30px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30 flex flex-col'
                style={{ minHeight: "480px" }}
              >
                <CardHeader className='border-b border-slate-100 pb-3'>
                  <CardTitle className='text-lg text-slate-950 dark:text-slate-100'>
                    Support ticket
                  </CardTitle>
                  <p className='text-sm text-slate-500'>{ticket.subject}</p>
                </CardHeader>
                <CardContent className='flex-1 p-0 overflow-hidden'>
                  <SupportChat
                    ticketId={ticket.id}
                    currentUserId={user?.id ?? ""}
                    initialMessages={normalizedMessages}
                    ticketStatus={ticket.status?.toUpperCase() ?? "OPEN"}
                    className='h-full'
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className='rounded-[30px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30'>
                <CardContent className='py-10 text-center'>
                  <p className='text-sm text-slate-500 mb-4'>
                    No active ticket selected.
                  </p>
                  <Button
                    onClick={async () => {
                      const subject = window.prompt(
                        "What do you need help with?",
                      );
                      if (!subject) return;
                      const message = window.prompt("Describe your issue:");
                      if (!message) return;
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
                  >
                    Open a new ticket
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
