export type RestrictionType =
  | "ALLOWED"
  | "BLOCKED"
  | "REQUIRES_PHYSICIAN"
  | null;

export type RestrictionSource =
  | "geo_header"
  | "ip_lookup"
  | "checkout_state"
  | "unknown";

export interface RestrictionStatus {
  ip: string | null;
  maskedIp: string | null;
  detectedStateCode: string | null;
  effectiveStateCode: string | null;
  laboratoryRoute: string | null;
  restrictionType: RestrictionType;
  canOrder: boolean;
  reason: string | null;
  source: RestrictionSource;
  lastCheckedAt?: string;
}

export type RestrictionStatusResponse = RestrictionStatus;
