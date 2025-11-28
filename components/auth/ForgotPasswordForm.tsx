"use client";

import { forgotPassword } from "@/app/actions/forgot-password";
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
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { toast: toastHook } = useToast();
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const emailValue = watch("email");

  const handleAction = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      try {
        const res = await forgotPassword(formData);
        if (res?.success) {
          setSubmitted(true);
          const email = formData.get("email") as string;
          // Store email in sessionStorage for reset password flow
          if (typeof window !== "undefined") {
            sessionStorage.setItem("reset_email", email);
          }
          toast.success(
            "If an account exists with this email, you'll receive an OTP code to reset your password."
          );
        }
      } catch (err: any) {
        const errorMessage =
          err.message || "An error occurred. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    handleAction(formData);
  };

  if (submitted) {
    return (
      <Card className='border-2'>
        <CardHeader>
          <CardTitle className='text-2xl'>Check your email</CardTitle>
          <CardDescription className='text-base'>
            We&apos;ve sent an OTP code to <strong>{emailValue}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 p-4 text-sm'>
            <p className='mb-2 font-medium'>If you don&apos;t see the email:</p>
            <ul className='list-inside list-disc space-y-1 text-muted-foreground'>
              <li>Check your spam folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>The OTP code is valid for 10 minutes</li>
              <li>Try again in a few minutes</li>
            </ul>
          </div>
          <div className='flex justify-center'>
            <Link href='/reset-password'>
              <Button className='w-full'>Continue to Reset Password</Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <Button
            onClick={() => setSubmitted(false)}
            variant='outline'
            className='w-full'
          >
            Try another email
          </Button>
          <p className='text-sm text-center text-muted-foreground'>
            Remember your password?{" "}
            <Link
              href='/login'
              className='text-primary hover:underline font-medium'
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className='border-2 shadow-lg'>
      <CardHeader>
        <CardTitle className='text-2xl'>Forgot your password?</CardTitle>
        <CardDescription className='text-base'>
          Enter your email address and we&apos;ll send you an OTP code to reset
          it.
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
              className='h-11 text-base'
              {...register("email")}
            />
            {errors.email && (
              <p className='text-sm text-destructive mt-1'>
                {errors.email.message}
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
            {isPending ? "Sending OTP..." : "Send OTP Code"}
          </Button>
          <p className='text-sm text-center text-muted-foreground'>
            Remember your password?{" "}
            <Link
              href='/login'
              className='text-primary hover:underline font-medium'
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
