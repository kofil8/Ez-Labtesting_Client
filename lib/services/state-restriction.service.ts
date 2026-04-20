"use client";

import { extractApiMessage } from "@/lib/auth/shared";
import { API_ENDPOINTS } from "@/lib/api-contracts/endpoints";
import { publicFetch } from "@/lib/api-client";
import {
  RestrictionStatus,
  RestrictionStatusResponse,
} from "@/types/restriction";

export type RestrictionStatusParams = {
  checkoutState?: string;
  testId?: string;
  laboratoryId?: string;
  publicIp?: string;
  laboratoryCode?: string;
};

type PublicIpLookupResponse = {
  ip?: string;
};

export function isRegionRestrictedError(payload: unknown): payload is {
  code: string;
  details?: Record<string, unknown>;
  message?: string;
} {
  return Boolean(
    payload &&
      typeof payload === "object" &&
      "code" in payload &&
      (payload as { code?: string }).code === "REGION_RESTRICTED",
  );
}

export async function getRestrictionStatus(
  params: RestrictionStatusParams = {},
): Promise<RestrictionStatusResponse> {
  const fetchLocationStatus = async (
    nextParams: RestrictionStatusParams,
  ): Promise<RestrictionStatusResponse> => {
    const response = await publicFetch(
      API_ENDPOINTS.STATE_RESTRICTIONS.LOCATION_STATUS(nextParams),
      {
        method: "GET",
      },
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        extractApiMessage(
          payload,
          "Failed to load location restriction status.",
        ),
      );
    }

    return (payload?.data ?? payload) as RestrictionStatusResponse;
  };

  const initialStatus = await fetchLocationStatus(params);

  if (initialStatus.ip || params.publicIp) {
    return {
      ...initialStatus,
      lastCheckedAt: new Date().toISOString(),
    };
  }

  if (typeof fetch !== "function") {
    return {
      ...initialStatus,
      lastCheckedAt: new Date().toISOString(),
    };
  }

  try {
    const publicIpResponse = await fetch("https://api.ipify.org?format=json", {
      cache: "no-store",
    });
    const publicIpPayload =
      (await publicIpResponse.json().catch(() => null)) as
        | PublicIpLookupResponse
        | null;
    const publicIp = publicIpPayload?.ip?.trim();

    if (publicIp) {
      const fallbackStatus = await fetchLocationStatus({
        ...params,
        publicIp,
      });

      return {
        ...fallbackStatus,
        lastCheckedAt: new Date().toISOString(),
      };
    }
  } catch {
    // ignore fallback failure and keep the original status
  }

  return {
    ...initialStatus,
    lastCheckedAt: new Date().toISOString(),
  };
}
