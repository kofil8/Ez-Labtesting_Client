"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
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
    options?: { force?: boolean },
  ) => Promise<RestrictionStatus | null>;
  checkRestriction: (
    params?: RestrictionStatusParams,
    options?: { force?: boolean },
  ) => Promise<RestrictionStatus | null>;
  publishStatus: (
    status: RestrictionStatus | null,
    options?: { showBanner?: boolean },
  ) => void;
  showRestrictionBanner: boolean;
};

const RestrictionStatusContext =
  createContext<RestrictionStatusContextValue | null>(null);

export function RestrictionStatusProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [status, setStatus] = useState<RestrictionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);
  const [showRestrictionBanner, setShowRestrictionBanner] = useState(false);
  const cacheRef = useRef(new Map<string, RestrictionStatus>());

  const buildCacheKey = useCallback((params: RestrictionStatusParams = {}) => {
    return JSON.stringify({
      checkoutState: params.checkoutState || "",
      laboratoryCode: params.laboratoryCode || "",
      laboratoryId: params.laboratoryId || "",
      publicIp: params.publicIp || "",
      testId: params.testId || "",
    });
  }, []);

  const refreshStatus = useCallback(
    async (
      params: RestrictionStatusParams = {},
      options: { force?: boolean } = {},
    ) => {
      const cacheKey = buildCacheKey(params);

      if (!options.force) {
        const cachedStatus = cacheRef.current.get(cacheKey);
        if (cachedStatus) {
          setStatus(cachedStatus);
          setLastCheckedAt(cachedStatus.lastCheckedAt ?? new Date().toISOString());
          return cachedStatus;
        }
      }

      setIsLoading(true);

      try {
        const nextStatus = await getRestrictionStatus(params);
        cacheRef.current.set(cacheKey, nextStatus);
        setStatus(nextStatus);
        setLastCheckedAt(nextStatus.lastCheckedAt ?? new Date().toISOString());
        return nextStatus;
      } catch {
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [buildCacheKey],
  );

  const publishStatus = useCallback((
    nextStatus: RestrictionStatus | null,
    options: { showBanner?: boolean } = {},
  ) => {
    setStatus(nextStatus);
    setLastCheckedAt(nextStatus?.lastCheckedAt ?? (nextStatus ? new Date().toISOString() : null));

    if (options.showBanner ?? nextStatus?.canOrder === false) {
      setShowRestrictionBanner(Boolean(nextStatus?.canOrder === false));
    }
  }, []);

  const value = useMemo(
    () => ({
      status,
      isLoading,
      lastCheckedAt,
      refreshStatus,
      checkRestriction: refreshStatus,
      publishStatus,
      showRestrictionBanner,
    }),
    [
      status,
      isLoading,
      lastCheckedAt,
      refreshStatus,
      publishStatus,
      showRestrictionBanner,
    ],
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
