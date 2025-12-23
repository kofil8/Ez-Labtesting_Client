export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  phoneNumber?: string; // Backend uses phoneNumber
  dateOfBirth?: string;
  profileImage?: string;
  bio?: string;
  role: "customer" | "admin" | "lab_partner";
  createdAt: string;
  updatedAt?: string;
  isVerified?: boolean;
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
