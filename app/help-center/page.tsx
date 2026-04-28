"use client";

import { SupportCenterContent } from "@/components/support/SupportCenterContent";

export default function HelpCenterPage() {
  return (
    <div className='min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eef7ff_34%,#f8fbfd_100%)] py-10 sm:py-12'>
      <div className='container mx-auto max-w-7xl px-4'>
        <SupportCenterContent ordersHref='/dashboard/customer/results' />
      </div>
    </div>
  );
}
