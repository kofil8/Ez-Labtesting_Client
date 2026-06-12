"use client";

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
import { resetPassword } from "@/lib/auth/client";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [email] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : sessionStorage.getItem("reset_email"),
  );
  const [resetToken] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : sessionStorage.getItem("reset_token"),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email || !resetToken) {
      toast.error(
        "Please verify your reset code before creating a new password.",
      );
      router.push("/forgot-password");
      return;
    }

    setError("");
    startTransition(async () => {
      try {
        const res = await resetPassword({
          resetToken,
          password: data.password,
        });

        if (res?.success) {
          toast.success(
            "Your password has been successfully reset. You can now sign in with your new password.",
          );

          if (typeof window !== "undefined") {
            sessionStorage.removeItem("reset_email");
            sessionStorage.removeItem("reset_token");
          }

          setTimeout(() => {
            router.push("/login");
          }, 1000);
        }
      } catch (err: any) {
        const errorMessage =
          err.message || "An error occurred. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  if (!email || !resetToken) {
    return (
      <Card className='border-2 shadow-lg'>
        <CardHeader>
          <CardTitle className='text-2xl'>Verification required</CardTitle>
          <CardDescription className='text-base'>
            Verify your reset code first, then continue here to create a new
            password.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link
            href='/forgot-password'
            className='text-primary hover:underline font-medium'
          >
            Start password reset
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className='border-2 shadow-lg'>
      <CardHeader>
        <CardTitle className='text-2xl'>Reset your password</CardTitle>
        <CardDescription className='text-base'>
          Create a new password for <span className='font-medium'>{email}</span>
          .
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          {error && (
            <p className='text-sm text-destructive text-center'>{error}</p>
          )}
          <div>
            <Label htmlFor='password' className='text-base'>
              New password
            </Label>
            <Input
              id='password'
              type='password'
              placeholder='••••••••'
              {...register("password")}
              className='h-11 text-base'
            />
            {errors.password && (
              <p className='text-sm text-destructive mt-1'>
                {errors.password.message}
              </p>
            )}
            <p className='text-xs text-muted-foreground mt-2'>
              Must be at least 8 characters with uppercase, lowercase, and
              numbers.
            </p>
          </div>

          <div>
            <Label htmlFor='confirmPassword' className='text-base'>
              Confirm password
            </Label>
            <Input
              id='confirmPassword'
              type='password'
              placeholder='••••••••'
              {...register("confirmPassword")}
              className='h-11 text-base'
            />
            {errors.confirmPassword && (
              <p className='text-sm text-destructive mt-1'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <Button
            type='submit'
            disabled={isPending}
            className='w-full h-11 text-base font-semibold'
          >
            {isPending ? "Resetting password..." : "Reset password"}
          </Button>
          <p className='text-sm text-center text-muted-foreground'>
            Need to verify another code?{" "}
            <Link
              href='/verify-otp?flow=reset'
              className='text-primary hover:underline font-medium'
            >
              Go back
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
