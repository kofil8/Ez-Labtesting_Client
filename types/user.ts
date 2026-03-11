export interface User {
  id: string;
  email: string;
  password?: string; // Only for create/update operations
  firstName: string;
  lastName: string;
  phone?: string;
  phoneNumber?: string;
  gender?: "MALE" | "FEMALE" | "NON_BINARY" | "PREFER_NOT_TO_SAY" | "OTHER";
  dateOfBirth?: string;
  profileImage?: string;
  bio?: string;

  // Address information
  address?: string;

  // Medical information
  bloodType?: string;
  allergies?: string;
  medicalConditions?: string;
  medications?: string;

  // Emergency contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  // Account details
  role:
    | "customer"
    | "admin"
    | "lab_partner"
    | "super_admin"
    | "SUPER_ADMIN"
    | "ADMIN"
    | "CUSTOMER"
    | "LAB_PARTNER";
  status?:
    | "ACTIVE"
    | "DISABLED"
    | "BLOCKED"
    | "active"
    | "disabled"
    | "blocked";
  createdAt: string;
  updatedAt?: string;
  isVerified?: boolean;
  lastLogin?: string;
  lastAction?: string;
  mfaEnabled?: boolean;

  // Lab Partner specific fields
  labName?: string;
  labLocation?: string;
  labCertifications?: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
