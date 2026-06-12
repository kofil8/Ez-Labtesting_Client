"use client";

import {
  PatientFormData,
  PatientInfoForm,
} from "@/components/checkout/PatientInfoForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hook/use-toast";
import {
  AccessOrderPayload,
  validateDobFormat,
  validateEmailFormat,
  validatePhoneFormat,
} from "@/lib/api-contracts";
import { useAuth } from "@/lib/auth-context";
import { buildCreateOrderRequest } from "@/lib/checkout/build-create-order-request";
import { shouldRouteToVisitLab } from "@/lib/checkout/flow-guards";
import type { PatientRelation } from "@/lib/context/CheckoutContext";
import { useCheckout } from "@/lib/context/CheckoutContext";
import { useRestrictionStatus } from "@/lib/context/RestrictionStatusContext";
import {
  RESTRICTED_LOCATION_CHECKOUT,
  RESTRICTED_LOCATION_TOAST,
  isRestrictionBlocked,
} from "@/lib/restrictions/presentation";
import { createOrder, getResumableOrder } from "@/lib/services";
import { useCartStore } from "@/lib/store/cart-store";
import { RestrictionStatus } from "@/types/restriction";
import { AlertTriangle, Loader2, Shield, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import CheckoutShell from "../CheckoutShell";

const RELATION_OPTIONS: { value: PatientRelation; label: string }[] = [
  { value: "SELF", label: "Myself" },
  { value: "SPOUSE", label: "Spouse" },
  { value: "CHILD", label: "Child" },
  { value: "PARENT", label: "Parent" },
  { value: "OTHER", label: "Other" },
];

const EMPTY_PATIENT_FORM: PatientFormData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
};

function mapUserGenderToForm(gender?: string): string {
  if (!gender) return "";
  switch (gender.toUpperCase()) {
    case "MALE":
      return "male";
    case "FEMALE":
      return "female";
    case "NON_BINARY":
    case "OTHER":
      return "other";
    case "PREFER_NOT_TO_SAY":
      return "prefer-not-to-say";
    default:
      return "";
  }
}

function toIsoDate(value?: string): string {
  if (!value) return "";
  // Accept either already-YYYY-MM-DD or full ISO datetime
  const datePart = value.split("T")[0];
  return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : "";
}

function buildPatientDataFromUser(user: any): PatientFormData {
  if (!user) return EMPTY_PATIENT_FORM;
  return {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    dateOfBirth: toIsoDate(user.dateOfBirth),
    gender: mapUserGenderToForm(user.gender),
    phone: user.phone || user.phoneNumber || "",
    email: user.email || "",
    address: user.addressLine1 || user.address || "",
    city: user.city || "",
    state: (user.state || "").toUpperCase(),
    zipCode: user.zipCode || "",
  };
}

export default function CheckoutPatientInfoPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTotal = useCartStore((state) => state.getTotal);
  const cartPromoCode = useCartStore((state) => state.promoCode);
  const {
    patientInfo,
    order,
    setPatientInfo,
    setOrder,
    setAccessOrderPayload,
    setLastRecoveredAt,
  } = useCheckout();

  const [relation, setRelation] = useState<PatientRelation>(
    patientInfo?.relationToUser || "SELF",
  );
  const [localPatientData, setLocalPatientData] =
    useState<PatientFormData | null>(
      patientInfo && patientInfo.firstName
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
  const [formResetKey, setFormResetKey] = useState(0);

  const handleRelationChange = (next: PatientRelation) => {
    setRelation(next);
    if (next === "SELF") {
      setLocalPatientData(buildPatientDataFromUser(user));
    } else {
      setLocalPatientData(EMPTY_PATIENT_FORM);
    }
    setFormResetKey((k) => k + 1);
  };

  // Auto-fill once user profile loads, if SELF and form is empty.
  // Bridges async-loaded user profile into local form state.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (
      relation === "SELF" &&
      user &&
      (!localPatientData || !localPatientData.firstName)
    ) {
      setLocalPatientData(buildPatientDataFromUser(user));
      setFormResetKey((k) => k + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const [isPatientValid, setIsPatientValid] = useState(false);
  const [isRecovering, setIsRecovering] = useState(true);
  const [restrictionStatus, setRestrictionStatus] =
    useState<RestrictionStatus | null>(null);
  const [isRestrictionLoading, setIsRestrictionLoading] = useState(false);
  const hasHydratedResume = useRef(false);
  const {
    checkRestriction,
    publishStatus,
    status: globalRestrictionStatus,
  } = useRestrictionStatus();

  const processingFee = 2.5;
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?from=/checkout/patient-info`);
    }
  }, [isAuthenticated, isLoading, router]);

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
  const effectiveRestrictionStatus = isRestrictionBlocked(
    globalRestrictionStatus,
  )
    ? globalRestrictionStatus
    : restrictionStatus;
  const restrictionMessage = isRestrictionBlocked(effectiveRestrictionStatus)
    ? RESTRICTED_LOCATION_CHECKOUT
    : null;

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
            subtotal: resumableOrder.subtotal ?? getSubtotal(),
            processingFee: resumableOrder.processingFee ?? processingFee,
            total: resumableOrder.total ?? getTotal() + processingFee,
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

    if (isRestrictionBlocked(globalRestrictionStatus)) {
      publishStatus(globalRestrictionStatus, { showBanner: true });
      toast({
        title: "Location restricted",
        description: RESTRICTED_LOCATION_TOAST,
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

      let nextRestrictionStatus: RestrictionStatus | null = null;
      try {
        setIsRestrictionLoading(true);
        nextRestrictionStatus = await checkRestriction({
          checkoutState: localPatientData.state.trim().toUpperCase(),
          testId: primaryLabTestId,
        });
      } finally {
        setIsRestrictionLoading(false);
      }

      setRestrictionStatus(nextRestrictionStatus);

      if (nextRestrictionStatus?.canOrder === false) {
        publishStatus(nextRestrictionStatus);
        toast({
          title: "Location restricted",
          description: RESTRICTED_LOCATION_TOAST,
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
        relationToUser: relation,
      };

      setPatientInfo(patientInfoData);

      // Create pending order on server before navigating to payment
      setIsCreatingOrder(true);

      const createPayload = buildCreateOrderRequest({
        accessOrderPayload: accessPayload,
        getSubtotal: getSubtotal(),
        getTotal: getTotal(),
        labTestId: primaryLabTestId,
        patientInfo: patientInfoData as any,
        processingFee,
        promoCode: cartPromoCode || undefined,
        selectedLab: null,
      });

      const resp = await createOrder(createPayload);

      setOrder({
        orderId: resp.orderId,
        subtotal: resp.subtotal,
        processingFee: resp.processingFee,
        total: resp.total,
      });

      router.push(`/checkout/payment?orderId=${resp.orderId}`);
    } catch (err: any) {
      setIsCreatingOrder(false);
      toast({
        title: "Failed to Continue",
        description: err?.message || "Unable to continue. Please try again.",
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

            <Card className='border'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <Users className='h-4 w-4 text-primary' />
                  Who is this test for?
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='space-y-2'>
                  <Label htmlFor='relationToUser' className='text-sm'>
                    Patient&apos;s relation to you
                  </Label>
                  <Select
                    value={relation}
                    onValueChange={(v) =>
                      handleRelationChange(v as PatientRelation)
                    }
                  >
                    <SelectTrigger id='relationToUser' className='h-11'>
                      <SelectValue placeholder='Select relation' />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {relation === "SELF" ? (
                  <p className='text-xs text-muted-foreground'>
                    We auto-filled your profile details below. Please verify
                    them before continuing.
                  </p>
                ) : (
                  <p className='text-xs text-muted-foreground'>
                    Please fill in the patient&apos;s details below.
                  </p>
                )}
              </CardContent>
            </Card>

            <PatientInfoForm
              key={formResetKey}
              initialData={localPatientData || undefined}
              onFormChange={(data, valid) => {
                setLocalPatientData(data);
                setIsPatientValid(valid);
              }}
            />

            {restrictionMessage ? (
              <Alert className='border-red-200 bg-red-50 text-red-950 [&>svg]:text-red-700'>
                <AlertTriangle className='h-4 w-4' />
                <AlertTitle>Online ordering unavailable</AlertTitle>
                <AlertDescription>{restrictionMessage}</AlertDescription>
              </Alert>
            ) : null}

            <div className='flex justify-end'>
              <Button
                onClick={handleContinueToPayment}
                disabled={
                  !isPatientValid ||
                  isRestrictionLoading ||
                  isCreatingOrder ||
                  isRestrictionBlocked(effectiveRestrictionStatus)
                }
                className='h-12 px-8'
              >
                {isCreatingOrder ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating order...
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </CheckoutShell>
  );
}
