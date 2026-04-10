"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hook/use-toast";
import { disableMFA } from "@/lib/auth/client";
import { useState, useTransition } from "react";

interface MFADisableFormProps {
  backupCodesCount: number;
  onDisabled: () => void;
}

export function MFADisableForm({
  backupCodesCount,
  onDisabled,
}: MFADisableFormProps) {
  const [disableCode, setDisableCode] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleDisableMFA = () => {
    if (disableCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const result = await disableMFA(disableCode);

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
    <div className='space-y-4 pt-4 border-t'>
      <h4 className='font-semibold text-sm text-destructive'>
        Disable Two-Factor Authentication
      </h4>
      <p className='text-sm text-muted-foreground'>
        Enter a code from your authenticator app to disable MFA.
      </p>
      <div className='space-y-2'>
        <Label htmlFor='disableCode'>Verification Code</Label>
        <Input
          id='disableCode'
          type='text'
          placeholder='000000'
          maxLength={6}
          value={disableCode}
          onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ""))}
          className='text-center text-2xl tracking-widest font-mono'
        />
      </div>
      <Button
        variant='destructive'
        onClick={handleDisableMFA}
        disabled={isPending || disableCode.length !== 6}
      >
        Disable MFA
      </Button>
    </div>
  );
}
