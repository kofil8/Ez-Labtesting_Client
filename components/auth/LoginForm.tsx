"use client";

import { Button } from "@/components/ui/button";
import { Captcha } from "@/components/ui/captcha";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { LoginFormData, loginSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
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
      const result = await login(data.email, data.password, captchaToken);
      const fromParam = searchParams.get("from");
      const safeFrom =
        fromParam && fromParam.startsWith("/") && !fromParam.startsWith("//")
          ? fromParam
          : null;

      if (result.requiresMFA) {
        // Preserve the original destination through the MFA step
        router.push(safeFrom ? `/mfa?from=${encodeURIComponent(safeFrom)}` : "/mfa");
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        router.push(safeFrom || "/results");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid email or password.";
      toast({
        title: "Login failed",
        description: errorMessage,
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

          <div className='text-sm'>
            <Link
              href='/forgot-password'
              className='text-primary hover:underline'
            >
              Forgot password?
            </Link>
          </div>

          <Captcha
            ref={recaptchaRef}
            onChange={handleCaptchaChange}
            onExpired={handleCaptchaExpired}
          />
        </CardContent>

        <CardFooter className='flex flex-col space-y-4'>
          <Button
            type='submit'
            disabled={loading || !captchaToken}
            className='w-full'
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <p className='text-sm text-center text-muted-foreground'>
            Don&apos;t have an account?{" "}
            <Link
              href={(() => {
                const fromParam = searchParams.get("from");
                const safeFrom =
                  fromParam && fromParam.startsWith("/") && !fromParam.startsWith("//")
                    ? fromParam
                    : null;
                return safeFrom
                  ? `/signup?from=${encodeURIComponent(safeFrom)}`
                  : "/signup";
              })()}
              className='text-primary hover:underline'
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
