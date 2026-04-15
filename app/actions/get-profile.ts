"use server";

import { Profile, Role, VerificationStatus } from "@/app/profile/types/profile";
import { authenticatedFetch } from "@/lib/api-helpers";

const VALID_ROLES: Role[] = ["customer", "lab_partner", "admin", "superadmin"];
const VALID_VERIFICATION: VerificationStatus[] = [
  "verified",
  "unverified",
  "pending",
];

function toRecord(value: unknown): Record<string, any> {
  if (value && typeof value === "object") {
    return value as Record<string, any>;
  }
  return {};
}

function toStringValue(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

function toOptionalString(value: unknown): string | undefined {
  const normalized = toStringValue(value);
  return normalized.length > 0 ? normalized : undefined;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => toStringValue(item))
      .filter((item) => item.length > 0);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function toIsoDate(value: unknown): string | undefined {
  const stringValue = toStringValue(value);
  if (!stringValue) {
    return undefined;
  }

  const parsed = new Date(stringValue);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function toGender(value: unknown): Profile["contactInfo"]["gender"] {
  const raw = toStringValue(value).toLowerCase();
  if (
    raw === "male" ||
    raw === "female" ||
    raw === "other" ||
    raw === "prefer_not_to_say"
  ) {
    return raw;
  }
  return undefined;
}

function toRole(value: unknown): Role {
  const normalized = toStringValue(value).toLowerCase();
  return VALID_ROLES.includes(normalized as Role)
    ? (normalized as Role)
    : "customer";
}

function toVerificationStatus(value: unknown): VerificationStatus {
  const normalized = toStringValue(value).toLowerCase();
  if (VALID_VERIFICATION.includes(normalized as VerificationStatus)) {
    return normalized as VerificationStatus;
  }
  return "unverified";
}

function calculateAge(dateOfBirth?: string): number | undefined {
  if (!dateOfBirth) {
    return undefined;
  }

  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) {
    return undefined;
  }

  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  const isBeforeBirthday =
    monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate());

  if (isBeforeBirthday) {
    age -= 1;
  }

  return age >= 0 ? age : undefined;
}

function normalizeProfile(rawProfile: unknown): Profile {
  const root = toRecord(rawProfile);
  const contactInfo = toRecord(root.contactInfo);
  const medicalInfo = toRecord(root.medicalInfo);
  const emergencyContact = toRecord(root.emergencyContact);
  const accountInfo = toRecord(root.accountInfo);
  const healthSummary = toRecord(root.healthSummary);

  const firstName = toStringValue(root.firstName) || "User";
  const lastName = toStringValue(root.lastName) || "";
  const email =
    toStringValue(root.email) || toStringValue(contactInfo.email) || "";
  const dateOfBirth =
    toIsoDate(contactInfo.dateOfBirth ?? root.dateOfBirth) ?? undefined;
  const memberSince =
    toIsoDate(accountInfo.memberSince ?? root.createdAt) ||
    new Date().toISOString();
  const createdAt = toIsoDate(root.createdAt) || memberSince;
  const updatedAt = toIsoDate(root.updatedAt) || createdAt;

  const testsDoneCandidate = Number(
    healthSummary.testsDone ?? root.testsDone ?? root.totalTests ?? 0,
  );
  const testsDone = Number.isFinite(testsDoneCandidate)
    ? Math.max(0, Math.floor(testsDoneCandidate))
    : 0;

  const bloodType = toOptionalString(medicalInfo.bloodType ?? root.bloodType);

  return {
    id: toStringValue(root.id) || toStringValue(root.userId) || "profile",
    firstName,
    lastName,
    displayName: toOptionalString(root.displayName),
    email,
    role: toRole(root.role),
    roleName: toOptionalString(root.roleName),
    avatarUrl: toOptionalString(root.avatarUrl ?? root.profileImage),
    contactInfo: {
      email,
      phone: toOptionalString(
        contactInfo.phone ?? root.phone ?? root.phoneNumber,
      ),
      dateOfBirth,
      gender: toGender(contactInfo.gender ?? root.gender),
      address: toOptionalString(contactInfo.address ?? root.address),
      addressLine1: toOptionalString(
        contactInfo.addressLine1 ?? root.addressLine1,
      ),
      addressLine2: toOptionalString(
        contactInfo.addressLine2 ?? root.addressLine2,
      ),
      city: toOptionalString(contactInfo.city ?? root.city),
      state: toOptionalString(contactInfo.state ?? root.state),
      zipCode: toOptionalString(contactInfo.zipCode ?? root.zipCode),
    },
    medicalInfo: {
      bloodType: bloodType as Profile["medicalInfo"]["bloodType"],
      allergies: toStringArray(medicalInfo.allergies ?? root.allergies),
      medicalConditions: toStringArray(
        medicalInfo.medicalConditions ?? root.medicalConditions,
      ),
      currentMedications: toStringArray(
        medicalInfo.currentMedications ?? root.medications,
      ),
    },
    emergencyContact: {
      name: toOptionalString(
        emergencyContact.name ?? root.emergencyContactName,
      ),
      phone: toOptionalString(
        emergencyContact.phone ?? root.emergencyContactPhone,
      ),
    },
    accountInfo: {
      verificationStatus: toVerificationStatus(
        accountInfo.verificationStatus ??
          (root.isVerified ? "verified" : "unverified"),
      ),
      memberSince,
    },
    healthSummary: {
      testsDone,
      age:
        typeof healthSummary.age === "number"
          ? healthSummary.age
          : calculateAge(dateOfBirth),
      bloodTypeSet: Boolean(bloodType),
    },
    createdAt,
    updatedAt,
  };
}

export async function getProfile() {
  try {
    const res = await authenticatedFetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://ezlabtesting-api.com/api/v1"
      }/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({
        message:
          "Unable to load your profile information. Your data remains secure.",
      }));

      throw new Error(
        error.message ||
          "Unable to load your profile information. Please refresh the page.",
      );
    }

    const data = await res.json();
    const normalizedProfile = normalizeProfile(data?.data || data);

    return { success: true, profile: normalizedProfile };
  } catch (error: any) {
    if (error?.message?.includes("Session expired")) {
      throw new Error("Session expired. Please log in again.");
    }
    throw error;
  }
}
