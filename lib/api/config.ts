const DEFAULT_API_PROXY_BASE = "/api/v1";

const configuredApiBases = [
  process.env.NEXT_PUBLIC_API_BASE_URL,
  process.env.NEXT_PUBLIC_API_URL,
]
  .filter((value): value is string => Boolean(value))
  .map((value) => value.replace(/\/+$/, ""));

export const API_PROXY_BASE = DEFAULT_API_PROXY_BASE;

export function getApiUrl(endpoint: string): string {
  const normalizedEndpoint = endpoint.trim();

  if (!normalizedEndpoint) {
    return API_PROXY_BASE;
  }

  if (/^https?:\/\//i.test(normalizedEndpoint)) {
    const matchingBase = configuredApiBases.find((base) =>
      normalizedEndpoint.startsWith(base),
    );

    if (!matchingBase) {
      return normalizedEndpoint;
    }

    const url = new URL(normalizedEndpoint);
    return `${API_PROXY_BASE}${url.pathname.replace(/^\/api\/v1/, "")}${url.search}${url.hash}`;
  }

  if (normalizedEndpoint.startsWith(API_PROXY_BASE)) {
    return normalizedEndpoint;
  }

  if (normalizedEndpoint.startsWith("/")) {
    return `${API_PROXY_BASE}${normalizedEndpoint}`;
  }

  return `${API_PROXY_BASE}/${normalizedEndpoint}`;
}

export function getApiOrigin(): string {
  const configuredBase =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;

  if (configuredBase) {
    return configuredBase.replace(/\/api\/v1\/?$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:7001";
}
