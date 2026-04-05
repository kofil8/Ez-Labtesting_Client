"use client";

import {
  AdminRecord,
  createAdminAction,
  deleteAdminAction,
  getAdminsAction,
  updateAdminAction,
} from "@/app/actions/superadmin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hook/use-toast";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminDialog, FormState } from "./AdminDialog";
import { AdminTable } from "./AdminTable";
import { DeleteAdminDialog } from "./DeleteAdminDialog";

type PaginationState = {
  page: number;
  limit: number;
  pages: number;
  total: number;
};

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(" ");
  const firstName = parts.shift() || "";
  const lastName = parts.join(" ") || "";
  return { firstName, lastName };
}

export function AdminManagement() {
  const { toast } = useToast();
  const router = useRouter();

  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminRecord | null>(null);
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    pages: 1,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadAdmins = useCallback(
    async (page = pagination.page, limit = pagination.limit) => {
      setIsLoading(true);
      try {
        const result = await getAdminsAction(page, limit);

        if (!result.ok) {
          throw new Error(result.message);
        }

        if (result.data) {
          setAdmins(result.data.admins);
          setPagination(result.data.pagination);
        }
      } catch (error: any) {
        if (error.message?.includes("Session expired")) {
          toast({
            title: "Session expired",
            description: "Please log in again",
            variant: "destructive",
          });
          router.push("/login?expired=true");
          return;
        }

        toast({
          title: "Failed to load admins",
          description: error.message || "Please try again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.page, pagination.limit, toast, router],
  );

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handleSaveAdmin = async (data: FormState) => {
    const { firstName, lastName } = splitName(data.name);
    setIsSaving(true);
    try {
      const result = editingAdmin
        ? await updateAdminAction(editingAdmin.id, {
            firstName,
            lastName,
            email: data.email.trim(),
            role: data.role,
          })
        : await createAdminAction({
            firstName,
            lastName,
            email: data.email.trim(),
            password: data.password!,
            role: data.role,
          });

      if (!result.ok) {
        throw new Error(result.message);
      }

      toast({ title: editingAdmin ? "Admin updated" : "Admin created" });
      setIsDialogOpen(false);
      setEditingAdmin(null);
      await loadAdmins(1, pagination.limit);
    } catch (error: any) {
      if (error.message?.includes("Session expired")) {
        router.push("/login?expired=true");
        return;
      }
      toast({
        title: `Failed to ${editingAdmin ? "update" : "create"} admin`,
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!deletingAdminId) return;

    setBusyId(deletingAdminId);
    try {
      const result = await deleteAdminAction(deletingAdminId);

      if (!result.ok) {
        throw new Error(result.message);
      }

      toast({ title: "Admin deleted" });
      setDeletingAdminId(null);
      await loadAdmins(pagination.page, pagination.limit);
    } catch (error: any) {
      if (error.message?.includes("Session expired")) {
        router.push("/login?expired=true");
        return;
      }
      toast({
        title: "Failed to delete",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleEditAdmin = (admin: AdminRecord) => {
    setEditingAdmin(admin);
    setIsDialogOpen(true);
  };

  const handleCreateAdmin = () => {
    setEditingAdmin(null);
    setIsDialogOpen(true);
  };

  const toggleAdminStatus = async (id: string) => {
    const admin = admins.find((a) => a.id === id);
    if (!admin) return;
    setBusyId(id);
    try {
      const result = await updateAdminAction(id, { isActive: !admin.isActive });

      if (!result.ok) {
        throw new Error(result.message);
      }

      if (result.data) {
        const updatedAdmin = result.data;
        setAdmins((prev) => prev.map((a) => (a.id === id ? updatedAdmin : a)));
        toast({
          title: updatedAdmin.isActive
            ? "Admin activated"
            : "Admin deactivated",
        });
      }
    } catch (error: any) {
      if (error.message?.includes("Session expired")) {
        router.push("/login?expired=true");
        return;
      }
      toast({
        title: "Failed to update status",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  const totalAdminsText = useMemo(() => {
    if (!pagination.total) return "0 administrators";
    return `${pagination.total} administrator${
      pagination.total === 1 ? "" : "s"
    } in the system`;
  }, [pagination.total]);

  const handlePageChange = (page: number) => {
    setPagination((p) => ({ ...p, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination((p) => ({ ...p, limit, page: 1 }));
  };

  const deletingAdmin = admins.find((a) => a.id === deletingAdminId);

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>Admin User Management</CardTitle>
            <CardDescription>
              Create and manage administrator accounts
            </CardDescription>
          </div>
          <Button
            className='gap-2 bg-red-600 hover:bg-red-700'
            onClick={handleCreateAdmin}
          >
            <Plus className='h-4 w-4' />
            Create Admin
          </Button>
        </CardHeader>
      </Card>

      <AdminDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingAdmin(null);
        }}
        onSave={handleSaveAdmin}
        isSaving={isSaving}
        admin={editingAdmin}
      />

      {deletingAdmin && (
        <DeleteAdminDialog
          isOpen={!!deletingAdminId}
          onClose={() => setDeletingAdminId(null)}
          onConfirm={handleDeleteAdmin}
          isDeleting={busyId === deletingAdminId}
          adminName={`${deletingAdmin.firstName} ${deletingAdmin.lastName}`}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Active Admins</CardTitle>
          <CardDescription>{totalAdminsText}</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminTable
            admins={admins}
            isLoading={isLoading}
            busyId={busyId}
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onEdit={handleEditAdmin}
            onDelete={setDeletingAdminId}
            onToggleStatus={toggleAdminStatus}
            onCreate={handleCreateAdmin}
          />
        </CardContent>
      </Card>
    </div>
  );
}
