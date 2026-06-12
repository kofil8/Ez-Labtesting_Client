"use client";

import { AdminRecord } from "@/app/actions/superadmin";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Edit, Loader2, Mail, Plus, Shield, Trash2 } from "lucide-react";

type PaginationState = {
  page: number;
  limit: number;
  pages: number;
  total: number;
};

type AdminTableProps = {
  admins: AdminRecord[];
  isLoading: boolean;
  busyId: string | null;
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (admin: AdminRecord) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onCreate: () => void;
};

function formatName(admin: AdminRecord) {
  if (admin.firstName || admin.lastName) {
    return `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim();
  }
  return admin.email;
}

function formatDate(value?: string | null) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";
  return date.toLocaleString();
}

function getStatusLabel(status: AdminRecord["status"]) {
  if (status === "DISABLED") return "Disabled";
  if (status === "BLOCKED") return "Blocked";
  return "Active";
}

function getStatusTone(status: AdminRecord["status"]) {
  if (status === "DISABLED")
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  if (status === "BLOCKED")
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
}

function getRoleLabel(role: AdminRecord["role"]) {
  if (role === "LAB_PARTNER") return "Lab Partner";
  if (role === "ADMIN") return "Admin";
  return "Super Admin";
}

function getRoleTone(role: AdminRecord["role"]) {
  if (role === "LAB_PARTNER") return "text-blue-600";
  if (role === "ADMIN") return "text-emerald-600";
  return "text-red-600";
}

export function AdminTable({
  admins,
  isLoading,
  busyId,
  pagination,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
  onToggleStatus,
  onCreate,
}: AdminTableProps) {
  const visibleAdmins = admins.filter((admin) => admin.role !== "SUPER_ADMIN");

  const renderStatusBadge = (admin: AdminRecord) => (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-semibold cursor-pointer",
        getStatusTone(admin.status),
      )}
      onClick={() => onToggleStatus(admin.id)}
    >
      {getStatusLabel(admin.status)}
    </span>
  );

  return (
    <>
      <div className='relative w-full overflow-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b'>
              <th className='h-12 px-4 text-left align-middle font-medium'>
                Name
              </th>
              <th className='h-12 px-4 text-left align-middle font-medium'>
                Email
              </th>
              <th className='h-12 px-4 text-left align-middle font-medium'>
                Phone Number
              </th>
              <th className='h-12 px-4 text-left align-middle font-medium'>
                Role
              </th>
              <th className='h-12 px-4 text-left align-middle font-medium'>
                Status
              </th>
              <th className='h-12 px-4 text-left align-middle font-medium'>
                Last Login
              </th>
              <th className='h-12 px-4 text-left align-middle font-medium'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className='h-16 px-4 text-center' colSpan={7}>
                  <div className='flex items-center justify-center gap-2 text-muted-foreground'>
                    <Loader2 className='h-4 w-4 animate-spin' /> Loading
                    admins...
                  </div>
                </td>
              </tr>
            ) : visibleAdmins.length === 0 ? (
              <tr>
                <td className='h-28 px-4' colSpan={7}>
                  <div className='flex flex-col items-center justify-center gap-3 text-center text-muted-foreground'>
                    <p>No admin or lab partner accounts found.</p>
                    <Button
                      className='gap-2 bg-red-600 hover:bg-red-700'
                      onClick={onCreate}
                    >
                      <Plus className='h-4 w-4' />
                      Create Account
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              visibleAdmins.map((admin) => (
                <tr key={admin.id} className='border-b hover:bg-muted/50'>
                  <td className='h-12 px-4 align-middle font-semibold'>
                    {formatName(admin)}
                  </td>
                  <td className='h-12 px-4 align-middle'>
                    <div className='flex items-center gap-2'>
                      <Mail className='h-4 w-4 text-muted-foreground' />
                      {admin.email}
                    </div>
                  </td>
                  <td className='h-12 px-4 align-middle'>
                    {admin.phoneNumber}
                  </td>
                  <td className='h-12 px-4 align-middle'>
                    <div className='flex items-center gap-2'>
                      <Shield
                        className={cn("h-4 w-4", getRoleTone(admin.role))}
                      />
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          getRoleTone(admin.role),
                        )}
                      >
                        {getRoleLabel(admin.role)}
                      </span>
                    </div>
                  </td>
                  <td className='h-12 px-4 align-middle'>
                    {renderStatusBadge(admin)}
                  </td>
                  <td className='h-12 px-4 align-middle text-xs text-muted-foreground'>
                    {formatDate(admin.lastLogin)}
                  </td>
                  <td className='h-12 px-4 align-middle'>
                    <div className='flex gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onEdit(admin)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onDelete(admin.id)}
                        disabled={busyId === admin.id}
                      >
                        {busyId === admin.id ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          <Trash2 className='h-4 w-4 text-red-600' />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className='mt-4 flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-3'>
          <span>
            Page {pagination.page} of {pagination.pages || 1}
          </span>
          <div className='flex items-center gap-2'>
            <span>Rows per page</span>
            <Select
              value={String(pagination.limit)}
              onValueChange={(v) => onLimitChange(Number(v))}
            >
              <SelectTrigger className='w-[90px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='5'>5</SelectItem>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='20'>20</SelectItem>
                <SelectItem value='50'>50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            disabled={pagination.page <= 1 || isLoading}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            disabled={pagination.page >= pagination.pages || isLoading}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
