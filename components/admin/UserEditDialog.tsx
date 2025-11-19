"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/types/user";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (user: User) => void;
}

export function UserEditDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: UserEditDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<User>({
    defaultValues: {
      role: "customer",
      mfaEnabled: false,
    },
  });

  const role = watch("role");
  const mfaEnabled = watch("mfaEnabled");

  useEffect(() => {
    if (user) {
      reset(user);
    } else {
      reset({
        id: "",
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        dateOfBirth: "",
        role: "customer",
        createdAt: new Date().toISOString(),
        mfaEnabled: false,
      } as Partial<User> as User);
    }
  }, [user, reset]);

  const onSubmit = (data: User) => {
    const userData: User = {
      ...data,
      id: user?.id || `user-${Date.now()}`,
      createdAt: user?.createdAt || new Date().toISOString(),
    };
    onSave(userData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto pb-0'>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {user
              ? "Update user information and permissions"
              : "Create a new user account"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='firstName'>First Name *</Label>
              <Input
                id='firstName'
                {...register("firstName", { required: true })}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='lastName'>Last Name *</Label>
              <Input
                id='lastName'
                {...register("lastName", { required: true })}
              />
            </div>

            <div className='col-span-2 space-y-2'>
              <Label htmlFor='email'>Email *</Label>
              <Input
                id='email'
                type='email'
                {...register("email", { required: true })}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phone'>Phone</Label>
              <Input
                id='phone'
                type='tel'
                {...register("phone")}
                placeholder='(555) 123-4567'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='dateOfBirth'>Date of Birth</Label>
              <Input
                id='dateOfBirth'
                type='date'
                {...register("dateOfBirth")}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='role'>Role *</Label>
              <Select
                value={role}
                onValueChange={(value: "customer" | "admin") =>
                  setValue("role", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='customer'>Customer</SelectItem>
                  <SelectItem value='admin'>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='col-span-2 flex items-center space-x-2'>
              <Checkbox
                id='mfaEnabled'
                checked={mfaEnabled}
                onCheckedChange={(checked) =>
                  setValue("mfaEnabled", checked as boolean)
                }
              />
              <Label htmlFor='mfaEnabled' className='font-normal cursor-pointer'>
                Enable Multi-Factor Authentication
              </Label>
            </div>
          </div>

          <DialogFooter className='pt-4 pb-6'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type='submit'>
              {user ? "Update" : "Create"} User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

