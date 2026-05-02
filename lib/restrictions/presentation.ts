import { RestrictionStatus } from "@/types/restriction";

const BLOCKED_COPY = "Ordering is unavailable in your region.";
const REQUIRES_PHYSICIAN_COPY =
  "Orders from your region require physician review and are not available online.";
export const RESTRICTED_LOCATION_TOAST =
  "You are not allowed to order from this location.";
export const RESTRICTED_LOCATION_BANNER =
  "We’re coming soon to this location. Your IP location is currently restricted for online ordering.";
export const RESTRICTED_LOCATION_CHECKOUT =
  "We’re coming soon to this location. Your location is currently restricted for online ordering.";
const US_STATE_LABELS: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

export function isRestrictionBlocked(
  status?: RestrictionStatus | null,
): boolean {
  return Boolean(status && status.canOrder === false);
}

export function getRestrictionMessage(
  status?: RestrictionStatus | null,
): string | null {
  if (!status || status.canOrder) {
    return null;
  }

  if (status.reason) {
    return status.reason;
  }

  if (status.restrictionType === "REQUIRES_PHYSICIAN") {
    return REQUIRES_PHYSICIAN_COPY;
  }

  return BLOCKED_COPY;
}

export function getRestrictionStateLabel(
  status?: RestrictionStatus | null,
): string | null {
  return status?.effectiveStateCode || status?.detectedStateCode || null;
}

export function getRestrictionStateDisplay(
  status?: RestrictionStatus | null,
): string | null {
  const stateCode = getRestrictionStateLabel(status);

  if (!stateCode) {
    return null;
  }

  return US_STATE_LABELS[stateCode] || stateCode;
}

export function getRestrictionAvailabilityLabel(
  status?: RestrictionStatus | null,
): string {
  if (!status) {
    return "Location unavailable";
  }

  if (status.canOrder) {
    return "Available for online ordering";
  }

  if (status.restrictionType === "REQUIRES_PHYSICIAN") {
    return "Physician review required";
  }

  return "Online ordering restricted";
}

export function getRestrictionIpDisplay(
  status?: RestrictionStatus | null,
): string | null {
  if (!status) {
    return null;
  }

  return status.ip || status.maskedIp || null;
}
