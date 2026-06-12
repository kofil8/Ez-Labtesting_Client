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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Download, Eye, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

const actionColors: Record<string, { bg: string; text: string }> = {
  CREATE: { bg: "bg-green-100", text: "text-green-800 dark:text-green-200" },
  UPDATE: { bg: "bg-blue-100", text: "text-blue-800 dark:text-blue-200" },
  DELETE: { bg: "bg-red-100", text: "text-red-800 dark:text-red-200" },
  VIEW: { bg: "bg-gray-100", text: "text-gray-800 dark:text-gray-200" },
};

const LOGS_PER_PAGE = 50;

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterResource, setFilterResource] = useState("all");
  const [filterAdmin, setFilterAdmin] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  const fetchLogs = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        limit: String(LOGS_PER_PAGE),
        offset: String((page - 1) * LOGS_PER_PAGE),
      });
      if (filterAction !== "all") params.set("action", filterAction);
      if (filterResource !== "all") params.set("resource", filterResource);
      if (filterAdmin !== "all") params.set("adminId", filterAdmin);

      const response = await fetch(
        `/api/v1/superadmin/audit-logs?${params.toString()}`,
        { headers: { "Content-Type": "application/json" } },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs (HTTP ${response.status})`);
      }

      const data = await response.json();
      const fetchedLogs = (data?.data?.logs as AuditLog[]) || [];
      const total =
        typeof data?.data?.total === "number"
          ? data.data.total
          : fetchedLogs.length;

      setLogs(fetchedLogs);
      setTotalLogs(total);
    } catch (err: any) {
      setError(err?.message || "Failed to load audit logs");
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Re-fetch when filters change (resets to page 1)
  const handleFilterChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) => {
    setter(value);
    setCurrentPage(1);
    setTotalLogs(0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs(1);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterAction, filterResource, filterAdmin]);

  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logs;
    const lower = searchTerm.toLowerCase();
    return logs.filter(
      (log) =>
        log.adminName.toLowerCase().includes(lower) ||
        log.resource.toLowerCase().includes(lower) ||
        log.resourceId.toLowerCase().includes(lower) ||
        log.details.toLowerCase().includes(lower),
    );
  }, [logs, searchTerm]);

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

  const handleExportLogs = () => {
    const sanitizeCSVField = (value: string) => {
      if (!value) return "";
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csv = [
      ["Timestamp", "Admin", "Action", "Resource", "Details", "Status"],
      ...filteredLogs.map((log) => [
        log.timestamp,
        log.adminName,
        log.action,
        log.resource,
        log.details,
        log.status,
      ]),
    ]
      .map((row) => row.map(sanitizeCSVField).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(totalLogs / LOGS_PER_PAGE) || 1;
  const displayCount =
    totalLogs > 0
      ? `${(currentPage - 1) * LOGS_PER_PAGE + 1}–${Math.min(
          currentPage * LOGS_PER_PAGE,
          totalLogs,
        )} of ${totalLogs}`
      : "0";

  return (
    <div className='space-y-6'>
      {/* Filters Card */}
      <Card>
        <CardHeader className='flex flex-row items-center gap-2'>
          <Filter className='h-5 w-5' />
          <div>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>
              Track all admin actions and system events
            </CardDescription>
          </div>
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
              <Select
                value={filterAction}
                onValueChange={(v) => handleFilterChange(setFilterAction, v)}
              >
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
              <Select
                value={filterResource}
                onValueChange={(v) => handleFilterChange(setFilterResource, v)}
              >
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
              <Select
                value={filterAdmin}
                onValueChange={(v) => handleFilterChange(setFilterAdmin, v)}
              >
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
          <div className='flex justify-between items-center'>
            <p className='text-xs text-muted-foreground'>{displayCount}</p>
            <Button
              variant='outline'
              onClick={handleExportLogs}
              className='gap-2'
              disabled={isLoading}
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
            {filteredLogs.length} {filteredLogs.length === 1 ? "log" : "logs"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='space-y-2'>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className='flex items-center space-x-4 py-2'>
                  <Skeleton className='h-4 w-[120px]' />
                  <Skeleton className='h-4 w-[80px]' />
                  <Skeleton className='h-4 w-[100px]' />
                  <Skeleton className='h-4 w-[60px]' />
                  <Skeleton className='h-4 w-[40px]' />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className='space-y-3'>
              <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
              <Button variant='outline' onClick={() => fetchLogs(currentPage)}>
                Retry
              </Button>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className='h-24 flex items-center justify-center text-muted-foreground'>
              No logs found
            </div>
          ) : (
            <>
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
                        Status
                      </th>
                      <th className='h-12 px-4 text-left align-middle font-medium'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => {
                      const actionColor =
                        actionColors[log.action] || actionColors.VIEW;
                      return (
                        <tr key={log.id} className='border-b hover:bg-muted/50'>
                          <td className='h-12 px-4 align-middle text-xs'>
                            {new Date(log.timestamp).toLocaleString()}
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
                              role='status'
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className='h-12 px-4 align-middle font-mono text-xs'>
                            {log.resource}
                          </td>
                          <td className='h-12 px-4 align-middle text-sm max-w-[300px] truncate'>
                            {log.details}
                          </td>
                          <td className='h-12 px-4 align-middle'>
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-semibold",
                                log.status === "success"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                              )}
                              role='status'
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
                              aria-label={`View details for log ${log.id}`}
                            >
                              <Eye className='h-4 w-4' />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className='mt-4 flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between'>
                <div>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={currentPage <= 1 || isLoading}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    aria-label='Previous page'
                  >
                    <ChevronLeft className='h-4 w-4' />
                    Previous
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={
                      currentPage >= totalPages ||
                      isLoading ||
                      logs.length < LOGS_PER_PAGE
                    }
                    onClick={() => setCurrentPage((p) => p + 1)}
                    aria-label='Next page'
                  >
                    Next
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </>
          )}
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
                <p className='text-sm'>
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </p>
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
