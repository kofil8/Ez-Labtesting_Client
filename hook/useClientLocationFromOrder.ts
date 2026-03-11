"use client";

import { getOrderDetails } from "@/lib/services/order.service";
import { ClientLocation } from "@/types/lab-center";
import { useEffect, useState } from "react";

const FIND_LAB_CENTER_ACCESS_TTL_MS = 2 * 60 * 60 * 1000;

type FindLabCenterAccessPayload = {
  issuedAt?: number;
  orderId?: string;
  source?: "checkout" | "dashboard";
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
};

interface UseClientLocationFromOrderResult {
  clientLocation: ClientLocation | null;
  isLoading: boolean;
}

export function useClientLocationFromOrder(): UseClientLocationFromOrderResult {
  const [clientLocation, setClientLocation] = useState<ClientLocation | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const raw = sessionStorage.getItem("find-lab-center-access");
    if (!raw) {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const bootstrap = async () => {
      try {
        const parsed = JSON.parse(raw) as FindLabCenterAccessPayload;
        const issuedAt = parsed.issuedAt;

        if (
          !issuedAt ||
          Date.now() - issuedAt > FIND_LAB_CENTER_ACCESS_TTL_MS
        ) {
          sessionStorage.removeItem("find-lab-center-access");
          return;
        }

        const source = parsed.source || "checkout";
        if (source !== "checkout" && source !== "dashboard") {
          sessionStorage.removeItem("find-lab-center-access");
          return;
        }

        if (parsed.orderId) {
          try {
            const details = await getOrderDetails(parsed.orderId);
            const confirmed = details.confirmedLabLocation;

            if (
              !isCancelled &&
              confirmed?.latitude !== undefined &&
              confirmed?.longitude !== undefined
            ) {
              setClientLocation({
                lat: confirmed.latitude,
                lng: confirmed.longitude,
                label:
                  confirmed.name ||
                  confirmed.formattedAddress ||
                  confirmed.address ||
                  "Client location",
                address:
                  confirmed.formattedAddress || confirmed.address || undefined,
                source: "order",
              });
              return;
            }
          } catch {
            // Fall through to payload location when order lookup fails
          }
        }

        if (!isCancelled && parsed.location) {
          setClientLocation({
            lat: parsed.location.lat,
            lng: parsed.location.lng,
            label: parsed.location.address || "Client location",
            address: parsed.location.address,
            source: "payload",
          });
        }
      } catch {
        sessionStorage.removeItem("find-lab-center-access");
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { clientLocation, isLoading };
}
