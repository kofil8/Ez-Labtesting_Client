export type SupportTicketStatus =
  | "OPEN"
  | "AWAITING_ADMIN"
  | "IN_PROGRESS"
  | "WAITING_FOR_CUSTOMER"
  | "RESOLVED"
  | "CLOSED";

export type SupportPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type SupportCategory = "GENERAL" | "BILLING" | "ORDER" | "TECHNICAL" | "RESULTS";
export type SupportSenderType = "CUSTOMER" | "ADMIN" | "SYSTEM";

export interface SupportUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

export interface SupportOrder {
  id: string;
  orderStatus: string;
  paymentStatus: string;
  accessOrderId?: string;
  requisitionPdfUrl?: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: SupportSenderType;
  sender: SupportUser;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  status: SupportTicketStatus;
  createdAt: string;
  updatedAt: string;
  responseTarget: string;
  messages: SupportMessage[];
  user: SupportUser;
  order?: SupportOrder;
}

export interface CreateTicketPayload {
  subject: string;
  category: string;
  priority: string;
  message: string;
  orderId?: string;
}

export const STATUS_COLORS: Record<SupportTicketStatus, string> = {
  OPEN: "bg-yellow-500",
  AWAITING_ADMIN: "bg-orange-500",
  IN_PROGRESS: "bg-blue-500",
  WAITING_FOR_CUSTOMER: "bg-purple-500",
  RESOLVED: "bg-green-500",
  CLOSED: "bg-gray-500",
};

export const STATUS_TEXT_COLORS: Record<SupportTicketStatus, string> = {
  OPEN: "bg-orange-100 text-orange-800 border-orange-200",
  AWAITING_ADMIN: "bg-orange-100 text-orange-800 border-orange-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
  WAITING_FOR_CUSTOMER: "bg-purple-100 text-purple-800 border-purple-200",
  RESOLVED: "bg-green-100 text-green-800 border-green-200",
  CLOSED: "bg-green-100 text-green-800 border-green-200",
};

export const PRIORITY_COLORS: Record<SupportPriority, string> = {
  LOW: "bg-gray-400",
  MEDIUM: "bg-blue-400",
  HIGH: "bg-orange-400",
  URGENT: "bg-red-500",
};
