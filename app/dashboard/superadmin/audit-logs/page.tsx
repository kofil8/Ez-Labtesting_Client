import { AuditLogs } from "@/components/superadmin/AuditLogs";

export const metadata = {
  title: "Audit Logs | Superadmin Dashboard",
  description: "View system and admin action logs",
};

export default function AuditLogsPage() {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Audit Logs</h1>
        <p className='text-muted-foreground mt-2'>
          Track all admin actions and system events
        </p>
      </div>
      <AuditLogs />
    </div>
  );
}
