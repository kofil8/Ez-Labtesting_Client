"use server";

export async function registerUser(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phoneNumber = formData.get("phoneNumber") as string | null;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("First name, last name, email, and password are required");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1"}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        phoneNumber: phoneNumber || undefined,
      }),
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registration failed");
  }

  const data = await res.json();

  return { success: true, email: data?.data?.email || email };
}

