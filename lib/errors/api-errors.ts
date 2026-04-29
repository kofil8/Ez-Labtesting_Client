export const RATE_LIMIT_BLOCKED_MESSAGE =
  "Too many requests from this IP, your IP is blocked.";

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "";
}

export function isRateLimitBlockedError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("too many requests") ||
    message.includes("rate limit") ||
    message.includes("ip blocked") ||
    message.includes("status 429")
  );
}
