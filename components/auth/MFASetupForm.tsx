"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hook/use-toast";
import { getMFAStatus, setupMFA } from "@/lib/auth/client";
import { useAuth } from "@/lib/auth-context";
import { AlertCircle, CheckCircle2, Shield, Smartphone } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

const MFAQRDisplay = dynamic(
  () =>
    import("@/components/auth/MFAQRDisplay").then((m) => ({
      default: m.MFAQRDisplay,
    })),
  { ssr: false },
);
const MFABackupCodes = dynamic(
  () =>
    import("@/components/auth/MFABackupCodes").then((m) => ({
      default: m.MFABackupCodes,
    })),
  { ssr: false },
);
const MFADisableForm = dynamic(
  () =>
    import("@/components/auth/MFADisableForm").then((m) => ({
      default: m.MFADisableForm,
    })),
  { ssr: false },
);

interface MFAStatus {
  mfaEnabled: boolean;
  mfaSetupAt: string | null;
  backupCodesCount: number;
}

export function MFASetupForm() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const isMandatory = searchParams.get("mandatory") === "true";
  const setupRequired = searchParams.get("setup") === "required";
  const setupSuggested = searchParams.get("setup") === "suggested";
  const isFirstLogin = searchParams.get("firstLogin") === "true";

  const [mfaStatus, setMfaStatus] = useState<MFAStatus | null>(null);
  const [isPending, startTransition] = useTransition();
  const [setupStep, setSetupStep] = useState<"idle" | "qr" | "complete">(
    "idle",
  );
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const fetchMFAStatus = useCallback(async () => {
    const result = await getMFAStatus();
    if (result.success && result.data) {
      setMfaStatus(result.data);
    } else {
      console.error("Failed to fetch MFA status:", result.message);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchMFAStatus();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchMFAStatus]);

  const handleSetupMFA = () => {
    startTransition(async () => {
      const result = await setupMFA();

      if (result.success && result.data) {
        setSecret(result.data.secret);
        setQrCode(result.data.qrCode);
        setSetupStep("qr");
        toast({
          title: "Setup Initiated",
          description: "Scan the QR code with your authenticator app.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to initiate MFA setup",
          variant: "destructive",
        });
      }
    });
  };

  const mandatoryRoles = ["ADMIN", "LAB_PARTNER"];
  const optionalRoles = ["SUPER_ADMIN"];
  const roleKey = user?.role?.toUpperCase();
  const isMandatoryRole = Boolean(roleKey && mandatoryRoles.includes(roleKey));
  const isOptionalRole = Boolean(roleKey && optionalRoles.includes(roleKey));

  return (
    <div className='space-y-6'>
      {(setupRequired || isMandatory || isMandatoryRole) && !mfaStatus?.mfaEnabled && (
        <Alert
          className='border-amber-500 bg-amber-50'
          suppressHydrationWarning
        >
          <AlertCircle className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-800'>
            <strong>Action Required:</strong> Two-factor authentication is
            mandatory for your account role. Please complete the setup below to
            continue using the application.
          </AlertDescription>
        </Alert>
      )}

      {isMandatoryRole && !mfaStatus?.mfaEnabled && (
        <Alert className='border-blue-500 bg-blue-50' suppressHydrationWarning>
          <Shield className='h-4 w-4 text-blue-600' />
          <AlertDescription className='text-blue-800'>
            As a {user?.role.replace("_", " ")} user, two-factor authentication
            is required for enhanced security.
          </AlertDescription>
        </Alert>
      )}

      {isOptionalRole && (setupSuggested || isFirstLogin) && !mfaStatus?.mfaEnabled && (
        <Alert className='border-blue-500 bg-blue-50' suppressHydrationWarning>
          <Shield className='h-4 w-4 text-blue-600' />
          <AlertDescription className='text-blue-800'>
            As a {user?.role.replace("_", " ")} user, two-factor authentication
            is recommended for enhanced security.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Shield className='w-5 h-5' />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </div>
            {mfaStatus?.mfaEnabled && (
              <Badge
                variant='default'
                className='bg-green-500'
                suppressHydrationWarning
              >
                <CheckCircle2 className='w-3 h-3 mr-1' />
                Enabled
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {!mfaStatus?.mfaEnabled && setupStep === "idle" && (
            <>
              <p className='text-sm text-muted-foreground'>
                Use an authenticator app like Google Authenticator or Microsoft
                Authenticator to generate verification codes.
              </p>
              <Button
                onClick={handleSetupMFA}
                disabled={isPending}
                className='w-full sm:w-auto'
              >
                <Smartphone className='w-4 h-4 mr-2' />
                Enable Two-Factor Authentication
              </Button>
            </>
          )}

          {setupStep === "qr" && qrCode && secret && (
            <MFAQRDisplay
              qrCode={qrCode}
              secret={secret}
              onVerified={(codes) => {
                setBackupCodes(codes);
                setSetupStep("complete");
                fetchMFAStatus();
              }}
              onCancel={() => setSetupStep("idle")}
            />
          )}

          {setupStep === "complete" && backupCodes.length > 0 && (
            <MFABackupCodes
              codes={backupCodes}
              onDone={() => {
                setSetupStep("idle");
                setBackupCodes([]);
                window.location.href = "/dashboard/customer/security";
              }}
            />
          )}

          {mfaStatus?.mfaEnabled && setupStep === "idle" && (
            <div className='space-y-4'>
              <div className='p-4 border rounded-lg bg-green-50 border-green-200'>
                <p className='text-sm text-green-800'>
                  Two-factor authentication is active. You have{" "}
                  <strong>{mfaStatus.backupCodesCount}</strong> backup codes
                  remaining.
                </p>
                {mfaStatus.mfaSetupAt && (
                  <p className='text-xs text-muted-foreground mt-2'>
                    Enabled on{" "}
                    {new Date(mfaStatus.mfaSetupAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              {!isMandatory && !isMandatoryRole && (
                <MFADisableForm
                  backupCodesCount={mfaStatus.backupCodesCount}
                  onDisabled={() => {
                    setMfaStatus({
                      mfaEnabled: false,
                      mfaSetupAt: null,
                      backupCodesCount: 0,
                    });
                    setSetupStep("idle");
                    fetchMFAStatus();
                  }}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
