"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CheckoutError {
  step: "order-later" | "confirm-to-lab" | "request-support";
  message: string;
  orderId: string;
  timestamp: number;
}

interface CheckoutErrorContextType {
  error: CheckoutError | null;
  setError: (error: CheckoutError | null) => void;
  clearError: () => void;
}

const CheckoutErrorContext = createContext<
  CheckoutErrorContextType | undefined
>(undefined);

export function CheckoutErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<CheckoutError | null>(null);

  // Load error from session storage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("checkoutError");
    if (stored) {
      try {
        setError(JSON.parse(stored));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Persist error to session storage whenever it changes
  useEffect(() => {
    if (error) {
      sessionStorage.setItem("checkoutError", JSON.stringify(error));
    } else {
      sessionStorage.removeItem("checkoutError");
    }
  }, [error]);

  const clearError = () => setError(null);

  return (
    <CheckoutErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </CheckoutErrorContext.Provider>
  );
}

export function useCheckoutError() {
  const context = useContext(CheckoutErrorContext);
  if (context === undefined) {
    throw new Error(
      "useCheckoutError must be used within CheckoutErrorProvider",
    );
  }
  return context;
}
