import { describe, expect, it, vi } from "vitest";
import {
  getRestrictionStatus,
  isRegionRestrictedError,
} from "./state-restriction.service";

describe("state restriction service", () => {
  it("fetches the public location status payload", async () => {
    vi.restoreAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            ip: "203.0.113.2",
            maskedIp: "203.xxx.xxx.2",
            detectedStateCode: "CA",
            effectiveStateCode: "CA",
            laboratoryRoute: "ACCESS",
            restrictionType: null,
            canOrder: true,
            reason: null,
            source: "geo_header",
          },
        }),
      }),
    );

    await expect(
      getRestrictionStatus({ checkoutState: "CA", testId: "test-1" }),
    ).resolves.toEqual(
      expect.objectContaining({
        ip: "203.0.113.2",
        maskedIp: "203.xxx.xxx.2",
        effectiveStateCode: "CA",
        canOrder: true,
        lastCheckedAt: expect.any(String),
      }),
    );
  });

  it("retries the status lookup with a browser-discovered public ip", async () => {
    vi.restoreAllMocks();

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            ip: null,
            maskedIp: null,
            detectedStateCode: null,
            effectiveStateCode: null,
            laboratoryRoute: "ACCESS",
            restrictionType: null,
            canOrder: true,
            reason: null,
            source: "unknown",
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ip: "203.0.113.24",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            ip: "203.0.113.24",
            maskedIp: "203.xxx.xxx.24",
            detectedStateCode: "CA",
            effectiveStateCode: "CA",
            laboratoryRoute: "ACCESS",
            restrictionType: null,
            canOrder: true,
            reason: null,
            source: "ip_lookup",
          },
        }),
      });

    vi.stubGlobal("fetch", fetchMock);

    await expect(getRestrictionStatus()).resolves.toEqual(
      expect.objectContaining({
        ip: "203.0.113.24",
        maskedIp: "203.xxx.xxx.24",
        effectiveStateCode: "CA",
        source: "ip_lookup",
        lastCheckedAt: expect.any(String),
      }),
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.ipify.org?format=json",
      { cache: "no-store" },
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("detects REGION_RESTRICTED error payloads", () => {
    vi.restoreAllMocks();
    expect(
      isRegionRestrictedError({
        code: "REGION_RESTRICTED",
        details: { stateCode: "NY" },
      }),
    ).toBe(true);
    expect(isRegionRestrictedError({ code: "OTHER_ERROR" })).toBe(false);
  });
});
