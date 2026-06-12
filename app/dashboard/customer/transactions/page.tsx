import { DashboardSectionHeader } from "@/components/dashboard/customer/DashboardSectionHeader";
import { CustomerTransactionHistory } from "@/components/transaction/CustomerTransactionHistory";
import { ReceiptText } from "lucide-react";

export const dynamic = "force-dynamic";

export default function DashboardCustomerTransactionsPage() {
  return (
    <div className='space-y-6'>
      <DashboardSectionHeader
        eyebrow='Billing history'
        title='Payments and refunds'
        description='Review recorded charges, refunds, and payment methods tied to your account.'
        icon={ReceiptText}
      />
      <CustomerTransactionHistory />
    </div>
  );
}
