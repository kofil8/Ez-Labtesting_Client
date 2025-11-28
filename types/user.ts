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
  role: "customer" | "admin";
  createdAt: string;
  updatedAt?: string;
  isVerified?: boolean;
  mfaEnabled?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
