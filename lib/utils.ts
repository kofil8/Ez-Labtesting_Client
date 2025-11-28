import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Returns the profile image URL as-is
 * Validates that the URL is a valid string and not empty
 */
export function getProfileImageUrl(
  profileImage?: string | null
): string | undefined {
  if (!profileImage || typeof profileImage !== "string") {
    return undefined;
  }

  // Trim whitespace and check if it's a valid URL or path
  const trimmed = profileImage.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") {
    return undefined;
  }

  // Return the image URL as-is (no API proxy)
  return trimmed;
}
