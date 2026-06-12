"use client";

import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

export default function OrderSummaryCard({
  subtotalOverride,
  processingFee = 2.5,
}: {
  subtotalOverride?: number;
  processingFee?: number;
}) {
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  const subtotal = subtotalOverride ?? getSubtotal();
  const total = useMemo(() => subtotal + processingFee, [subtotal, processingFee]);

  return (
    <div className="sticky top-24">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

        <div className="space-y-3">
          {items.map((it, idx) => (
            <div key={idx} className="flex justify-between">
              <div className="text-sm font-medium truncate max-w-[220px]">{(it as any).name || (it as any).testName || "Lab Item"}</div>
              <div className="font-semibold">{formatCurrency((it as any).price || 0)}</div>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Processing fee</span>
            <span>{formatCurrency(processingFee)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="mt-4">
          <Button className="w-full" variant="outline">Edit Order</Button>
        </div>
      </Card>
    </div>
  );
}
