"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hook/use-toast";
import { verifySetup } from "@/lib/auth/client";
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

  const handleVerifySetup = (code = verificationCode) => {
    if (code.trim().length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const result = await verifySetup(secret, code.trim());

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
    <div className='space-y-3 sm:space-y-4'>
      <div className='rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm'>
        <div className='flex flex-col items-center gap-2 sm:gap-3'>
          <h3 className='text-base sm:text-lg font-semibold text-slate-900'>
            Scan QR Code
          </h3>
          <div className='rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:p-4 w-full max-w-[260px] sm:max-w-[300px]'>
            <img
              src={qrCode}
              alt='MFA QR Code'
              width={240}
              height={240}
              className='h-auto w-full'
            />
          </div>
          <a
            href='#'
            onClick={(event) => event.preventDefault()}
            className='text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700'
          >
            Trouble scanning?
          </a>

          <div className='mt-3 sm:mt-4 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 p-2 sm:p-3 w-full'>
            <p className='text-[11px] sm:text-xs font-medium text-slate-900'>
              Enter code manually
            </p>
            <div className='mt-1.5 sm:mt-2 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2'>
              <Input
                value={secret}
                readOnly
                className='font-mono text-xs sm:text-sm h-8 sm:h-9'
                aria-label='MFA manual setup code'
              />
              <Button
                variant='outline'
                size='sm'
                className='w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9'
                onClick={() => copyToClipboard(secret)}
              >
                <Copy className='w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2' />
                Copy code
              </Button>
            </div>
          </div>
        </div>

        <div className='mt-3 sm:mt-4 space-y-2'>
          <Label className='text-xs sm:text-sm font-medium'>
            Step 2: Enter your 6-digit code
          </Label>
          <Input
            value={verificationCode}
            onChange={(event) =>
              setVerificationCode(
                event.target.value.replace(/\D/g, "").slice(0, 6),
              )
            }
            placeholder='Enter your 6-digit code'
            inputMode='numeric'
            maxLength={6}
            disabled={isPending}
            aria-label='MFA setup verification code'
            className='text-sm sm:text-base'
          />
        </div>
      </div>

      <div className='flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3'>
        <Button
          variant='outline'
          className='w-full sm:w-auto text-sm sm:text-base'
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          className='w-full sm:w-auto text-sm sm:text-base'
          onClick={() => handleVerifySetup()}
          disabled={isPending || verificationCode.trim().length !== 6}
        >
          Verify
        </Button>
      </div>
    </div>
  );
}
