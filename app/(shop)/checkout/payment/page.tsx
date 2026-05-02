"use client";

import { StripePayment } from "@/components/checkout/StripePayment";
import { StripeProvider } from "@/components/providers/StripeProvider";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hook/use-toast";
import { useAuth } from "@/lib/auth-context";
import { shouldRouteToVisitLab } from "@/lib/checkout/flow-guards";
import { buildCreateOrderRequest } from "@/lib/checkout/build-create-order-request";
import { finalizePaymentAfterStripe } from "@/lib/checkout/payment-finalization";
import { useCheckout } from "@/lib/context/CheckoutContext";
import { useRestrictionStatus } from "@/lib/context/RestrictionStatusContext";
import { trackLocatorEvent } from "@/lib/locator/analytics";
import { createOrder, getResumableOrder } from "@/lib/services";
import { confirmOrderPayment } from "@/lib/services/order.service";
import {
  RESTRICTED_LOCATION_CHECKOUT,
  RESTRICTED_LOCATION_TOAST,
} from "@/lib/restrictions/presentation";
import { useCartStore } from "@/lib/store/cart-store";
import { RestrictionStatus } from "@/types/restriction";
import { AlertTriangle, CreditCard, Loader2, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import CheckoutShell from "../CheckoutShell";

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTotal = useCartStore((state) => state.getTotal);
  const promoCode = useCartStore((state) => state.promoCode);
  const {
    patientInfo,
    order,
    selectedLab,
    accessOrderPayload,
    validateAccessFields,
    validatePatientInfo,
    setOrder,
    setLastRecoveredAt,
  } = useCheckout();

  const [isRecovering, setIsRecovering] = useState(true);
  const [isPreparingOrder, setIsPreparingOrder] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [restrictionStatus, setRestrictionStatus] =
    useState<RestrictionStatus | null>(null);
  const [isRestrictionLoading, setIsRestrictionLoading] = useState(false);
  const hasHydratedResume = useRef(false);
  const hasShownRestrictionToast = useRef(false);
  const { checkRestriction, publishStatus } = useRestrictionStatus();

  const processingFee = 2.5;
  const paymentAmount = (order?.total ?? getTotal() + processingFee) || 0;

  const isCustomer = useMemo(
    () => user?.role?.toLowerCase() === "customer",
    [user?.role],
  );
  const primaryLabTestId = useMemo(() => {
    const primaryCartItem = items[0] as
      | {
          itemType?: "TEST" | "PANEL";
          testId?: string;
          testIds?: string[];
        }
      | undefined;

    return primaryCartItem?.itemType === "TEST"
      ? primaryCartItem.testId
      : primaryCartItem?.itemType === "PANEL"
        ? primaryCartItem.testIds?.[0]
        : primaryCartItem?.testId;
  }, [items]);
  const restrictionMessage =
    restrictionStatus?.canOrder === false ? RESTRICTED_LOCATION_CHECKOUT : null;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?from=/checkout/payment");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (hasHydratedResume.current) {
      return;
    }

    if (isLoading || !isAuthenticated) {
      return;
    }

    if (!isCustomer) {
      router.push("/dashboard");
      return;
    }

    if (items.length === 0) {
      router.push("/tests");
      return;
    }

    const hydrate = async () => {
      hasHydratedResume.current = true;
      try {
        const resumableOrder = await getResumableOrder();

        if (resumableOrder?.id) {
          setOrder({
            orderId: resumableOrder.id,
            subtotal: resumableOrder.subtotal ?? getSubtotal(),
            processingFee: resumableOrder.processingFee ?? processingFee,
            total:
              resumableOrder.total ?? getTotal() + processingFee,
          });
          setLastRecoveredAt(Date.now());

          if (shouldRouteToVisitLab(resumableOrder.status)) {
            router.replace("/checkout/visit-lab");
            return;
          }
        }
      } catch {
        // ignore and keep local session fallback
      } finally {
        setIsRecovering(false);
      }
    };

    hydrate();
  }, [
    getSubtotal,
    getTotal,
    isAuthenticated,
    isCustomer,
    isLoading,
    items.length,
    processingFee,
    router,
    setLastRecoveredAt,
    setOrder,
  ]);

  useEffect(() => {
    if (isRecovering) {
      return;
    }

    if (!validatePatientInfo()) {
      toast({
        title: "Patient info required",
        description: "Please complete patient information before payment.",
        variant: "destructive",
      });
      router.replace("/checkout/patient-info");
      return;
    }

    if (!validateAccessFields()) {
      toast({
        title: "Checkout data missing",
        description: "Please complete patient details to continue.",
        variant: "destructive",
      });
      router.replace("/checkout/patient-info");
      return;
    }
  }, [isRecovering, router, validateAccessFields, validatePatientInfo]);

  useEffect(() => {
    if (isRecovering || !patientInfo.state || !primaryLabTestId) {
      setRestrictionStatus(null);
      setIsRestrictionLoading(false);
      return;
    }

    let cancelled = false;
    const loadRestrictionStatus = async () => {
      setIsRestrictionLoading(true);

      try {
        const nextStatus = await checkRestriction({
          checkoutState: patientInfo.state,
          testId: primaryLabTestId,
        });
        if (cancelled) {
          return;
        }

        setRestrictionStatus(nextStatus);

        if (nextStatus?.canOrder === false) {
          publishStatus(nextStatus);
        }

        if (nextStatus?.canOrder === false && !hasShownRestrictionToast.current) {
          hasShownRestrictionToast.current = true;
          toast({
            title: "Location restricted",
            description: RESTRICTED_LOCATION_TOAST,
            variant: "destructive",
          });
        }
      } catch {
        if (!cancelled) {
          setRestrictionStatus(null);
        }
      } finally {
        if (!cancelled) {
          setIsRestrictionLoading(false);
        }
      }
    };

    void loadRestrictionStatus();

    return () => {
      cancelled = true;
    };
  }, [checkRestriction, isRecovering, patientInfo.state, primaryLabTestId, publishStatus]);

  useEffect(() => {
    if (
      isRecovering ||
      isPreparingOrder ||
      order?.orderId ||
      isRestrictionLoading ||
      restrictionStatus?.canOrder === false
    ) {
      return;
    }

    if (!accessOrderPayload || !validatePatientInfo()) {
      return;
    }

    let cancelled = false;

    const ensureOrder = async () => {
      try {
        setIsPreparingOrder(true);

        if (!primaryLabTestId) {
          throw new Error("No lab test selected for checkout.");
        }

        const response = await createOrder(
          buildCreateOrderRequest({
            accessOrderPayload,
            getSubtotal: getSubtotal(),
              getTotal: getTotal(),
              labTestId: primaryLabTestId,
              patientInfo,
              processingFee,
              promoCode,
              selectedLab: selectedLab || null,
            }),
          );

        trackLocatorEvent("booking_started", {
          lab_id: selectedLab?.id || null,
          order_id: response.orderId,
        });

        if (cancelled) return;

        setOrder({
          orderId: response.orderId,
          subtotal: response.subtotal,
          processingFee: response.processingFee,
          total: response.total,
        });
      } catch (error: any) {
        if (cancelled) return;

        if (error?.code === "REGION_RESTRICTED") {
          const blockedStatus = {
            ip: restrictionStatus?.ip ?? null,
            maskedIp: restrictionStatus?.maskedIp ?? null,
            detectedStateCode:
              restrictionStatus?.detectedStateCode ?? patientInfo.state ?? null,
            effectiveStateCode:
              (error?.details?.stateCode as string | undefined) ??
              restrictionStatus?.effectiveStateCode ??
              patientInfo.state ??
              null,
            laboratoryRoute:
              (error?.details?.laboratoryRoute as string | undefined) ??
              restrictionStatus?.laboratoryRoute ??
              "ACCESS",
            restrictionType:
              (error?.details?.restrictionType as
                | "BLOCKED"
                | "REQUIRES_PHYSICIAN"
                | null
                | undefined) ??
              restrictionStatus?.restrictionType ??
              null,
            canOrder: false,
            reason:
              error?.message ||
              restrictionStatus?.reason ||
              "Ordering is unavailable in your region.",
            source: restrictionStatus?.source ?? "checkout_state",
          } as RestrictionStatus;

          setRestrictionStatus(blockedStatus);
          publishStatus(blockedStatus);
        }

        toast({
          title: "Unable to prepare order",
          description:
            error?.message ||
            "We could not prepare your order for payment. Please try again.",
          variant: "destructive",
        });
      } finally {
        if (!cancelled) {
          setIsPreparingOrder(false);
        }
      }
    };

    ensureOrder();

    return () => {
      cancelled = true;
    };
  }, [
    accessOrderPayload,
    getSubtotal,
    getTotal,
    isPreparingOrder,
    isRecovering,
    isRestrictionLoading,
    items,
    order?.orderId,
      patientInfo,
      primaryLabTestId,
      promoCode,
      processingFee,
    restrictionStatus?.canOrder,
    restrictionStatus,
    selectedLab,
    setOrder,
    validatePatientInfo,
  ]);

  if (isLoading || !isAuthenticated || !isCustomer || items.length === 0) {
    return null;
  }

  if (isRecovering) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-6 w-6 animate-spin text-primary' />
      </div>
    );
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    await finalizePaymentAfterStripe(
      {
        orderId: order?.orderId,
        paymentIntentId,
        hasAccessPayload: Boolean(accessOrderPayload),
      },
      {
        confirmOrderPayment,
        setIsFinalizing,
        onMissingInformation: () => {
          toast({
            title: "Missing Information",
            description: "Please prepare your order before payment.",
            variant: "destructive",
          });
          router.replace("/checkout/patient-info");
        },
        onNavigateToVisitLab: () => {
          trackLocatorEvent("booking_completed", {
            lab_id: selectedLab?.id || null,
            order_id: order?.orderId || null,
          });
          router.push("/checkout/visit-lab");
        },
        onFinalizeError: (message) => {
          toast({
            title: "Payment verification failed",
            description: message,
            variant: "destructive",
          });
        },
      },
    );
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <CheckoutShell
      currentStep={2}
      summaryTotal={order?.total}
      summarySubtotal={order?.subtotal}
      summaryProcessingFee={order?.processingFee}
    >
      <Card className='border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/20 bg-white dark:bg-slate-900'>
        <div className='bg-primary/5 dark:bg-primary/10 p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between'>
          <h3 className='text-xl font-bold flex items-center gap-3 text-primary'>
            <CreditCard className='h-5 w-5' />
            Payment Details
          </h3>
          <Badge className='bg-primary text-white font-bold border-0'>
            Secure 256-bit
          </Badge>
        </div>

        <CardContent className='p-8 space-y-6'>
          {isPreparingOrder && (
            <div className='inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary text-sm'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Preparing your order before payment...
            </div>
          )}

          {isFinalizing && (
            <div className='inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary text-sm'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Finalizing your paid order and syncing status...
            </div>
          )}

          {restrictionMessage ? (
            <Alert className='border-red-200 bg-red-50 text-red-950 [&>svg]:text-red-700'>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>Online ordering unavailable</AlertTitle>
              <AlertDescription>{restrictionMessage}</AlertDescription>
            </Alert>
          ) : null}

          <StripeProvider
            key={`automatic-${Math.round(paymentAmount * 100)}`}
            amount={Math.round(paymentAmount * 100)}
          >
            <StripePayment
              amount={paymentAmount}
              orderId={order?.orderId}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              disabled={
                isPreparingOrder ||
                isFinalizing ||
                !order?.orderId ||
                isRestrictionLoading ||
                restrictionStatus?.canOrder === false
              }
            />
          </StripeProvider>

          <div className='flex items-center justify-between'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.push("/checkout/patient-info")}
            >
              Back to Patient Info
            </Button>

            <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase'>
              <Shield className='h-3.5 w-3.5' />
              Encrypted Session
            </div>
          </div>

          {selectedLab ? (
            <div className='rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm'>
              <p className='font-medium text-primary'>Selected lab</p>
              <p className='mt-1 text-foreground'>{selectedLab.name}</p>
              <p className='text-muted-foreground'>{selectedLab.address}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </CheckoutShell>
  );
}
