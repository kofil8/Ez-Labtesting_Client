"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getRestrictionStatus,
  RestrictionStatusParams,
} from "@/lib/services/state-restriction.service";
import { RestrictionStatus } from "@/types/restriction";

type RestrictionStatusContextValue = {
  status: RestrictionStatus | null;
  isLoading: boolean;
  lastCheckedAt: string | null;
  refreshStatus: (
    params?: RestrictionStatusParams,
  ) => Promise<RestrictionStatus | null>;
};

const RestrictionStatusContext =
  createContext<RestrictionStatusContextValue | null>(null);

export function RestrictionStatusProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [status, setStatus] = useState<RestrictionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);

  const refreshStatus = useCallback(
    async (params: RestrictionStatusParams = {}) => {
      setIsLoading(true);

      try {
        const nextStatus = await getRestrictionStatus(params);
        setStatus(nextStatus);
        setLastCheckedAt(nextStatus.lastCheckedAt ?? new Date().toISOString());
        return nextStatus;
      } catch {
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    const handleFocus = () => {
      void refreshStatus();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshStatus]);

  const value = useMemo(
    () => ({
      status,
      isLoading,
      lastCheckedAt,
      refreshStatus,
    }),
    [status, isLoading, lastCheckedAt, refreshStatus],
  );

  return (
    <RestrictionStatusContext.Provider value={value}>
      {children}
    </RestrictionStatusContext.Provider>
  );
}

export function useRestrictionStatus() {
  const context = useContext(RestrictionStatusContext);
  if (!context) {
    throw new Error(
      "useRestrictionStatus must be used within a RestrictionStatusProvider",
    );
  }

  return context;
}
