import { clientFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-contracts/endpoints";

export type SupportPriority = "low" | "medium" | "high";
export type SupportStatus = "open" | "in_progress" | "resolved" | "closed";

export interface SupportTicketMessage {
  id: string;
  senderType: "customer" | "support";
  message: string;
  createdAt: string;
  sender?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  };
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: "billing" | "technical" | "results" | "general";
  priority: SupportPriority;
  status: SupportStatus;
  responseTarget: string;
  createdAt: string;
  updatedAt: string;
  respondedAt?: string | null;
  resolvedAt?: string | null;
  orderId?: string | null;
  messages?: SupportTicketMessage[];
}

interface TicketListResponse {
  data: SupportTicket[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export async function createSupportTicket(payload: {
  subject: string;
  message: string;
  category?: "billing" | "technical" | "results" | "general";
  priority?: SupportPriority;
  orderId?: string;
}): Promise<SupportTicket> {
  const res = await clientFetch(API_ENDPOINTS.SUPPORT.TICKETS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create support ticket");
  }

  const data = await res.json();
  return data?.data as SupportTicket;
}

export async function getSupportTickets(params?: {
  page?: number;
  limit?: number;
  status?: SupportStatus;
  priority?: SupportPriority;
}): Promise<TicketListResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status) query.set("status", params.status);
  if (params?.priority) query.set("priority", params.priority);

  const endpoint = `${API_ENDPOINTS.SUPPORT.TICKETS}${query.size ? `?${query.toString()}` : ""}`;

  const res = await clientFetch(endpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch support tickets");
  }

  const data = await res.json();
  return {
    data: (data?.data || []) as SupportTicket[],
    meta: data?.meta,
  };
}

export async function getSupportTicketById(
  ticketId: string,
): Promise<SupportTicket> {
  const res = await clientFetch(API_ENDPOINTS.SUPPORT.GET_TICKET(ticketId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch support ticket");
  }

  const data = await res.json();
  return data?.data as SupportTicket;
}

export async function addSupportMessage(
  ticketId: string,
  message: string,
): Promise<SupportTicketMessage> {
  const res = await clientFetch(API_ENDPOINTS.SUPPORT.MESSAGES(ticketId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to send support message");
  }

  const data = await res.json();
  return data?.data as SupportTicketMessage;
}
