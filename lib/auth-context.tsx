"use client";

import { AuthState, User } from "@/types/user";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/* ------------------------------------------------------
   TYPES
------------------------------------------------------ */
interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
}

interface AuthContextType extends AuthState {
  refreshAuth: () => Promise<boolean>;
  logout: (pushToken?: string | null) => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (
    data: UpdateProfileData,
    file?: File
  ) => Promise<{ success: boolean; profile?: User }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ------------------------------------------------------
   CONSTANTS
------------------------------------------------------ */
const AUTH_TOKEN_KEY = "auth_token";
const USER_KEY = "user";
const AUTH_COOKIE_NAME = "accessToken";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/* ------------------------------------------------------
   TOKEN HELPERS
------------------------------------------------------ */
/**
 * Get or create a token placeholder for auth state
 * Note: Real authentication is handled via httpOnly cookies server-side
 * This token is just for client-side state management
 */
function getOrCreateToken(): string {
  if (typeof window === "undefined") return "authenticated";
  
  const existingToken = localStorage.getItem(AUTH_TOKEN_KEY);
  if (existingToken) {
    return existingToken;
  }
  
  // Create a placeholder token to indicate authenticated state
  // The actual auth is handled by httpOnly cookies
  const placeholderToken = "authenticated";
  localStorage.setItem(AUTH_TOKEN_KEY, placeholderToken);
  return placeholderToken;
}

/* ------------------------------------------------------
   PERSISTENCE HELPERS
------------------------------------------------------ */
function setAuthPersistence(token: string, user: User) {
  if (typeof window === "undefined") return;

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Note: Server-side actions set httpOnly cookies, so we don't set them here
  // This is just for client-side reference
}

function clearAuthPersistence() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem("otp_email");

  const past = new Date(0).toUTCString();

  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=${past}`;
  document.cookie = `refreshToken=; path=/; expires=${past}`;
}

/* ------------------------------------------------------
   PROVIDER
------------------------------------------------------ */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  /* ------------------------------------------------------
     INITIALIZATION
     - Load user from localStorage if available
     - If user exists, verify with server on mount (optional)
  ------------------------------------------------------ */
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);

    if (token && rawUser) {
      try {
        const user = JSON.parse(rawUser);

        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        return;
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        clearAuthPersistence();
      }
    }

    setAuthState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  /* ------------------------------------------------------
     FETCH PROFILE
     - Fetches user profile from server and updates auth state
     - Uses httpOnly cookie for authentication (server-side)
  ------------------------------------------------------ */
  const fetchProfile = useCallback(async (): Promise<void> => {
    try {
      const { getProfile } = await import("@/app/actions/get-profile");
      const result = await getProfile();

      if (result?.success && result.profile) {
        // Get or create token placeholder (real auth is via httpOnly cookie)
        const token = getOrCreateToken();

        setAuthPersistence(token, result.profile);

        setAuthState({
          user: result.profile,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error("Failed to fetch profile");
      }
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);

      // If session expired or not authenticated, clear auth state
      if (
        error?.message?.includes("Session expired") ||
        error?.message?.includes("Not authenticated")
      ) {
        clearAuthPersistence();
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
      throw error;
    }
  }, []);

  /* ------------------------------------------------------
     REFRESH AUTH
     - Refreshes user profile from server
     - Uses httpOnly cookie for authentication (server-side)
     - Called after login/verify-otp to initialize auth state
  ------------------------------------------------------ */
  const refreshAuth = useCallback(async (): Promise<boolean> => {
    try {
      const { getProfile } = await import("@/app/actions/get-profile");
      const result = await getProfile();

      if (result?.success && result.profile) {
        // Get or create token placeholder (real auth is via httpOnly cookie)
        const token = getOrCreateToken();

        setAuthPersistence(token, result.profile);

        setAuthState({
          user: result.profile,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        return true;
      }
    } catch (error: any) {
      console.error("Failed to refresh auth:", error);

      // Clear auth state on authentication errors
      if (
        error?.message?.includes("Session expired") ||
        error?.message?.includes("Not authenticated")
      ) {
        clearAuthPersistence();
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
      return false;
    }

    return false;
  }, []);

  /* ------------------------------------------------------
     UPDATE PROFILE
     - Updates user profile via server action
     - Automatically refreshes profile after successful update
  ------------------------------------------------------ */
  const updateProfile = useCallback(
    async (
      data: UpdateProfileData,
      file?: File
    ): Promise<{ success: boolean; profile?: User }> => {
      try {
        const { updateProfile: updateProfileAction } = await import(
          "@/app/actions/update-profile"
        );

        // Create FormData for the server action
        const formData = new FormData();
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        if (data.phone) {
          formData.append("phone", data.phone);
        }
        if (data.dateOfBirth) {
          formData.append("dateOfBirth", data.dateOfBirth);
        }
        if (file) {
          formData.append("file", file);
        }

        const result = await updateProfileAction(formData);

        if (result?.success && result.profile) {
          // Update auth state with new profile data
          const token = getOrCreateToken();

          setAuthPersistence(token, result.profile);
          setAuthState((prev) => ({
            ...prev,
            user: result.profile!,
            token,
            isAuthenticated: true,
          }));

          return { success: true, profile: result.profile };
        }

        throw new Error("Failed to update profile");
      } catch (error: any) {
        console.error("Failed to update profile:", error);

        // If session expired, clear auth state
        if (
          error?.message?.includes("Session expired") ||
          error?.message?.includes("Not authenticated")
        ) {
          clearAuthPersistence();
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
        throw error;
      }
    },
    []
  );

  /* ------------------------------------------------------
     LOGOUT
     - Clears auth persistence and calls server logout
     - Unregisters FCM push token if provided
  ------------------------------------------------------ */
  const logout = useCallback(
    async (pushToken?: string | null): Promise<void> => {
      clearAuthPersistence();

      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

      try {
        const { logoutUser } = await import("@/app/actions/logout-user");
        await logoutUser(pushToken || "");
      } catch (err) {
        console.error("Logout failed:", err);
        // Don't throw - auth state is already cleared
      }
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        refreshAuth,
        logout,
        fetchProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ------------------------------------------------------
   HOOK
------------------------------------------------------ */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
