"use client";

import { OrderTrackingCard } from "@/components/results/OrderTrackingCard";
import { RequisitionDownloader } from "@/components/results/RequisitionDownloader";
import { useAuth } from "@/lib/auth-context";
import { subscribeToOrderTracking } from "@/lib/services/order-tracking.socket";
import {
  getOrderDetails,
  getOrderTracking,
  retryOrderAccessPlacement,
} from "@/lib/services/order.service";
import { useEffect, useMemo, useState } from "react";

const mapBackendStatusToCardStatus = (
  status: string,
  manualReviewRequired?: boolean,
): "pending" | "processing" | "completed" | "failed" | "needs_review" => {
  if (manualReviewRequired) return "needs_review";
  const normalized = status.toUpperCase();
  if (normalized === "COMPLETED") return "completed";
  if (normalized === "FAILED" || normalized === "CANCELLED") return "failed";
  if (normalized === "PENDING_PAYMENT") return "pending";
  return "processing";
};

export function OrderJourneyPanel({ orderId }: { orderId: string }) {
  const { user } = useAuth();
  const [tracking, setTracking] = useState<any | null>(null);
  const [details, setDetails] = useState<any | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    let active = true;
    let unsubscribeSocket: (() => void) | null = null;

    const load = async () => {
      try {
        const [trackingData, detailData] = await Promise.all([
          getOrderTracking(orderId),
          getOrderDetails(orderId),
        ]);
        if (!active) return;
        setTracking(trackingData);
        setDetails(detailData);
      } catch {
        if (!active) return;
      }
    };

    load();

    const setupRealtime = async () => {
      try {
        unsubscribeSocket = await subscribeToOrderTracking(orderId, {
          onTrackingUpdate: async (update) => {
            if (!active) return;
            setTracking(update);
            try {
              const detailData = await getOrderDetails(orderId);
              if (active) {
                setDetails(detailData);
              }
            } catch {
              if (!active) return;
            }
          },
        });
      } catch {
        if (!active) return;
      }
    };

    setupRealtime();
    const id = setInterval(load, 15000);

    return () => {
      active = false;
      clearInterval(id);
      if (unsubscribeSocket) {
        unsubscribeSocket();
      }
    };
  }, [orderId]);

  const trackingCardData = useMemo(() => {
    if (!tracking || !details) return null;

    const statusLabel =
      tracking.status
        ?.toString()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char: string) => char.toUpperCase()) ||
      "In Progress";

    return {
      currentStep: tracking.currentStep || 1,
      totalSteps: 4,
      status: mapBackendStatusToCardStatus(
        tracking.status,
        details.manualReviewRequired,
      ),
      statusLabel,
      description:
        details.labVisitInstructions ||
        "Your order is being processed. Status updates appear here in real time.",
      labOrderId: details.accessOrderId || undefined,
      requisitionUrl:
        details.requisitionPdfUrl || tracking.requisitionUrl || undefined,
      labLocation: tracking.labLocation
        ? {
            name: tracking.labLocation.name || "Assigned Collection Center",
            address:
              tracking.labLocation.address ||
              "Address will be available shortly",
          }
        : undefined,
      estimatedCompletion: "24-48 hours after sample collection",
    } as const;
  }, [tracking, details]);

  if (!trackingCardData || !details) {
    return null;
  }

  return (
    <div className='space-y-6'>
      <OrderTrackingCard
        orderId={orderId}
        orderNumber={`ORD-${orderId.slice(0, 8).toUpperCase()}`}
        testCount={1}
        totalAmount={Number(details.total || 0)}
        tracking={trackingCardData}
        onRetry={async () => {
          setIsRetrying(true);
          try {
            await retryOrderAccessPlacement(orderId);
            const [trackingData, detailData] = await Promise.all([
              getOrderTracking(orderId),
              getOrderDetails(orderId),
            ]);
            setTracking(trackingData);
            setDetails(detailData);
          } finally {
            setIsRetrying(false);
          }
        }}
        isRetrying={isRetrying}
      />

      {(details.requisitionPdfUrl || tracking.requisitionUrl) && (
        <RequisitionDownloader
          requisition={{
            orderId,
            orderNumber: `ORD-${orderId.slice(0, 8).toUpperCase()}`,
            requisitionId: details.accessOrderId || undefined,
            pdfUrl:
              details.requisitionPdfUrl || tracking.requisitionUrl || undefined,
            generatedDate: new Date(
              details.updatedAt || details.createdAt || Date.now(),
            ).toLocaleDateString(),
            testsCount: 1,
            testsList: [],
            patientName:
              `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
              "Patient",
            labLocation: tracking.labLocation
              ? {
                  name:
                    tracking.labLocation.name || "Assigned Collection Center",
                  address: tracking.labLocation.address || "",
                  city: "",
                  state: "",
                  zip: "",
                  phone: tracking.labLocation.phone || undefined,
                  hours: tracking.labLocation.hours || undefined,
                }
              : undefined,
          }}
        />
      )}
    </div>
  );
}
