import { SystemSettings } from "@/components/superadmin/SystemSettings";

export const metadata = {
  title: "System Settings | Superadmin Dashboard",
  description: "Configure system-wide settings",
};

export default function SystemSettingsPage() {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>System Settings</h1>
        <p className='text-muted-foreground mt-2'>
          Configure system-wide settings and configuration
        </p>
      </div>
      <SystemSettings />
    </div>
  );
}
