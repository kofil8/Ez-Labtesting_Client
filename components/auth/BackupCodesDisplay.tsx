"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hook/use-toast";
import { AlertCircle, CheckCircle2, Copy, Download } from "lucide-react";

interface BackupCodesDisplayProps {
  codes: string[];
  onDone: () => void;
}

export function BackupCodesDisplay({ codes, onDone }: BackupCodesDisplayProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  const downloadBackupCodes = () => {
    const content = codes.join("\n");
    const blob = new Blob(
      [`EzLabTesting - Backup Codes\n\n${content}\n\nKeep these codes safe!`],
      { type: "text/plain" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ezlabtesting-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded",
      description: "Backup codes saved to file",
    });
  };

  return (
    <Card>
      <CardContent className='space-y-4 pt-6'>
        <Alert className='border-green-500 bg-green-50'>
          <CheckCircle2 className='h-4 w-4 text-green-600' />
          <AlertDescription className='text-green-800'>
            Two-factor authentication has been successfully enabled!
          </AlertDescription>
        </Alert>

        <div className='p-4 border rounded-lg bg-amber-50 border-amber-300'>
          <h3 className='font-semibold text-lg mb-2 flex items-center gap-2'>
            <AlertCircle className='w-5 h-5 text-amber-600' />
            Save Your Backup Codes
          </h3>
          <p className='text-sm text-muted-foreground mb-4'>
            Store these codes in a safe place. Each code can be used once if you
            lose access to your authenticator app.
          </p>
          <div className='grid grid-cols-2 gap-2 mb-4 p-4 bg-white rounded font-mono text-sm'>
            {codes.map((code, index) => (
              <div key={index} className='p-2 border rounded'>
                {code}
              </div>
            ))}
          </div>
          <div className='flex gap-2'>
            <Button onClick={downloadBackupCodes} variant='outline' size='sm'>
              <Download className='w-4 h-4 mr-2' />
              Download Codes
            </Button>
            <Button
              onClick={() => copyToClipboard(codes.join("\n"))}
              variant='outline'
              size='sm'
            >
              <Copy className='w-4 h-4 mr-2' />
              Copy All
            </Button>
          </div>
        </div>

        <Button onClick={onDone} className='w-full'>
          Done
        </Button>
      </CardContent>
    </Card>
  );
}
