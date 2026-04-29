"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SixDigitCodeInput } from "@/components/shared/SixDigitCodeInput";
import { Label } from "@/components/ui/label";
import { toast } from "@/hook/use-toast";
import { disableMFA } from "@/lib/auth/client";
import { AlertCircle } from "lucide-react";
import { useState, useTransition } from "react";

interface MFADisableProps {
  onDisabled: () => void;
}

export function MFADisable({ onDisabled }: MFADisableProps) {
  const [isPending, startTransition] = useTransition();
  const [disableCode, setDisableCode] = useState("");

  const handleDisableMFA = (code = disableCode) => {
    if (code.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const result = await disableMFA(code);

      if (result.success) {
        toast({
          title: "Success",
          description: "Two-factor authentication disabled",
        });
        onDisabled();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to disable MFA",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-destructive'>
          Disable Two-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Alert className='border-amber-500 bg-amber-50'>
          <AlertCircle className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-800'>
            Disabling MFA will reduce your account security. Enter a code from
            your authenticator app to confirm.
          </AlertDescription>
        </Alert>

        <div className='space-y-2'>
          <Label>Verification Code</Label>
          <SixDigitCodeInput
            value={disableCode}
            onChange={setDisableCode}
            onComplete={(value) => {
              if (!isPending) {
                handleDisableMFA(value);
              }
            }}
            disabled={isPending}
            ariaLabel='Disable MFA verification code'
          />
        </div>

        <Button
          variant='destructive'
          onClick={() => handleDisableMFA()}
          disabled={isPending || disableCode.length !== 6}
        >
          Disable MFA
        </Button>
      </CardContent>
    </Card>
  );
}
