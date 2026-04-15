"use client";

import {
  AUTH_SESSION_EXPIRED_EVENT,
  logoutSession,
} from "@/lib/auth/client";
import { normalizeUserRole } from "@/lib/auth/shared";
import { clientFetch, getApiUrl } from "@/lib/api-client";
import { AuthState, User } from "@/types/user";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
}

interface AuthContextType extends AuthState {
  refreshAuth: () => Promise<User | null>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (
    data: UpdateProfileData,
    file?: File,
  ) => Promise<{ success: boolean; profile?: User }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeRole(role: string | null | undefined): User["role"] {
  return (normalizeUserRole(role) || "customer") as User["role"];
}

function toAuthUser(profile: any): User {
  return {
    ...profile,
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    role: normalizeRole(profile?.role),
  };
}

function buildLoggedOutState(): AuthState {
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  };
}

async function parseProfileResponse(
  response: Response,
  fallbackMessage: string,
): Promise<User> {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || fallbackMessage);
  }

  return toAuthUser(payload?.data || payload?.profile || payload);
}

async function requestProfile(redirectOnAuthFailure = false): Promise<User> {
  const response = await clientFetch(getApiUrl("/profile"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    redirectOnAuthFailure,
  });

  return parseProfileResponse(
    response,
    "Unable to load your profile information.",
  );
}

async function requestProfileUpdate(
  data: UpdateProfileData,
  file?: File,
): Promise<User> {
  const formData = new FormData();

  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);

  if (data.phone) {
    formData.append("phoneNumber", data.phone);
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

  const response = await clientFetch(getApiUrl("/profile"), {
    method: "PATCH",
    body: formData,
  });

  return parseProfileResponse(
    response,
    "Unable to update your profile. Please try again.",
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const applyLoggedInState = useCallback((user: User) => {
    setAuthState({
      user,
      token: null,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const clearAuthState = useCallback(() => {
    setAuthState(buildLoggedOutState());
  }, []);

  const refreshAuth = useCallback(async (): Promise<User | null> => {
    try {
      const user = await requestProfile(false);
      applyLoggedInState(user);
      return user;
    } catch (error) {
      clearAuthState();
      return null;
    }
  }, [applyLoggedInState, clearAuthState]);

  useEffect(() => {
    let isActive = true;

    const bootstrapAuth = async () => {
      try {
        const user = await requestProfile(false);

        if (isActive) {
          applyLoggedInState(user);
        }
      } catch (error) {
        if (isActive) {
          clearAuthState();
        }
      }
    };

    void bootstrapAuth();

    return () => {
      isActive = false;
    };
  }, [applyLoggedInState, clearAuthState]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleSessionExpired = () => {
      clearAuthState();
    };

    window.addEventListener(
      AUTH_SESSION_EXPIRED_EVENT,
      handleSessionExpired as EventListener,
    );

    return () => {
      window.removeEventListener(
        AUTH_SESSION_EXPIRED_EVENT,
        handleSessionExpired as EventListener,
      );
    };
  }, [clearAuthState]);

  const fetchProfile = useCallback(async (): Promise<void> => {
    const user = await requestProfile();
    applyLoggedInState(user);
  }, [applyLoggedInState]);

  const updateProfile = useCallback(
    async (
      data: UpdateProfileData,
      file?: File,
    ): Promise<{ success: boolean; profile?: User }> => {
      const user = await requestProfileUpdate(data, file);
      applyLoggedInState(user);
      return { success: true, profile: user };
    },
    [applyLoggedInState],
  );

  const logout = useCallback(async (): Promise<void> => {
    clearAuthState();
    await logoutSession({ shouldRedirect: false });
  }, [clearAuthState]);

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

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
