import { describe, expect, it } from "vitest";
import {
  getRestrictionAvailabilityLabel,
  getRestrictionIpDisplay,
  getRestrictionMessage,
  getRestrictionStateDisplay,
  getRestrictionStateLabel,
  isRestrictionBlocked,
} from "./presentation";

describe("restriction presentation helpers", () => {
  it("returns blocked copy and state labels for restricted users", () => {
    const status = {
      ip: null,
      maskedIp: "203.xxx.xxx.2",
      detectedStateCode: "NY",
      effectiveStateCode: "NY",
      laboratoryRoute: "ACCESS",
      restrictionType: "BLOCKED" as const,
      canOrder: false,
      reason: "Ordering is unavailable in your region.",
      source: "checkout_state" as const,
    };

    expect(isRestrictionBlocked(status)).toBe(true);
    expect(getRestrictionMessage(status)).toBe(
      "Ordering is unavailable in your region.",
    );
    expect(getRestrictionStateLabel(status)).toBe("NY");
    expect(getRestrictionStateDisplay(status)).toBe("New York");
    expect(getRestrictionIpDisplay(status)).toBe("203.xxx.xxx.2");
    expect(getRestrictionAvailabilityLabel(status)).toBe(
      "Online ordering restricted",
    );
  });

  it("returns physician-review copy and allowed availability labels", () => {
    const restricted = {
      ip: null,
      maskedIp: null,
      detectedStateCode: "MA",
      effectiveStateCode: "MA",
      laboratoryRoute: "ACCESS",
      restrictionType: "REQUIRES_PHYSICIAN" as const,
      canOrder: false,
      reason: null,
      source: "checkout_state" as const,
    };

    expect(getRestrictionMessage(restricted)).toBe(
      "Orders from your region require physician review and are not available online.",
    );

    expect(
      getRestrictionAvailabilityLabel({
        ...restricted,
        restrictionType: null,
        canOrder: true,
      }),
    ).toBe("Available for online ordering");

    expect(
      getRestrictionIpDisplay({
        ...restricted,
        ip: "203.0.113.24",
      }),
    ).toBe("203.0.113.24");
  });
});
