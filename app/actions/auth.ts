import { cookies } from "next/headers";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");

    if (!accessToken) {
      return null;
    }

    // Make a request to your backend to verify the token and get user info
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:7001/api/v1";

    const response = await fetch(`${apiBaseUrl}/profile/me`, {
      headers: {
        Cookie: `accessToken=${accessToken.value}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data?.user || null;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error getting current user:", message);
    return null;
  }
}
