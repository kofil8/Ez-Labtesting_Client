import { PromoCodeTopBannerClient } from "@/components/home/PromoCodeTopBannerClient";

type PublicPromoCode = {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchaseAmount?: number;
  validFrom?: string;
  validUntil?: string;
  enabled: boolean;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1";

function normalizePromo(payload: unknown): PublicPromoCode | null {
  const record = payload as { data?: unknown };
  const promos = Array.isArray(record?.data)
    ? record.data
    : Array.isArray(payload)
      ? payload
      : [];

  const firstPromo = promos.find((promo) => {
    if (!promo || typeof promo !== "object") return false;
    return Boolean((promo as PublicPromoCode).enabled);
  });

  if (!firstPromo || typeof firstPromo !== "object") {
    return null;
  }

  const promo = firstPromo as PublicPromoCode;
  if (!promo.code) {
    return null;
  }

  return promo;
}

export async function PromoCodeTopBanner() {
  let promo: PublicPromoCode | null = null;

  try {
    const response = await fetch(`${API_BASE_URL}/promo-codes/active`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      promo = normalizePromo(await response.json().catch(() => null));
    }
  } catch {
    promo = null;
  }

  if (!promo) {
    return null;
  }

  return <PromoCodeTopBannerClient code={promo.code} />;
}
