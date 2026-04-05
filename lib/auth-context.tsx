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
  gender?: string;
  dateOfBirth?: string;
}

interface AuthContextType extends AuthState {
  refreshAuth: () => Promise<boolean>;
  logout: (pushToken?: string | null) => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (
    data: UpdateProfileData,
    file?: File,
  ) => Promise<{ success: boolean; profile?: User }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ------------------------------------------------------
   CONSTANTS
------------------------------------------------------ */
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_COOKIE_NAME = "accessToken";

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

function normalizeRole(role: string | null | undefined): User["role"] {
  switch (role?.toLowerCase()) {
    case "superadmin":
    case "super_admin":
      return "super_admin";
    case "admin":
      return "admin";
    case "lab_partner":
      return "lab_partner";
    case "customer":
    default:
      return "customer";
  }
}

function toAuthUser(profile: any): User {
  return {
    ...profile,
    role: normalizeRole(profile?.role),
  };
}

/* ------------------------------------------------------
   PERSISTENCE HELPERS
------------------------------------------------------ */
function setAuthPersistence(token: string, _user: User) {
  if (typeof window === "undefined") return;

  localStorage.setItem(AUTH_TOKEN_KEY, token);

  // Note: Server-side actions set httpOnly cookies, so we don't set them here
  // This is just for client-side reference
}

function clearAuthPersistence() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_TOKEN_KEY);
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
     - Decode JWT token from cookie (client-side)
     - Verify token hasn't expired
      - Extract user info without API call
      - Never trust localStorage as an authentication source
  ------------------------------------------------------ */
  useEffect(() => {
    const initializeAuth = async () => {
      // Try to decode token from httpOnly cookie indirectly via a server action
      try {
        const { getAccessTokenFromServer } =
          await import("@/app/actions/get-token");
        const tokenResult = await getAccessTokenFromServer();

        if (tokenResult?.token) {
          const { isTokenValid, getUserFromToken } =
            await import("@/lib/token-utils");

          // Verify token is valid (not expired)
          if (isTokenValid(tokenResult.token)) {
            const userInfo = getUserFromToken(tokenResult.token);
            if (userInfo) {
              // Create a user object from token info
              const user: User = {
                id: userInfo.id,
                email: userInfo.email,
                firstName: "",
                lastName: "",
                role: userInfo.role as any,
                isVerified: false,
                createdAt: new Date().toISOString(),
              };

              const newToken = getOrCreateToken();
              try {
                const { getProfile } =
                  await import("@/app/actions/get-profile");
                const profileResult = await getProfile();

                if (profileResult?.success && profileResult.profile) {
                  const user = toAuthUser(profileResult.profile);
                  setAuthPersistence(newToken, user);
                  setAuthState({
                    user,
                    token: newToken,
                    isAuthenticated: true,
                    isLoading: false,
                  });
                  return;
                }
              } catch (profileError: any) {
                console.debug(
                  "Profile fetch during auth init failed, using token payload user:",
                  profileError?.message,
                );
              }

              setAuthPersistence(newToken, user);
              setAuthState({
                user,
                token: newToken,
                isAuthenticated: true,
                isLoading: false,
              });
              return;
            }
          }
        }
      } catch (error: any) {
        console.debug("Token verification failed:", error?.message);
      }

      // No valid auth found
      clearAuthPersistence();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    };

    initializeAuth();
  }, []);

  /* ------------------------------------------------------
     AUTOMATIC TOKEN REFRESH
     - Proactively refreshes access token every 12 minutes (before 15min expiry)
     - Prevents token expiration during critical operations like checkout
     - Only runs when user is authenticated
  ------------------------------------------------------ */
  useEffect(() => {
    if (!authState.isAuthenticated || authState.isLoading) {
      return;
    }

    // Refresh token every 12 minutes (720000ms)
    // This is before the 15-minute expiry to ensure seamless auth
    const REFRESH_INTERVAL = 12 * 60 * 1000; // 12 minutes

    const refreshTokenPeriodically = async () => {
      try {
        const { clientRefreshToken } = await import("@/lib/token-utils");
        await clientRefreshToken();
        console.debug("Token automatically refreshed");
      } catch (error) {
        console.error("Failed to auto-refresh token:", error);
        // If refresh fails, user will be logged out on next API call
      }
    };

    // Set up interval for periodic refresh
    const intervalId = setInterval(refreshTokenPeriodically, REFRESH_INTERVAL);

    // Also refresh immediately after 12 minutes from component mount
    const timeoutId = setTimeout(refreshTokenPeriodically, REFRESH_INTERVAL);

    // Cleanup on unmount or auth state change
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [authState.isAuthenticated, authState.isLoading]);

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
        const user = toAuthUser(result.profile);

        setAuthPersistence(token, user);

        setAuthState({
          user,
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
        const user = toAuthUser(result.profile);

        setAuthPersistence(token, user);

        setAuthState({
          user,
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
      file?: File,
    ): Promise<{ success: boolean; profile?: User }> => {
      try {
        const { updateProfile: updateProfileAction } =
          await import("@/app/actions/update-profile");

        // Create FormData for the server action
        const formData = new FormData();
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        if (data.phone) {
          formData.append("phone", data.phone);
        }
        if (data.gender) {
          formData.append("gender", data.gender);
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
          const user = toAuthUser(result.profile);

          setAuthPersistence(token, user);
          setAuthState((prev) => ({
            ...prev,
            user,
            token,
            isAuthenticated: true,
          }));

          return { success: true, profile: user };
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
    [],
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
    [],
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
