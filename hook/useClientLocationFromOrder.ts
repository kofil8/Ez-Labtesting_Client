"use client";

import { getOrderDetails } from "@/lib/services/order.service";
import { AssignedLabCenter, ClientLocation } from "@/types/lab-center";
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
  orderContext: {
    orderId: string | null;
    requisitionPdfUrl: string | null;
    assignedLab: AssignedLabCenter | null;
    source: "checkout" | "dashboard" | null;
  };
  isLoading: boolean;
}

function buildAssignedLabAddress(location: {
  formattedAddress?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}) {
  if (location.formattedAddress?.trim()) {
    return location.formattedAddress.trim();
  }

  return [location.address, location.city, location.state, location.zip]
    .map((part) => (part || "").trim())
    .filter(Boolean)
    .join(", ");
}

export function useClientLocationFromOrder(): UseClientLocationFromOrderResult {
  const [clientLocation, setClientLocation] = useState<ClientLocation | null>(
    null,
  );
  const [orderContext, setOrderContext] = useState<{
    orderId: string | null;
    requisitionPdfUrl: string | null;
    assignedLab: AssignedLabCenter | null;
    source: "checkout" | "dashboard" | null;
  }>({
    orderId: null,
    requisitionPdfUrl: null,
    assignedLab: null,
    source: null,
  });
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

        setOrderContext((current) => ({
          ...current,
          orderId: parsed.orderId || null,
          source,
        }));

        if (parsed.orderId) {
          try {
            const details = await getOrderDetails(parsed.orderId);
            const confirmed = details.confirmedLabLocation;
            const assignedAddress = confirmed
              ? buildAssignedLabAddress(confirmed)
              : "";

            if (!isCancelled) {
              setOrderContext({
                orderId: parsed.orderId,
                requisitionPdfUrl: details.requisitionPdfUrl || null,
                assignedLab:
                  confirmed &&
                  Boolean(
                    confirmed.siteId ||
                      confirmed.name ||
                      assignedAddress ||
                      confirmed.latitude !== undefined ||
                      confirmed.longitude !== undefined,
                  )
                    ? {
                        id: confirmed.siteId || parsed.orderId,
                        siteId: confirmed.siteId,
                        name:
                          confirmed.name ||
                          assignedAddress ||
                          "Assigned draw center",
                        address: assignedAddress || "Assigned draw center",
                        latitude: confirmed.latitude,
                        longitude: confirmed.longitude,
                        city: confirmed.city,
                        state: confirmed.state,
                        zip: confirmed.zip,
                        formattedAddress: confirmed.formattedAddress,
                        source: "assigned",
                      }
                    : null,
                source,
              });
            }

            if (
              !isCancelled &&
              parsed.location
            ) {
              setClientLocation({
                lat: parsed.location.lat,
                lng: parsed.location.lng,
                label: parsed.location.address || "Client location",
                address: parsed.location.address,
                source: "payload",
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

  return { clientLocation, orderContext, isLoading };
}
