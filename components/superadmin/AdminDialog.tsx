"use client";

import { AdminRecord, AdminRole } from "@/app/actions/superadmin";
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
import { Loader2, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";

export type FormState = {
  name: string;
  email: string;
  password?: string;
  role: AdminRole;
};

type AdminDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormState) => void;
  isSaving: boolean;
  admin: AdminRecord | null;
};

function generateLocalTempPassword() {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*";
  const all = uppercase + lowercase + numbers + special;
  let password = "";
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  for (let i = password.length; i < 12; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

function formatName(admin: AdminRecord) {
  if (admin.firstName || admin.lastName) {
    return `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim();
  }
  return admin.email;
}

export function AdminDialog({
  isOpen,
  onClose,
  onSave,
  isSaving,
  admin,
}: AdminDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });
  const [generatedTempPassword, setGeneratedTempPassword] = useState("");

  useEffect(() => {
    if (admin) {
      setFormData({
        name: formatName(admin),
        email: admin.email,
        role: admin.role,
        password: "",
      });
    } else {
      setFormData({ name: "", email: "", password: "", role: "ADMIN" });
    }
    setGeneratedTempPassword("");
  }, [admin, isOpen]);

  const handleGenerateTempPassword = () => {
    const temp = generateLocalTempPassword();
    setFormData((prev) => ({ ...prev, password: temp }));
    setGeneratedTempPassword(temp);
    toast({ title: "Temporary password generated" });
  };

  const handleCopyTempPassword = async () => {
    if (!generatedTempPassword) return;
    try {
      await navigator.clipboard.writeText(generatedTempPassword);
      toast({ title: "Copied to clipboard" });
    } catch (error: any) {
      toast({
        title: "Copy failed",
        description: error.message || "Please copy manually",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    const trimmedName = formData.name.trim();
    if (!trimmedName || !formData.email) {
      toast({
        title: "Missing fields",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }
    if (!admin && !formData.password) {
      toast({
        title: "Missing fields",
        description: "Password is required for new admins",
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
          <DialogTitle>{admin ? "Edit Admin" : "Create New Admin"}</DialogTitle>
          <DialogDescription>
            {admin
              ? "Update administrator information"
              : "Add a new administrator to the system"}
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='name'>Full Name</Label>
            <Input
              id='name'
              placeholder='John Doe'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
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
                  variant='ghost'
                  size='sm'
                  className='gap-2'
                  onClick={handleGenerateTempPassword}
                >
                  <Wand2 className='h-4 w-4' />
                  Generate temp
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
              {generatedTempPassword && (
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <span>Temp password:</span>
                  <code className='rounded bg-muted px-2 py-1'>
                    {generatedTempPassword}
                  </code>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleCopyTempPassword}
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
                  role: value as "ADMIN" | "SUPER_ADMIN",
                })
              }
            >
              <SelectTrigger id='role'>
                <SelectValue placeholder='Select role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ADMIN'>Admin</SelectItem>
                <SelectItem value='SUPER_ADMIN'>Superadmin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {admin && (
            <div className='flex items-center justify-between rounded-md border p-3 text-sm'>
              <div>
                <p className='font-semibold'>Temporary password</p>
                <p className='text-muted-foreground'>
                  Generate and share with this admin
                </p>
                {generatedTempPassword && (
                  <div className='mt-2 flex items-center gap-2'>
                    <code className='rounded bg-muted px-2 py-1 text-xs'>
                      {generatedTempPassword}
                    </code>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleCopyTempPassword}
                    >
                      Copy
                    </Button>
                  </div>
                )}
              </div>
              <Button
                variant='outline'
                size='sm'
                className='gap-2'
                onClick={handleGenerateTempPassword}
              >
                <Wand2 className='h-4 w-4' />
                Generate
              </Button>
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
              "Update Admin"
            ) : (
              "Create Admin"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
