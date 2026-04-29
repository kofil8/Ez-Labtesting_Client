import { ProviderCode } from "@/types/lab-center";

export const PROVIDER_LABELS: Record<ProviderCode, string> = {
  ACCESS: "Access Medical Labs",
  CPL: "Clinical Pathology Laboratories",
  QUEST: "Quest Diagnostics",
  LABCORP: "Labcorp",
};

const NATIONWIDE_SEARCH_ALIASES = new Set([
  "us",
  "usa",
  "united states",
  "united states of america",
]);

export function getProviderLabel(providerCode: ProviderCode): string {
  return PROVIDER_LABELS[providerCode];
}

export function isNationwideSearchQuery(query: string): boolean {
  return NATIONWIDE_SEARCH_ALIASES.has(query.trim().toLowerCase());
}
