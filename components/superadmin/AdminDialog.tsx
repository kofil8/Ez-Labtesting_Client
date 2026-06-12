"use client";

import {
  AccountStatus,
  AdminRecord,
  ManagedAdminRole,
} from "@/app/actions/superadmin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hook/use-toast";
import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  role: ManagedAdminRole;
  status: AccountStatus;
};

type AdminDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormState) => void;
  isSaving: boolean;
  admin: AdminRecord | null;
};

export function AdminDialog({
  isOpen,
  onClose,
  onSave,
  isSaving,
  admin,
}: AdminDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "ADMIN",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (admin) {
      setFormData({
        firstName: admin.firstName ?? "",
        lastName: admin.lastName ?? "",
        email: admin.email,
        phoneNumber: admin.phoneNumber ?? "",
        role: admin.role === "LAB_PARTNER" ? "LAB_PARTNER" : "ADMIN",
        status: admin.status,
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "ADMIN",
        status: "ACTIVE",
      });
    }
  }, [admin, isOpen]);

  const handleGenerateTempPassword = async () => {
    // For new admins, use client-side generation (server endpoint requires existing admin ID)
    if (!admin) {
      // Server-side generation will happen via the temp-password endpoint after admin is created
      // For now, generate locally but with crypto-safe randomness
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      const array = new Uint32Array(12);
      crypto.getRandomValues(array);
      let password = "";
      for (let i = 0; i < 12; i++) {
        password += chars[array[i] % chars.length];
      }
      setFormData((prev) => ({ ...prev, password }));
      toast({ title: "Temporary password generated" });
      return;
    }

    // Generation for existing admins was removed by design.
    // Temporary passwords are only generated when creating a new account.
    if (admin) {
      toast({
        title: "Not available",
        description:
          "Generate temporary passwords only when creating a new account",
        variant: "default",
      });
      return;
    }
  };

  const handleSubmit = () => {
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const phoneNumber = formData.phoneNumber.trim();
    if (!firstName || !lastName || !formData.email || !phoneNumber) {
      toast({
        title: "Missing fields",
        description:
          "First name, last name, phone number, and email are required",
        variant: "destructive",
      });
      return;
    }
    if (!admin && !formData.password) {
      toast({
        title: "Missing fields",
        description: "Password is required for new accounts",
        variant: "destructive",
      });
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {admin ? "Edit Account" : "Create New Account"}
          </DialogTitle>
          <DialogDescription>
            {admin
              ? "Update admin or lab partner information"
              : "Add a new admin or lab partner to the system"}
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='firstName'>First Name</Label>
            <Input
              id='firstName'
              placeholder='John'
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor='lastName'>Last Name</Label>
            <Input
              id='lastName'
              placeholder='Doe'
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor='phoneNumber'>Phone Number</Label>
            <Input
              id='phoneNumber'
              type='tel'
              placeholder='+1 555 000 0000'
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='john@example.com'
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          {!admin && (
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>Password</Label>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='gap-2'
                  onClick={handleGenerateTempPassword}
                >
                  <RefreshCw className='h-4 w-4' />
                  Generate temporary password
                </Button>
              </div>
              <Input
                id='password'
                type='text'
                placeholder='Auto-generate or type manually'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {formData.password && (
                <div className='flex items-center gap-2 text-xs'>
                  <code className='rounded bg-muted px-2 py-1 flex-1'>
                    {formData.password}
                  </code>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(formData.password!);
                        toast({ title: "Copied to clipboard" });
                      } catch (error: any) {
                        toast({
                          title: "Copy failed",
                          description: error.message || "Please copy manually",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Copy
                  </Button>
                </div>
              )}
            </div>
          )}
          <div>
            <Label htmlFor='role'>Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  role: value as ManagedAdminRole,
                })
              }
            >
              <SelectTrigger id='role'>
                <SelectValue placeholder='Select role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ADMIN'>Admin</SelectItem>
                <SelectItem value='LAB_PARTNER'>Lab Partner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {admin && (
            <div>
              <Label htmlFor='status'>Account Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as AccountStatus,
                  })
                }
              >
                <SelectTrigger id='status'>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ACTIVE'>Active</SelectItem>
                  <SelectItem value='DISABLED'>Disabled</SelectItem>
                  <SelectItem value='BLOCKED'>Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className='w-full bg-red-600 hover:bg-red-700'
          >
            {isSaving ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : admin ? (
              "Update Account"
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
