"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hook/use-toast";
import {
  verifyBackupCode as verifyBackupCodeAction,
  verifyMFA as verifyMFAAction,
} from "@/lib/auth/client";
import { getDashboardRouteForRole } from "@/lib/auth/shared";
import { useAuth } from "@/lib/auth-context";
import { AlertCircle, Key, Shield } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function MFAVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshAuth } = useAuth();

  const tempToken = searchParams.get("tempToken");
  const fromParam = searchParams.get("from");
  const safeFrom =
    fromParam && fromParam.startsWith("/") && !fromParam.startsWith("//")
      ? fromParam
      : null;
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [useBackup, setUseBackup] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleVerifyMFA = () => {
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    if (!tempToken) {
      setError("Invalid session. Please log in again.");
      return;
    }

    setError("");

    startTransition(async () => {
      const result = await verifyMFAAction(tempToken, verificationCode);

      if (!result.success) {
        setError(
          result.message || "Invalid verification code. Please try again.",
        );
        return;
      }

      toast({
        title: "Success",
        description: "Logged in successfully!",
      });

      // Refresh auth context
      const user = await refreshAuth();
      const redirect = safeFrom || getDashboardRouteForRole(user?.role);

      setTimeout(() => router.push(redirect), 500);
    });
  };

  const handleVerifyBackupCode = () => {
    if (backupCode.length < 12) {
      setError("Please enter a valid backup code");
      return;
    }

    if (!tempToken) {
      setError("Invalid session. Please log in again.");
      return;
    }

    setError("");

    startTransition(async () => {
      const result = await verifyBackupCodeAction(
        tempToken,
        backupCode.toUpperCase(),
      );

      if (!result.success) {
        setError(result.message || "Invalid backup code. Please try again.");
        return;
      }

      const remaining = result.data?.remainingBackupCodes ?? 0;
      toast({
        title: "Success",
        description: `Logged in successfully! You have ${remaining} backup codes remaining.`,
      });

      // Refresh auth context
      const user = await refreshAuth();
      const redirect = safeFrom || getDashboardRouteForRole(user?.role);

      setTimeout(() => router.push(redirect), 500);
    });
  };

  if (!tempToken) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>
          Invalid session. Please{" "}
          <a href='/login' className='underline'>
            log in again
          </a>
          .
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex items-center justify-center mb-4'>
          <div className='p-3 rounded-full bg-primary/10'>
            <Shield className='w-8 h-8 text-primary' />
          </div>
        </div>
        <CardTitle className='text-center'>Two-Factor Authentication</CardTitle>
        <CardDescription className='text-center'>
          {useBackup
            ? "Enter one of your backup codes"
            : "Enter the 6-digit code from your authenticator app"}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!useBackup ? (
          <>
            <div className='space-y-2'>
              <Label htmlFor='verificationCode'>Verification Code</Label>
              <Input
                id='verificationCode'
                type='text'
                placeholder='000000'
                maxLength={6}
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && verificationCode.length === 6) {
                    handleVerifyMFA();
                  }
                }}
                className='text-center text-2xl tracking-widest font-mono'
                autoFocus
              />
            </div>

            <Button
              onClick={handleVerifyMFA}
              disabled={isPending || verificationCode.length !== 6}
              className='w-full'
            >
              {isPending ? "Verifying..." : "Verify"}
            </Button>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or
                </span>
              </div>
            </div>

            <Button
              variant='outline'
              onClick={() => setUseBackup(true)}
              className='w-full'
              type='button'
            >
              <Key className='w-4 h-4 mr-2' />
              Use Backup Code
            </Button>
          </>
        ) : (
          <>
            <div className='space-y-2'>
              <Label htmlFor='backupCode'>Backup Code</Label>
              <Input
                id='backupCode'
                type='text'
                placeholder='XXXXXXXXXXXX'
                value={backupCode}
                onChange={(e) => {
                  setBackupCode(e.target.value.toUpperCase());
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && backupCode.length >= 12) {
                    handleVerifyBackupCode();
                  }
                }}
                className='text-center text-xl tracking-wider font-mono'
                autoFocus
              />
              <p className='text-xs text-muted-foreground'>
                Each backup code can only be used once
              </p>
            </div>

            <Button
              onClick={handleVerifyBackupCode}
              disabled={isPending || backupCode.length < 12}
              className='w-full'
            >
              {isPending ? "Verifying..." : "Verify Backup Code"}
            </Button>

            <Button
              variant='ghost'
              onClick={() => setUseBackup(false)}
              className='w-full'
              type='button'
            >
              Back to Authenticator Code
            </Button>
          </>
        )}

        <div className='text-center text-sm text-muted-foreground'>
          <a href='/login' className='hover:underline'>
            Back to Login
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
