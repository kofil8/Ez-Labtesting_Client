export function isAuthSessionErrorMessage(message: string | null | undefined) {
  const normalized = (message || "").toLowerCase();

  return (
    normalized.includes("session expired") ||
    normalized.includes("missing token") ||
    normalized.includes("refresh token missing") ||
    normalized.includes("unauthorized") ||
    normalized.includes("not authenticated") ||
    normalized.includes("authentication failed") ||
    normalized.includes("invalid token") ||
    normalized.includes("jwt expired") ||
    normalized.includes("token expired")
  );
}

export function isAuthSessionError(error: unknown) {
  return (
    error instanceof Error && isAuthSessionErrorMessage(error.message)
  );
}
