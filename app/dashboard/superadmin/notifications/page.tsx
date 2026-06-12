import { SuperAdminNotifications } from "@/components/superadmin/SuperAdminNotifications";

export const metadata = {
  title: "Notifications | Superadmin Dashboard",
  description: "Compose and send custom notifications to platform roles",
};

export default function SuperAdminNotificationsPage() {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Notifications</h1>
        <p className='text-muted-foreground mt-2'>
          Compose a custom announcement for customers, lab partners, or admins
        </p>
      </div>
      <SuperAdminNotifications />
    </div>
  );
}
