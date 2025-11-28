"use client";

import { registerUser } from "@/app/actions/register-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hook/use-toast";
import { SignupFormData, signupSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast: toastHook } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const handleAction = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      try {
        const res = await registerUser(formData);
        if (res?.success) {
          toast.success(
            "Account created! Please verify your email to activate your account."
          );
          const email = res.email || (formData.get("email") as string);
          // Store email in sessionStorage for OTP verification
          if (typeof window !== "undefined") {
            sessionStorage.setItem("otp_email", email);
          }
          setTimeout(() => {
            router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
          }, 1000);
        }
      } catch (err: any) {
        const errorMessage =
          err.message || "Unable to create account. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  const onSubmit = async (data: SignupFormData) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.phone) {
      formData.append("phoneNumber", data.phone);
    }
    handleAction(formData);
  };

  // TODO: Re-enable reCAPTCHA handlers
  // const handleCaptchaChange = (token: string | null) => {
  //   setCaptchaToken(token);
  // };

  // const handleCaptchaExpired = () => {
  //   setCaptchaToken(null);
  //   toast({
  //     title: "Verification expired",
  //     description: "Please complete the captcha again.",
  //     variant: "destructive",
  //   });
  // };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='pt-6 space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='firstName' className='text-sm'>
                First Name
              </Label>
              <Input
                id='firstName'
                placeholder='John'
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className='text-xs sm:text-sm text-destructive mt-1'>
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor='lastName' className='text-sm'>
                Last Name
              </Label>
              <Input
                id='lastName'
                placeholder='Doe'
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className='text-xs sm:text-sm text-destructive mt-1'>
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='your@email.com'
              {...register("email")}
            />
            {errors.email && (
              <p className='text-sm text-destructive mt-1'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor='phone'>Phone (optional)</Label>
            <Input id='phone' placeholder='5551234567' {...register("phone")} />
            {errors.phone && (
              <p className='text-sm text-destructive mt-1'>
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              type='password'
              placeholder='••••••••'
              {...register("password")}
            />
            {errors.password && (
              <p className='text-sm text-destructive mt-1'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <Input
              id='confirmPassword'
              type='password'
              placeholder='••••••••'
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className='text-sm text-destructive mt-1'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* TODO: Re-enable reCAPTCHA */}
          {/* <Captcha
            ref={recaptchaRef}
            onChange={handleCaptchaChange}
            onExpired={handleCaptchaExpired}
          /> */}
        </CardContent>

        <CardFooter className='flex flex-col space-y-4'>
          {error && (
            <p className='text-sm text-destructive text-center'>{error}</p>
          )}
          <Button type='submit' disabled={isPending} className='w-full'>
            {isPending ? "Creating account..." : "Create Account"}
          </Button>

          <p className='text-sm text-center text-muted-foreground'>
            Already have an account?{" "}
            <Link
              href={(() => {
                const fromParam = searchParams.get("from");
                const safeFrom =
                  fromParam &&
                  fromParam.startsWith("/") &&
                  !fromParam.startsWith("//")
                    ? fromParam
                    : null;
                return safeFrom
                  ? `/login?from=${encodeURIComponent(safeFrom)}`
                  : "/login";
              })()}
              className='text-primary hover:underline'
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
