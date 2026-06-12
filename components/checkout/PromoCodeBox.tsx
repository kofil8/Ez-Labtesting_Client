"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hook/use-toast";
import { clientFetch } from "@/lib/api-client";

export default function PromoCodeBox({ onApplied }: { onApplied?: (code: string) => void }) {
  const [code, setCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const apply = async () => {
    if (!code.trim()) return;
    setIsApplying(true);
    try {
      const res = await clientFetch(`/api/promos/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({ title: "Promo error", description: data?.message || "Invalid promo code" });
      } else {
        toast({ title: "Promo applied", description: `Code ${code.trim()} applied` });
        onApplied?.(code.trim());
      }
    } catch (err) {
      toast({ title: "Network error", description: "Failed to apply promo" });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" />
        <Button onClick={apply} disabled={isApplying}>
          {isApplying ? "Applying..." : "Apply"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Enter promo codes. Discounts validated on server.</p>
    </div>
  );
}
