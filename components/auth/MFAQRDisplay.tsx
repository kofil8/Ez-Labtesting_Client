"use client";

import { verifySetup } from "@/app/actions/mfa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hook/use-toast";
import { Copy } from "lucide-react";
import { useState, useTransition } from "react";

interface MFAQRDisplayProps {
  qrCode: string;
  secret: string;
  onVerified: (backupCodes: string[]) => void;
  onCancel: () => void;
}

export function MFAQRDisplay({
  qrCode,
  secret,
  onVerified,
  onCancel,
}: MFAQRDisplayProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isPending, startTransition] = useTransition();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Copied to clipboard" });
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

      if (result.success && result.data?.backupCodes) {
        toast({
          title: "Success",
          description: "Two-factor authentication enabled successfully!",
        });
        onVerified(result.data.backupCodes);
      } else {
        toast({
          title: "Error",
          description: result.message || "Invalid verification code",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-col items-center space-y-4 p-6 border rounded-lg bg-white'>
        <h3 className='font-semibold text-lg'>Scan QR Code</h3>
        <div className='bg-white p-4 rounded-lg border-2'>
          <img
            src={qrCode}
            alt='MFA QR Code'
            width={200}
            height={200}
            className='max-w-full h-auto'
          />
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
      </div>

      <div className='space-y-2'>
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

      <div className='flex gap-2'>
        <Button
          onClick={handleVerifySetup}
          disabled={isPending || verificationCode.length !== 6}
        >
          Verify & Enable
        </Button>
        <Button variant='outline' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
