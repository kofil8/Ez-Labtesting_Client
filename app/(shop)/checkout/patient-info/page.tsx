"use client";

import {
  PatientFormData,
  PatientInfoForm,
} from "@/components/checkout/PatientInfoForm";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hook/use-toast";
import {
  AccessOrderPayload,
  validateDobFormat,
  validateEmailFormat,
  validatePhoneFormat,
} from "@/lib/api-contracts";
import { useAuth } from "@/lib/auth-context";
import { shouldRouteToVisitLab } from "@/lib/checkout/flow-guards";
import { useCheckout } from "@/lib/context/CheckoutContext";
import {
  getRestrictionStatus,
  type RestrictionStatusParams,
} from "@/lib/services/state-restriction.service";
import { getRestrictionMessage } from "@/lib/restrictions/presentation";
import { getResumableOrder } from "@/lib/services";
import { useCartStore } from "@/lib/store/cart-store";
import { RestrictionStatus } from "@/types/restriction";
import { AlertTriangle, Loader2, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import CheckoutShell from "../CheckoutShell";

export default function CheckoutPatientInfoPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTotal = useCartStore((state) => state.getTotal);
  const {
    patientInfo,
    order,
    setPatientInfo,
    setOrder,
    setAccessOrderPayload,
    setLastRecoveredAt,
  } = useCheckout();

  const [localPatientData, setLocalPatientData] =
    useState<PatientFormData | null>(
      patientInfo
        ? {
            firstName: patientInfo.firstName,
            lastName: patientInfo.lastName,
            dateOfBirth: patientInfo.dob,
            gender: patientInfo.gender,
            phone: patientInfo.phone,
            email: patientInfo.email,
            address: patientInfo.address,
            city: patientInfo.city,
            state: patientInfo.state,
            zipCode: patientInfo.zipCode,
          }
        : null,
    );
  const [isPatientValid, setIsPatientValid] = useState(false);
  const [isRecovering, setIsRecovering] = useState(true);
  const [restrictionStatus, setRestrictionStatus] =
    useState<RestrictionStatus | null>(null);
  const [isRestrictionLoading, setIsRestrictionLoading] = useState(false);
  const hasHydratedResume = useRef(false);

  const processingFee = 2.5;

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
  const restrictionMessage = getRestrictionMessage(restrictionStatus);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?from=/checkout/patient-info");
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

        if (
          resumableOrder?.id &&
          (resumableOrder.status === "PENDING_PAYMENT" ||
            resumableOrder.status === "PAID" ||
            resumableOrder.status === "LAB_ORDER_PLACED")
        ) {
          setOrder({
            orderId: resumableOrder.id,
            subtotal: getSubtotal(),
            processingFee,
            total: getTotal() + processingFee,
          });
          setLastRecoveredAt(Date.now());

          if (resumableOrder.status === "PENDING_PAYMENT") {
            toast({
              title: "Checkout Recovered",
              description: "Your previous checkout was restored.",
            });
          }

          if (shouldRouteToVisitLab(resumableOrder.status)) {
            router.replace("/checkout/visit-lab");
            return;
          }
        }
      } catch {
        // fall back to session state silently
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
    if (
      !localPatientData?.state ||
      !/^[A-Za-z]{2}$/.test(localPatientData.state.trim()) ||
      !primaryLabTestId
    ) {
      setRestrictionStatus(null);
      setIsRestrictionLoading(false);
      return;
    }

    let cancelled = false;
    const params: RestrictionStatusParams = {
      checkoutState: localPatientData.state.trim().toUpperCase(),
      testId: primaryLabTestId,
    };

    const loadRestrictionStatus = async () => {
      setIsRestrictionLoading(true);

      try {
        const nextStatus = await getRestrictionStatus(params);
        if (!cancelled) {
          setRestrictionStatus(nextStatus);
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
  }, [localPatientData?.state, primaryLabTestId]);

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

  const handleContinueToPayment = async () => {
    if (!isPatientValid || !localPatientData) {
      toast({
        title: "Incomplete Information",
        description: "Please complete all required patient information fields.",
        variant: "destructive",
      });
      return;
    }

    const dobFormatted = localPatientData.dateOfBirth.replace(/-/g, "");
    const dobMMDDYYYY =
      dobFormatted.substring(4, 6) +
      dobFormatted.substring(6, 8) +
      dobFormatted.substring(0, 4);

    if (!validateDobFormat(dobMMDDYYYY)) {
      toast({
        title: "Invalid Date of Birth",
        description: "Date of birth format is invalid (MMDDYYYY required).",
        variant: "destructive",
      });
      return;
    }

    let phoneDigits = localPatientData.phone.replace(/\D/g, "");
    if (phoneDigits.length === 11 && phoneDigits.startsWith("1")) {
      phoneDigits = phoneDigits.substring(1);
    }
    if (!validatePhoneFormat(phoneDigits)) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number must be a valid 10-digit US number.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmailFormat(localPatientData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!primaryLabTestId) {
        toast({
          title: "Unsupported cart item",
          description: "Please select a lab test to continue checkout.",
          variant: "destructive",
        });
        return;
      }

      const genderMap: Record<string, "M" | "F" | "O"> = {
        male: "M",
        female: "F",
        other: "O",
      };
      const accessGender =
        genderMap[localPatientData.gender.toLowerCase()] || "O";

      const accessPayload: AccessOrderPayload = {
        testCode: primaryLabTestId,
        collectionType: "PSC",
        patient: {
          firstName: localPatientData.firstName,
          lastName: localPatientData.lastName,
          dateOfBirth: dobMMDDYYYY,
          gender: accessGender,
          phone: phoneDigits,
          email: localPatientData.email,
          address: localPatientData.address.trim(),
          city: localPatientData.city.trim(),
          state: localPatientData.state.trim().toUpperCase(),
          zip: localPatientData.zipCode.trim(),
        },
      };

      setAccessOrderPayload(accessPayload);

      const patientInfoData = {
        firstName: localPatientData.firstName,
        lastName: localPatientData.lastName,
        dob: localPatientData.dateOfBirth,
        gender: (localPatientData.gender.charAt(0).toUpperCase() +
          localPatientData.gender.slice(1)) as "Male" | "Female" | "Other",
        email: localPatientData.email,
        phone: localPatientData.phone,
        address: localPatientData.address.trim(),
        city: localPatientData.city.trim(),
        state: localPatientData.state.trim().toUpperCase(),
        zipCode: localPatientData.zipCode.trim(),
      };

      setPatientInfo(patientInfoData);

      router.push("/checkout/payment");
    } catch (error: any) {
      toast({
        title: "Failed to Continue",
        description: error.message || "Unable to continue. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <CheckoutShell currentStep={1}>
      <div className='space-y-6'>
        <Card className='border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden'>
          <CardContent className='p-6 sm:p-8 space-y-6'>
            <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase'>
              <Shield className='h-3.5 w-3.5' />
              Secure Encrypted Checkout
            </div>

            <PatientInfoForm
              initialData={localPatientData || undefined}
              onFormChange={(data, valid) => {
                setLocalPatientData(data);
                setIsPatientValid(valid);
              }}
            />

            {restrictionMessage ? (
              <Alert className='border-amber-200 bg-amber-50 text-amber-950 [&>svg]:text-amber-700'>
                <AlertTriangle className='h-4 w-4' />
                <AlertTitle>Online ordering restricted</AlertTitle>
                <AlertDescription>{restrictionMessage}</AlertDescription>
              </Alert>
            ) : null}

            <div className='flex justify-end'>
              <Button
                onClick={handleContinueToPayment}
                disabled={
                  !isPatientValid ||
                  isRestrictionLoading ||
                  restrictionStatus?.canOrder === false
                }
                className='h-12 px-8'
              >
                Continue to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </CheckoutShell>
  );
}
