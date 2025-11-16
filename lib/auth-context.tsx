"use client";

import { AuthState, User } from "@/types/user";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string,
    recaptchaToken: string
  ) => Promise<{ requiresMFA: boolean }>;
  verifyMFA: (code: string) => Promise<boolean>;
  signup: (
    userData: Partial<User> & { password: string },
    recaptchaToken: string
  ) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Keys / names shared between client and middleware
const AUTH_TOKEN_KEY = "auth_token";
const USER_KEY = "user";
const AUTH_COOKIE_NAME = "auth_token";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function setAuthPersistence(token: string, user: User) {
  if (typeof window === "undefined") return;

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Make token visible to Next.js middleware via cookie
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; sameSite=Lax`;
}

function clearAuthPersistence() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem("temp_user");

  // Clear auth cookie so middleware sees user as logged out
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; sameSite=Lax`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored auth on mount
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        token: storedToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    recaptchaToken: string
  ): Promise<{ requiresMFA: boolean }> => {
    // Validate reCAPTCHA token
    if (!recaptchaToken) {
      throw new Error("reCAPTCHA verification is required");
    }

    // In production, verify the reCAPTCHA token with Google's API
    // For now, we'll just check that it exists
    // TODO: Add server-side reCAPTCHA verification

    // Mock login logic
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock user data
    const mockUser: User = {
      id: "user-1",
      email,
      firstName: "John",
      lastName: "Doe",
      role: email.includes("admin") ? "admin" : "customer",
      createdAt: new Date().toISOString(),
      mfaEnabled: email.includes("mfa"),
    };

    const requiresMFA = mockUser.mfaEnabled;

    if (!requiresMFA) {
      const token = `token-${Date.now()}`;
      setAuthPersistence(token, mockUser);

      setAuthState({
        user: mockUser,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      // Store temporary user data for MFA verification
      sessionStorage.setItem("temp_user", JSON.stringify(mockUser));
    }

    return { requiresMFA };
  };

  const verifyMFA = async (code: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock MFA verification (accept any 6-digit code)
    if (code.length === 6) {
      const tempUser = sessionStorage.getItem("temp_user");
      if (tempUser) {
        const user: User = JSON.parse(tempUser);
        const token = `token-${Date.now()}`;

        setAuthPersistence(token, user);
        sessionStorage.removeItem("temp_user");

        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        return true;
      }
    }

    return false;
  };

  const signup = async (
    userData: Partial<User> & { password: string },
    recaptchaToken: string
  ): Promise<void> => {
    // Validate reCAPTCHA token
    if (!recaptchaToken) {
      throw new Error("reCAPTCHA verification is required");
    }

    // In production, verify the reCAPTCHA token with Google's API
    // For now, we'll just check that it exists
    // TODO: Add server-side reCAPTCHA verification

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email!,
      firstName: userData.firstName!,
      lastName: userData.lastName!,
      phone: userData.phone,
      role: "customer",
      createdAt: new Date().toISOString(),
      mfaEnabled: false,
    };

    const token = `token-${Date.now()}`;
    setAuthPersistence(token, newUser);

    setAuthState({
      user: newUser,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    clearAuthPersistence();

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock sending reset email
    // In production, this would send an email with a reset token
    sessionStorage.setItem("reset_email", email);
    console.log(`Password reset link sent to ${email}`);

    return true;
  };

  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock password reset
    // In production, this would validate the token and update the password
    const resetEmail = sessionStorage.getItem("reset_email");
    if (resetEmail) {
      sessionStorage.removeItem("reset_email");
      console.log(`Password reset for ${resetEmail}`);
      return true;
    }

    return false;
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!authState.user) return false;

    // Mock profile update
    const updatedUser: User = {
      ...authState.user,
      ...userData,
    };

    setAuthPersistence(authState.token!, updatedUser);
    setAuthState({
      user: updatedUser,
      token: authState.token,
      isAuthenticated: true,
      isLoading: false,
    });

    return true;
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock password change
    // In production, this would verify the current password and update to the new one
    if (currentPassword && newPassword) {
      console.log("Password changed successfully");
      return true;
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        verifyMFA,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
