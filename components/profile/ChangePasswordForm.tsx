"use client";

import { changePassword } from "@/app/actions/change-password";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hook/use-toast";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const { toast: toastHook } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleAction = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      try {
        const res = await changePassword(formData);
        if (res?.success) {
          toast.success("Your password has been changed successfully.");
          reset();
        }
      } catch (err: any) {
        const errorMessage =
          err.message || "Current password is incorrect or an error occurred.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    const formData = new FormData();
    formData.append("oldPassword", data.currentPassword);
    formData.append("newPassword", data.newPassword);
    handleAction(formData);
  };

  return (
    <Card className='border-2 shadow-lg'>
      <CardHeader>
        <CardTitle className='text-2xl'>Change password</CardTitle>
        <CardDescription className='text-base'>
          Update your password to keep your account secure.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          {error && (
            <p className='text-sm text-destructive text-center'>{error}</p>
          )}
          <div>
            <Label htmlFor='currentPassword' className='text-base'>
              Current password
            </Label>
            <Input
              id='currentPassword'
              type='password'
              placeholder='••••••••'
              className='h-11 text-base'
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className='text-sm text-destructive mt-1'>
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor='newPassword' className='text-base'>
              New password
            </Label>
            <Input
              id='newPassword'
              type='password'
              placeholder='••••••••'
              className='h-11 text-base'
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className='text-sm text-destructive mt-1'>
                {errors.newPassword.message}
              </p>
            )}
            <p className='text-xs text-muted-foreground mt-2'>
              Must be at least 8 characters with uppercase, lowercase, and
              numbers.
            </p>
          </div>

          <div>
            <Label htmlFor='confirmPassword' className='text-base'>
              Confirm new password
            </Label>
            <Input
              id='confirmPassword'
              type='password'
              placeholder='••••••••'
              className='h-11 text-base'
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className='text-sm text-destructive mt-1'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type='submit'
            disabled={isPending}
            className='w-full h-11 text-base font-semibold'
          >
            {isPending ? "Updating password..." : "Update password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
