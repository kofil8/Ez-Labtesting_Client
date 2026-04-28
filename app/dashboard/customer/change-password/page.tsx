import { DashboardSectionHeader } from "@/components/dashboard/customer/DashboardSectionHeader";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { Lock } from "lucide-react";

export default function DashboardCustomerChangePasswordPage() {
  return (
    <div className='space-y-6'>
      <DashboardSectionHeader
        eyebrow='Password'
        title='Change your password'
        description='Update your password to keep your account secure. Use a strong, unique password.'
        icon={Lock}
      />
      <div className='max-w-md'>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
