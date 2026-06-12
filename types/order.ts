export interface Order {
  id: string;
  userId: string;
  tests: OrderTest[];
  orderNumber?: string;
  orderStatus?: string;
  status:
    | "CART"
    | "PENDING_PATIENT_INFO"
    | "PENDING_PAYMENT"
    | "PAYMENT_FAILED"
    | "PAID"
    | "AWAITING_USER_CONFIRMATION"
    | "READY_FOR_LAB_SUBMISSION"
    | "LAB_SUBMISSION_IN_PROGRESS"
    | "LAB_SUBMISSION_FAILED"
    | "MANUAL_REVIEW_REQUIRED"
    | "SUBMITTED_TO_LAB"
    | "REQUISITION_READY"
    | "COMPLETED"
    | "CANCELLED"
    | "pending"
    | "processing"
    | "completed"
    | "cancelled";
  paymentStatus?: string;
  totalAmount: number;
  subtotal: number;
  discount?: number;
  promoCode?: string;
  itemCount?: number;
  manualReviewRequired?: boolean;
  accessOrderId?: string | null;
  paidAt?: string | null;
  submittedToLabAt?: string | null;
  labOrderPlacedAt?: string | null;
  requisitionPdfUrl?: string | null;
  drawCenter?: {
    id?: string;
    name?: string;
    address?: string;
  } | null;
  customerInfo: CustomerInfo;
  paymentMethod:
    | "card"
    | "link"
    | "paypal"
    | "google_pay"
    | "apple_pay"
    | "crypto";
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

export interface OrderTest {
  testId: string;
  testName: string;
  price: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
  };
}
