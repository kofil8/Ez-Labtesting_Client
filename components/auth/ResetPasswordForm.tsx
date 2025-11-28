"use client";

import { resetPassword } from "@/app/actions/reset-password";
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
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const router = useRouter();
  const { toast: toastHook } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  // Get email from sessionStorage (set during forgot password flow)
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const resetEmail = sessionStorage.getItem("reset_email");
      if (resetEmail) {
        setEmail(resetEmail);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email, setValue]);

  const handleAction = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      try {
        const res = await resetPassword(formData);
        if (res?.success) {
          toast.success(
            "Your password has been successfully reset. You can now login with your new password."
          );
          // Clear reset email from sessionStorage
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("reset_email");
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

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email) {
      toast.error(
        "Please start the password reset process from the forgot password page."
      );
      router.push("/forgot-password");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", data.otp);
    formData.append("newPassword", data.password);
    handleAction(formData);
  };

  if (!email) {
    return (
      <Card className='border-2 shadow-lg'>
        <CardHeader>
          <CardTitle className='text-2xl'>Email required</CardTitle>
          <CardDescription className='text-base'>
            Please start the password reset process from the forgot password
            page.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link
            href='/forgot-password'
            className='text-primary hover:underline font-medium'
          >
            Go to forgot password
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
          Enter the OTP code sent to your email and create a new password.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          {error && (
            <p className='text-sm text-destructive text-center'>{error}</p>
          )}
          <div>
            <Label htmlFor='email' className='text-base'>
              Email
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='your@email.com'
              disabled
              {...register("email")}
              value={email || ""}
              className='h-11 text-base bg-muted'
            />
            <p className='text-xs text-muted-foreground mt-1'>
              The email address where you received the OTP code.
            </p>
          </div>

          <div>
            <Label htmlFor='otp' className='text-base'>
              OTP Code
            </Label>
            <Input
              id='otp'
              type='text'
              placeholder='123456'
              maxLength={6}
              {...register("otp")}
              className='text-center text-2xl font-bold tracking-widest h-14'
            />
            {errors.otp && (
              <p className='text-sm text-destructive mt-1'>
                {errors.otp.message}
              </p>
            )}
            <p className='text-xs text-muted-foreground mt-1'>
              Enter the 6-digit code sent to your email.
            </p>
          </div>

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
            Didn&apos;t receive the code?{" "}
            <Link
              href='/forgot-password'
              className='text-primary hover:underline font-medium'
            >
              Request a new one
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
