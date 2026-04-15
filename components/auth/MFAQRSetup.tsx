"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hook/use-toast";
import { setupMFA, verifySetup } from "@/lib/auth/client";
import { Copy, Smartphone } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useTransition } from "react";

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false });

interface MFAQRSetupProps {
  onSuccess: (secret: string, qrCode: string) => void;
}

export function MFAQRSetup({ onSuccess }: MFAQRSetupProps) {
  const [isPending, startTransition] = useTransition();
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const handleSetupMFA = () => {
    startTransition(async () => {
      const result = await setupMFA();

      if (result.success && result.data) {
        setSecret(result.data.secret);
        setQrCode(result.data.qrCode);
        toast({
          title: "Setup Initiated",
          description: "Scan the QR code with your authenticator app.",
        });
        onSuccess(result.data.secret, result.data.qrCode);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to initiate MFA setup",
          variant: "destructive",
        });
      }
    });
  };

  const handleVerifySetup = () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const result = await verifySetup(secret, verificationCode);

      if (result.success && result.data) {
        toast({
          title: "Success",
          description: "Two-factor authentication enabled successfully!",
        });
        onSuccess("", result.data.backupCodes?.[0] || "");
      } else {
        toast({
          title: "Error",
          description: result.message || "Invalid verification code",
          variant: "destructive",
        });
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Smartphone className='w-5 h-5' />
          Scan QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {qrCode && (
          <div className='flex flex-col items-center space-y-4 p-6 border rounded-lg bg-white'>
            <div className='bg-white p-4 rounded-lg border-2'>
              <QRCode value={qrCode} size={200} />
            </div>
            <div className='w-full space-y-2'>
              <Label className='text-sm font-medium'>
                Or enter this code manually:
              </Label>
              <div className='flex gap-2'>
                <Input value={secret} readOnly className='font-mono text-sm' />
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => copyToClipboard(secret)}
                >
                  <Copy className='w-4 h-4' />
                </Button>
              </div>
            </div>

            <div className='space-y-2 w-full'>
              <Label htmlFor='verificationCode'>
                Enter 6-digit code from your app
              </Label>
              <Input
                id='verificationCode'
                type='text'
                placeholder='000000'
                maxLength={6}
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/\D/g, ""))
                }
                className='text-center text-2xl tracking-widest font-mono'
              />
            </div>

            <div className='flex gap-2 w-full'>
              <Button
                onClick={handleVerifySetup}
                disabled={isPending || verificationCode.length !== 6}
              >
                Verify & Enable
              </Button>
              <Button variant='outline' onClick={() => setSecret("")}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!qrCode && (
          <Button onClick={handleSetupMFA} disabled={isPending}>
            Start Setup
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
