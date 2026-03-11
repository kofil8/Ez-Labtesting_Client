import { Profile, UpdateProfilePayload } from "@/app/profile/types/profile";
import { authenticatedFetch } from "@/lib/api-helpers";
import { useCallback, useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ezlabtesting-api.com/api/v1";

async function fetchProfile(): Promise<Profile> {
  const res = await authenticatedFetch(`${API_BASE}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: "Failed to fetch profile" }));
    throw new Error(error.message || "Failed to fetch profile");
  }

  const data = await res.json();
  return data?.data || data;
}

async function updateProfileOnServer(
  payload: UpdateProfilePayload,
): Promise<Profile> {
  const res = await authenticatedFetch(`${API_BASE}/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: "Failed to update profile" }));
    throw new Error(error.message || "Failed to update profile");
  }

  const data = await res.json();
  return data?.data || data;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<Error | null>(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchProfile();
      setProfile(data);
    } catch (err) {
      const normalizedError =
        err instanceof Error ? err : new Error("Failed to fetch profile");
      setError(normalizedError);
      setProfile(undefined);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const updateProfileAsync = useCallback(async (payload: UpdateProfilePayload) => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const updatedProfile = await updateProfileOnServer(payload);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      const normalizedError =
        err instanceof Error ? err : new Error("Failed to update profile");
      setUpdateError(normalizedError);
      throw normalizedError;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const updateProfile = useCallback(
    (payload: UpdateProfilePayload) => {
      void updateProfileAsync(payload);
    },
    [updateProfileAsync],
  );

  return {
    profile,
    isLoading,
    isError: !!error,
    error,
    refetch: loadProfile,
    updateProfile,
    updateProfileAsync,
    isUpdating,
    updateError,
  };
}
