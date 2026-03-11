"use client";

import {
  SignupAccountFormData,
  SignupMedicalFormData,
} from "@/lib/schemas/auth-schemas";

const ACCOUNT_DRAFT_KEY = "register_account_draft_v1";

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const GENDER_OPTIONS = [
  { label: "Female", value: "FEMALE" },
  { label: "Male", value: "MALE" },
  { label: "Non-binary", value: "NON_BINARY" },
  { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" },
  { label: "Other", value: "OTHER" },
] as const;

export function saveAccountDraft(data: SignupAccountFormData) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ACCOUNT_DRAFT_KEY, JSON.stringify(data));
}

export function loadAccountDraft(): SignupAccountFormData | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(ACCOUNT_DRAFT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SignupAccountFormData;
  } catch {
    sessionStorage.removeItem(ACCOUNT_DRAFT_KEY);
    return null;
  }
}

export function clearAccountDraft() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ACCOUNT_DRAFT_KEY);
}

export function buildRegistrationFormData(
  account: SignupAccountFormData,
  medical?: SignupMedicalFormData,
): FormData {
  const formData = new FormData();

  formData.append("firstName", account.firstName);
  formData.append("lastName", account.lastName);
  formData.append("email", account.email);
  formData.append("password", account.password);
  formData.append("phoneNumber", account.phone);

  if (account.gender) {
    formData.append("gender", account.gender);
  }

  if (medical?.dateOfBirth) formData.append("dateOfBirth", medical.dateOfBirth);
  if (medical?.address) formData.append("address", medical.address);
  if (medical?.bloodType) formData.append("bloodType", medical.bloodType);
  if (medical?.allergies) formData.append("allergies", medical.allergies);
  if (medical?.medicalConditions)
    formData.append("medicalConditions", medical.medicalConditions);
  if (medical?.medications) formData.append("medications", medical.medications);
  if (medical?.emergencyContactName)
    formData.append("emergencyContactName", medical.emergencyContactName);
  if (medical?.emergencyContactPhone)
    formData.append("emergencyContactPhone", medical.emergencyContactPhone);

  return formData;
}
