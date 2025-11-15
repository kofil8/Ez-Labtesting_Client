"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { SignupFormData, signupSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Captcha } from "@/components/ui/captcha";
import ReCAPTCHA from "react-google-recaptcha";

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    if (!captchaToken) {
      toast({
        title: "Verification required",
        description: "Please complete the captcha verification.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      toast({
        title: "Account created!",
        description: "Welcome to Ez LabTesting.",
      });
      router.push("/tests");
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Unable to create account. Please try again.",
        variant: "destructive",
      });
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleCaptchaExpired = () => {
    setCaptchaToken(null);
    toast({
      title: "Verification expired",
      description: "Please complete the captcha again.",
      variant: "destructive",
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='pt-6 space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='firstName' className='text-sm'>First Name</Label>
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
              <Label htmlFor='lastName' className='text-sm'>Last Name</Label>
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

          <Captcha
            ref={recaptchaRef}
            onChange={handleCaptchaChange}
            onExpired={handleCaptchaExpired}
          />
        </CardContent>

        <CardFooter className='flex flex-col space-y-4'>
          <Button type='submit' disabled={loading || !captchaToken} className='w-full'>
            {loading ? "Creating account..." : "Create Account"}
          </Button>

          <p className='text-sm text-center text-muted-foreground'>
            Already have an account?{" "}
            <Link href='/login' className='text-primary hover:underline'>
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
