"use server";

import { cookies } from "next/headers";

/**
 * Server action to safely get the access token from httpOnly cookie
 * Used for client-side token verification without making API calls
 */
export async function getAccessTokenFromServer() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return { token: null };
    }

    return { token: accessToken };
  } catch (error) {
    console.debug("Failed to get access token:", error);
    return { token: null };
  }
}
