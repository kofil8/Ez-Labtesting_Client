"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutConfirmationPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/checkout/visit-lab");
  }, [router]);

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='inline-flex items-center gap-2 text-sm text-muted-foreground'>
        <Loader2 className='h-4 w-4 animate-spin' />
        Redirecting to your order status...
      </div>
    </div>
  );
}
