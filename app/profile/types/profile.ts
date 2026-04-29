// Profile types for medical lab testing app

export type Role = "customer" | "lab_partner" | "admin" | "superadmin";
export type VerificationStatus = "verified" | "unverified" | "pending";

export interface ContactInfo {
  email?: string;
  phone?: string;
  dateOfBirth?: string; // ISO date string
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface MedicalInfo {
  bloodType?: "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-";
  allergies?: string[];
  medicalConditions?: string[];
  currentMedications?: string[];
}

export interface EmergencyContact {
  name?: string;
  phone?: string;
}

export interface AccountInfo {
  verificationStatus: VerificationStatus;
  memberSince: string; // ISO date string
}

export interface HealthSummary {
  testsDone: number;
  age?: number;
  bloodTypeSet: boolean;
}

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  username?: string;
  bio?: string;
  displayName?: string;
  email: string;
  role: Role;
  roleName?: string; // For display (e.g., "Super Admin", "Patient")
  status?: string;
  isVerified?: boolean;
  avatarUrl?: string;
  contactInfo: ContactInfo;
  medicalInfo: MedicalInfo;
  emergencyContact: EmergencyContact;
  accountInfo: AccountInfo;
  healthSummary: HealthSummary;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  bloodType?: string;
  allergies?: string[];
  medicalConditions?: string[];
  currentMedications?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}
