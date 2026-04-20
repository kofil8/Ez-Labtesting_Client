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
        // keep UI usable without forcing error state
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

  const supportCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using EzLabTesting",
      icon: BookOpen,
      links: [
        { label: "How to Book a Test", href: "/how-it-works" },
        { label: "Creating an Account", href: "/register" },
      ],
    },
    {
      title: "Test Information",
      description: "Everything about our lab tests",
      icon: TestTube,
      links: [
        { label: "Browse Available Tests", href: "/tests" },
        { label: "Test Preparation Guidelines", href: "/test-preparation" },
        { label: "Understanding Your Results", href: "/results" },
      ],
    },
    {
      title: "Orders & Payments",
      description: "Manage your orders and billing",
      icon: CreditCard,
      links: [
        { label: "View My Orders", href: "/dashboard/customer/orders" },
        { label: "Payment Methods", href: "/checkout" },
        { label: "Refund Policy", href: "/terms-of-service#refunds" },
      ],
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='container mx-auto px-4 max-w-6xl'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Help Center</h1>
          <p className='text-xl text-gray-600'>
            Find answers to your questions and get the support you need
          </p>
        </div>

        {/* Contact Options */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          <Card className='hover:shadow-lg transition-shadow'>
            <CardHeader>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                <Mail className='h-6 w-6 text-blue-600' />
              </div>
              <CardTitle>Email Support</CardTitle>
              <CardDescription>
                Get help via email within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <a
                href='mailto:support@ezlabtesting.com'
                className='block text-blue-600 hover:underline'
              >
                support@ezlabtesting.com
              </a>
              <a
                href='mailto:drramseymail@gmail.com'
                className='block text-blue-600 hover:underline'
              >
                drramseymail@gmail.com
              </a>
            </CardContent>
          </Card>

          <Card className='hover:shadow-lg transition-shadow'>
            <CardHeader>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4'>
                <Phone className='h-6 w-6 text-green-600' />
              </div>
              <CardTitle>Phone Support</CardTitle>
              <CardDescription>Speak with our team directly</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href='tel:+17024837477'
                className='text-blue-600 hover:underline'
              >
                +1(702) 483-7477
              </a>
              <p className='text-sm text-gray-500 mt-2'>Mon-Fri: 8am-8pm EST</p>
            </CardContent>
          </Card>

          <Card className='hover:shadow-lg transition-shadow'>
            <CardHeader>
              <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
                <MessageCircle className='h-6 w-6 text-purple-600' />
              </div>
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Chat with us in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <button
                type='button'
                className='text-blue-600 hover:underline'
                onClick={openSupportAssistant}
              >
                Start Chat
              </button>
              <p className='text-sm text-gray-500 mt-2'>
                Average wait: 2 minutes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Support Categories */}
        <div className='space-y-8'>
          <h2 className='text-3xl font-bold text-gray-900 mb-6'>
            Browse by Category
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {supportCategories.map((category) => (
              <Card
                key={category.title}
                className='hover:shadow-lg transition-shadow'
              >
                <CardHeader>
                  <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                    <category.icon className='h-6 w-6 text-blue-600' />
                  </div>
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-2'>
                    {category.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className='text-blue-600 hover:underline text-sm'
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className='mt-12 bg-white rounded-lg shadow-md p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>Quick Links</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Link href='/faqs' className='text-blue-600 hover:underline'>
              → Frequently Asked Questions
            </Link>
            <Link
              href='/test-preparation'
              className='text-blue-600 hover:underline'
            >
              → Test Preparation Guidelines
            </Link>
            <Link
              href='/privacy-policy'
              className='text-blue-600 hover:underline'
            >
              → Privacy Policy
            </Link>
            <Link
              href='/terms-of-service'
              className='text-blue-600 hover:underline'
            >
              → Terms of Service
            </Link>
            <Link
              href='/hipaa-notice'
              className='text-blue-600 hover:underline'
            >
              → HIPAA Notice
            </Link>
            <Link
              href='/accessibility'
              className='text-blue-600 hover:underline'
            >
              → Accessibility Statement
            </Link>
          </div>
        </div>

        {isAuthenticated && (
          <div className='mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <Card className='lg:col-span-1'>
              <CardHeader>
                <CardTitle>Your Support Tickets</CardTitle>
                <CardDescription>
                  Open an issue or continue an existing conversation
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                {ticketList.length === 0 ? (
                  <p className='text-sm text-gray-500'>No tickets yet.</p>
                ) : (
                  ticketList.map((ticketItem) => (
                    <button
                      key={ticketItem.id}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        activeTicketId === ticketItem.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveTicketId(ticketItem.id)}
                    >
                      <p className='text-sm font-semibold text-gray-900'>
                        {ticketItem.subject}
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        {ticketItem.status.replace("_", " ")} ·{" "}
                        {ticketItem.priority}
                      </p>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            <div className='lg:col-span-2'>
              {loadingTicket ? (
                <Card>
                  <CardContent className='py-10 text-center text-gray-500'>
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
        )}
      </div>
    </div>
  );
}
