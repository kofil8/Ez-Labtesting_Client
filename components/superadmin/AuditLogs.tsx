"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Download, Eye, Filter } from "lucide-react";
import { useMemo, useState } from "react";

interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  status: "success" | "failed";
  changesBefore?: string;
  changesAfter?: string;
}

// Mock audit logs data
const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    adminId: "admin1",
    adminName: "John Doe",
    action: "CREATE",
    resource: "User",
    resourceId: "user-123",
    details: "Created new customer account",
    timestamp: "2026-01-21 14:30:45",
    ipAddress: "192.168.1.100",
    status: "success",
  },
  {
    id: "2",
    adminId: "admin2",
    adminName: "Jane Smith",
    action: "UPDATE",
    resource: "Test",
    resourceId: "test-456",
    details: "Updated test pricing",
    timestamp: "2026-01-21 13:15:22",
    ipAddress: "192.168.1.101",
    status: "success",
    changesBefore: "Price: $99.00",
    changesAfter: "Price: $89.00",
  },
  {
    id: "3",
    adminId: "admin1",
    adminName: "John Doe",
    action: "DELETE",
    resource: "PromoCode",
    resourceId: "promo-789",
    details: "Deleted expired promo code",
    timestamp: "2026-01-21 12:00:00",
    ipAddress: "192.168.1.100",
    status: "success",
  },
  {
    id: "4",
    adminId: "admin3",
    adminName: "Bob Wilson",
    action: "UPDATE",
    resource: "Order",
    resourceId: "order-321",
    details: "Changed order status to completed",
    timestamp: "2026-01-21 11:45:30",
    ipAddress: "192.168.1.102",
    status: "success",
  },
  {
    id: "5",
    adminId: "admin2",
    adminName: "Jane Smith",
    action: "VIEW",
    resource: "User",
    resourceId: "user-654",
    details: "Viewed user sensitive information",
    timestamp: "2026-01-21 10:20:15",
    ipAddress: "192.168.1.101",
    status: "success",
  },
  {
    id: "6",
    adminId: "admin1",
    adminName: "John Doe",
    action: "CREATE",
    resource: "Admin",
    resourceId: "admin-new",
    details: "Created new admin account",
    timestamp: "2026-01-20 16:30:00",
    ipAddress: "192.168.1.100",
    status: "success",
  },
];

const actionColors: Record<string, { bg: string; text: string }> = {
  CREATE: { bg: "bg-green-100", text: "text-green-800 dark:text-green-200" },
  UPDATE: { bg: "bg-blue-100", text: "text-blue-800 dark:text-blue-200" },
  DELETE: { bg: "bg-red-100", text: "text-red-800 dark:text-red-200" },
  VIEW: { bg: "bg-gray-100", text: "text-gray-800 dark:text-gray-200" },
};

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterResource, setFilterResource] = useState("all");
  const [filterAdmin, setFilterAdmin] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const uniqueAdmins = useMemo(
    () => [...new Set(logs.map((log) => log.adminName))],
    [logs],
  );

  const uniqueResources = useMemo(
    () => [...new Set(logs.map((log) => log.resource))],
    [logs],
  );

  const uniqueActions = useMemo(
    () => [...new Set(logs.map((log) => log.action))],
    [logs],
  );

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        searchTerm === "" ||
        log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resourceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction =
        filterAction === "all" || log.action === filterAction;
      const matchesResource =
        filterResource === "all" || log.resource === filterResource;
      const matchesAdmin =
        filterAdmin === "all" || log.adminName === filterAdmin;

      return matchesSearch && matchesAction && matchesResource && matchesAdmin;
    });
  }, [logs, searchTerm, filterAction, filterResource, filterAdmin]);

  const handleExportLogs = () => {
    const csv = [
      [
        "Timestamp",
        "Admin",
        "Action",
        "Resource",
        "Details",
        "IP Address",
        "Status",
      ],
      ...filteredLogs.map((log) => [
        log.timestamp,
        log.adminName,
        log.action,
        log.resource,
        log.details,
        log.ipAddress,
        log.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className='space-y-6'>
      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Audit Logs
          </CardTitle>
          <CardDescription>
            Track all admin actions and system events
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div>
              <label className='text-sm font-medium'>Search</label>
              <Input
                placeholder='Search by admin, resource, or action...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className='text-sm font-medium'>Action</label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='text-sm font-medium'>Resource</label>
              <Select value={filterResource} onValueChange={setFilterResource}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Resources</SelectItem>
                  {uniqueResources.map((resource) => (
                    <SelectItem key={resource} value={resource}>
                      {resource}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='text-sm font-medium'>Admin</label>
              <Select value={filterAdmin} onValueChange={setFilterAdmin}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Admins</SelectItem>
                  {uniqueAdmins.map((admin) => (
                    <SelectItem key={admin} value={admin}>
                      {admin}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={handleExportLogs}
              className='gap-2'
            >
              <Download className='h-4 w-4' />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Log Records</CardTitle>
          <CardDescription>
            {filteredLogs.length} of {logs.length} logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='relative w-full overflow-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b'>
                  <th className='h-12 px-4 text-left align-middle font-medium'>
                    Timestamp
                  </th>
                  <th className='h-12 px-4 text-left align-middle font-medium'>
                    Admin
                  </th>
                  <th className='h-12 px-4 text-left align-middle font-medium'>
                    Action
                  </th>
                  <th className='h-12 px-4 text-left align-middle font-medium'>
                    Resource
                  </th>
                  <th className='h-12 px-4 text-left align-middle font-medium'>
                    Details
                  </th>
                  <th className='h-12 px-4 text-left align-middle font-medium'>
                    IP Address
                  </th>
                  <th className='h-12 px-4 text-left align-middle font-medium'>
                    Status
                  </th>
                  <th className='h-12 px-4 text-left align-middle font-medium'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => {
                    const actionColor =
                      actionColors[log.action] || actionColors.VIEW;
                    return (
                      <tr key={log.id} className='border-b hover:bg-muted/50'>
                        <td className='h-12 px-4 align-middle text-xs'>
                          {log.timestamp}
                        </td>
                        <td className='h-12 px-4 align-middle font-medium'>
                          {log.adminName}
                        </td>
                        <td className='h-12 px-4 align-middle'>
                          <span
                            className={cn(
                              "px-2 py-1 rounded text-xs font-semibold",
                              actionColor.bg,
                              actionColor.text,
                            )}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className='h-12 px-4 align-middle font-mono text-xs'>
                          {log.resource}
                        </td>
                        <td className='h-12 px-4 align-middle text-sm'>
                          {log.details}
                        </td>
                        <td className='h-12 px-4 align-middle text-xs font-mono'>
                          {log.ipAddress}
                        </td>
                        <td className='h-12 px-4 align-middle'>
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-semibold",
                              log.status === "success"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                            )}
                          >
                            {log.status === "success" ? "Success" : "Failed"}
                          </span>
                        </td>
                        <td className='h-12 px-4 align-middle'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => {
                              setSelectedLog(log);
                              setShowDetails(true);
                            }}
                          >
                            <Eye className='h-4 w-4' />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className='h-24 text-center text-muted-foreground'
                    >
                      No logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      {showDetails && selectedLog && (
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0'>
            <CardTitle>Log Details</CardTitle>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowDetails(false)}
            >
              ✕
            </Button>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-semibold text-muted-foreground'>
                  Timestamp
                </label>
                <p className='text-sm'>{selectedLog.timestamp}</p>
              </div>
              <div>
                <label className='text-sm font-semibold text-muted-foreground'>
                  Admin
                </label>
                <p className='text-sm'>{selectedLog.adminName}</p>
              </div>
              <div>
                <label className='text-sm font-semibold text-muted-foreground'>
                  Action
                </label>
                <p className='text-sm'>{selectedLog.action}</p>
              </div>
              <div>
                <label className='text-sm font-semibold text-muted-foreground'>
                  Resource
                </label>
                <p className='text-sm'>
                  {selectedLog.resource} ({selectedLog.resourceId})
                </p>
              </div>
              <div className='col-span-2'>
                <label className='text-sm font-semibold text-muted-foreground'>
                  Details
                </label>
                <p className='text-sm'>{selectedLog.details}</p>
              </div>
              <div>
                <label className='text-sm font-semibold text-muted-foreground'>
                  IP Address
                </label>
                <p className='text-sm font-mono'>{selectedLog.ipAddress}</p>
              </div>
              <div>
                <label className='text-sm font-semibold text-muted-foreground'>
                  Status
                </label>
                <p className='text-sm capitalize'>{selectedLog.status}</p>
              </div>
              {selectedLog.changesBefore && (
                <div className='col-span-2'>
                  <label className='text-sm font-semibold text-muted-foreground'>
                    Changes
                  </label>
                  <div className='grid grid-cols-2 gap-4 mt-2'>
                    <div className='bg-red-50 dark:bg-red-950/20 p-3 rounded text-xs'>
                      <p className='font-semibold text-red-900 dark:text-red-200 mb-1'>
                        Before
                      </p>
                      <p className='text-red-800 dark:text-red-300'>
                        {selectedLog.changesBefore}
                      </p>
                    </div>
                    <div className='bg-green-50 dark:bg-green-950/20 p-3 rounded text-xs'>
                      <p className='font-semibold text-green-900 dark:text-green-200 mb-1'>
                        After
                      </p>
                      <p className='text-green-800 dark:text-green-300'>
                        {selectedLog.changesAfter}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
