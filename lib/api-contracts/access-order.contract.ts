/**
 * ACCESS Lab Order Contracts
 *
 * These interfaces define the data structure required for submitting
 * orders to ACCESS Lab via CSV upload. All fields are mandatory unless
 * explicitly marked as optional.
 *
 * DO NOT modify these without verifying against ACCESS Lab CSV requirements.
 */

/**
 * Patient information required by ACCESS Lab
 * All fields are MANDATORY for order submission
 */
export interface AccessPatientInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // Format: MMDDYYYY (e.g., "01151990")
  gender: "M" | "F" | "O"; // Male, Female, Other
  phone: string; // 10 digits, no formatting
  email: string; // Valid email address
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

/**
 * Complete payload required for ACCESS Lab order
 * This matches the CSV structure needed for order submission
 */
export interface AccessOrderPayload {
  testCode: string; // Lab test identifier (e.g., "TEST-001")
  collectionType: "PSC"; // Patient Service Center (only supported type)
  patient: AccessPatientInfo;
}

/**
 * Validation helper: Check if all required fields are present
 */
export function isAccessOrderPayloadComplete(
  payload: Partial<AccessOrderPayload> | null,
): payload is AccessOrderPayload {
  if (!payload) return false;
  if (!payload.testCode || !payload.collectionType) return false;
  if (!payload.patient) return false;

  const { patient } = payload;
  return !!(
    patient.firstName &&
    patient.lastName &&
    patient.dateOfBirth &&
    patient.gender &&
    patient.phone &&
    patient.email
  );
}

/**
 * Validation helper: Validate date of birth format (MMDDYYYY)
 */
export function validateDobFormat(dob: string): boolean {
  if (!dob) return false;

  // Must be exactly 8 digits
  if (!/^\d{8}$/.test(dob)) return false;

  // Parse month, day, year
  const month = parseInt(dob.substring(0, 2), 10);
  const day = parseInt(dob.substring(2, 4), 10);
  const year = parseInt(dob.substring(4, 8), 10);

  // Validate ranges
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;

  return true;
}

/**
 * Validation helper: Validate phone format (10 digits)
 */
export function validatePhoneFormat(phone: string): boolean {
  if (!phone) return false;
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length === 10;
}

/**
 * Validation helper: Validate email format
 */
export function validateEmailFormat(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
