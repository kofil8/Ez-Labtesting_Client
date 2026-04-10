import { authenticatedFetch } from "@/lib/api-helpers";

export async function getCurrentUser() {
  try {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:7001/api/v1";

    const response = await authenticatedFetch(`${apiBaseUrl}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error getting current user:", message);
    return null;
  }
}
