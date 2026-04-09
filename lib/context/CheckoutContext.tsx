"use client";

import { AccessOrderPayload } from "@/lib/api-contracts/access-order.contract";
import {
  clearSelectedLabCenter,
  readSelectedLabCenter,
  writeSelectedLabCenter,
} from "@/lib/locator/selected-lab-session";
import { SelectedLabCenter } from "@/types/lab-center";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CheckoutStep = "PATIENT" | "PAYMENT" | "VISIT_LAB" | "CONFIRMATION";

export interface PatientInfo {
  firstName: string;
  lastName: string;
  dob: string; // ISO date string
  gender: "Male" | "Female" | "Other" | "";
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OrderData {
  orderId: string;
  subtotal: number;
  processingFee: number;
  total: number;
}

interface CheckoutContextType {
  step: CheckoutStep;
  patientInfo: PatientInfo;
  orderId: string | null;
  order: OrderData | null;
  selectedLab: SelectedLabCenter | null;
  accessOrderPayload: AccessOrderPayload | null;
  lastRecoveredAt: number | null;
  goToStep: (nextStep: CheckoutStep) => boolean;
  setPatientInfo: (info: Partial<PatientInfo>) => void;
  setOrderId: (id: string) => void;
  setOrder: (order: OrderData) => void;
  setSelectedLab: (lab: SelectedLabCenter | null) => void;
  setAccessOrderPayload: (payload: AccessOrderPayload) => void;
  setLastRecoveredAt: (timestamp: number | null) => void;
  resetCheckout: () => void;
  validatePatientInfo: () => boolean;
  validateAccessFields: () => boolean;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

const initialPatientInfo: PatientInfo = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
};

export const CheckoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [step, setStep] = useState<CheckoutStep>("PATIENT");
  const [patientInfo, setPatientInfoState] =
    useState<PatientInfo>(initialPatientInfo);
  const [orderId, setOrderIdState] = useState<string | null>(null);
  const [order, setOrderState] = useState<OrderData | null>(null);
  const [selectedLab, setSelectedLabState] = useState<SelectedLabCenter | null>(
    null,
  );
  const [accessOrderPayload, setAccessOrderPayloadState] =
    useState<AccessOrderPayload | null>(null);
  const [lastRecoveredAt, setLastRecoveredAtState] = useState<number | null>(
    null,
  );

  type CheckoutPersistedState = {
    step?: CheckoutStep;
    orderId?: string | null;
    order?: OrderData | null;
    selectedLab?: SelectedLabCenter | null;
    lastRecoveredAt?: number | null;
  };

  // Load from sessionStorage on mount
  useEffect(() => {
    const savedCheckout = sessionStorage.getItem("checkout-storage");
    if (savedCheckout) {
      try {
        const parsed = JSON.parse(savedCheckout) as CheckoutPersistedState;
        if (parsed.step) setStep(parsed.step);
        if (typeof parsed.orderId === "string") setOrderIdState(parsed.orderId);
        if (parsed.order) setOrderState(parsed.order);
        if (parsed.selectedLab) {
          setSelectedLabState(parsed.selectedLab);
        } else {
          setSelectedLabState(readSelectedLabCenter());
        }
        if (parsed.lastRecoveredAt)
          setLastRecoveredAtState(parsed.lastRecoveredAt);
      } catch {
        // Ignore invalid persisted state and continue with a clean checkout session.
        setSelectedLabState(readSelectedLabCenter());
      }
    } else {
      setSelectedLabState(readSelectedLabCenter());
    }
  }, []);

  // Persist only minimal recovery fields (no PHI).
  useEffect(() => {
    const persisted: CheckoutPersistedState = {
      step,
      orderId,
      order,
      selectedLab,
      lastRecoveredAt,
    };

    sessionStorage.setItem("checkout-storage", JSON.stringify(persisted));
  }, [step, orderId, order, selectedLab, lastRecoveredAt]);

  const validatePatientInfo = useCallback((): boolean => {
    const required = [
      "firstName",
      "lastName",
      "dob",
      "gender",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
    ];
    return required.every((field) => {
      const value = patientInfo[field as keyof PatientInfo];
      return value && value.toString().trim() !== "";
    });
  }, [patientInfo]);

  const validateAccessFields = useCallback((): boolean => {
    if (!accessOrderPayload) return false;
    const { patient } = accessOrderPayload;
    return !!(
      patient.firstName &&
      patient.lastName &&
      patient.dateOfBirth &&
      patient.gender &&
      patient.phone &&
      patient.email &&
      accessOrderPayload.testCode &&
      accessOrderPayload.collectionType
    );
  }, [accessOrderPayload]);

  const goToStep = useCallback(
    (nextStep: CheckoutStep): boolean => {
      // Validate transitions
      if (nextStep === "PAYMENT") {
        if (!validatePatientInfo()) {
          return false; // Block transition
        }
      }

      if (nextStep === "VISIT_LAB") {
        if (!validatePatientInfo()) {
          return false; // Block transition
        }
      }

      if (nextStep === "CONFIRMATION") {
        if (!validatePatientInfo()) {
          return false;
        }
      }

      setStep(nextStep);
      return true;
    },
    [validatePatientInfo],
  );

  const setPatientInfo = useCallback((info: Partial<PatientInfo>) => {
    setPatientInfoState((prev) => ({ ...prev, ...info }));
  }, []);

  const setOrderId = useCallback((id: string) => {
    setOrderIdState(id);
  }, []);

  const setOrder = useCallback((orderData: OrderData) => {
    setOrderState(orderData);
    setOrderIdState(orderData.orderId);
  }, []);

  const setSelectedLab = useCallback((lab: SelectedLabCenter | null) => {
    setSelectedLabState(lab);
    if (lab) {
      writeSelectedLabCenter(lab);
      return;
    }

    clearSelectedLabCenter();
  }, []);

  const setAccessOrderPayload = useCallback((payload: AccessOrderPayload) => {
    setAccessOrderPayloadState(payload);
  }, []);

  const setLastRecoveredAt = useCallback((timestamp: number | null) => {
    setLastRecoveredAtState(timestamp);
  }, []);

  const resetCheckout = useCallback(() => {
    setStep("PATIENT");
    setPatientInfoState(initialPatientInfo);
    setOrderIdState(null);
    setOrderState(null);
    setAccessOrderPayloadState(null);
    setLastRecoveredAtState(null);
    sessionStorage.removeItem("checkout-storage");
  }, []);

  const contextValue = useMemo(
    () => ({
      step,
      patientInfo,
      orderId,
      order,
      selectedLab,
      accessOrderPayload,
      goToStep,
      setPatientInfo,
      setOrderId,
      setOrder,
      setSelectedLab,
      setAccessOrderPayload,
      setLastRecoveredAt,
      resetCheckout,
      validatePatientInfo,
      validateAccessFields,
      lastRecoveredAt,
    }),
    [
      accessOrderPayload,
      goToStep,
      lastRecoveredAt,
      order,
      orderId,
      patientInfo,
      resetCheckout,
      setAccessOrderPayload,
      setLastRecoveredAt,
      setOrder,
      setOrderId,
      setPatientInfo,
      setSelectedLab,
      selectedLab,
      step,
      validateAccessFields,
      validatePatientInfo,
    ],
  );

  return (
    <CheckoutContext.Provider value={contextValue}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};
