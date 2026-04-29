import { DashboardSectionHeader } from "@/components/dashboard/customer/DashboardSectionHeader";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { getCustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardCustomerChangePasswordPage() {
  const viewer = await getCustomerDashboardViewer();

  return (
    <div className='space-y-6'>
      <DashboardSectionHeader
        eyebrow='Password'
        title='Change your password'
        description='Verify high-risk access, then update your password with a strong unique value.'
        icon={Lock}
      />
      <ChangePasswordForm mfaEnabled={Boolean(viewer?.mfaEnabled)} />
    </div>
  );
}
