import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col'>
      {/* SiteHeader is rendered by root layout */}
      {/* Children include role-specific layouts (admin, superadmin) or direct pages (customer, lab-partner) */}
      <div className='flex-1'>{children}</div>
      {/* No footer rendered on dashboard routes */}
    </div>
  );
}
