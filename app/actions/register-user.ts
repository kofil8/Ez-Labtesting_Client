"use server";

export async function registerUser(formData: FormData) {
  // Extract required fields
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phoneNumber = formData.get("phoneNumber") as string | null;

  // Extract optional fields
  const gender = formData.get("gender") as string | null;
  const dateOfBirth = formData.get("dateOfBirth") as string | null;
  const address = formData.get("address") as string | null;
  const bloodType = formData.get("bloodType") as string | null;
  const allergies = formData.get("allergies") as string | null;
  const medicalConditions = formData.get("medicalConditions") as string | null;
  const medications = formData.get("medications") as string | null;
  const emergencyContactName = formData.get("emergencyContactName") as
    | string
    | null;
  const emergencyContactPhone = formData.get("emergencyContactPhone") as
    | string
    | null;

  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    throw new Error(
      "First name, last name, email, phone number, and password are required",
    );
  }

  // Build request body with all fields
  const requestBody: any = {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
  };

  // Add optional medical fields if provided
  if (gender && gender.trim()) requestBody.gender = gender;
  if (dateOfBirth && dateOfBirth.trim()) requestBody.dateOfBirth = dateOfBirth;
  if (address && address.trim()) requestBody.address = address;
  if (bloodType && bloodType.trim()) requestBody.bloodType = bloodType;
  if (allergies && allergies.trim()) requestBody.allergies = allergies;
  if (medicalConditions && medicalConditions.trim())
    requestBody.medicalConditions = medicalConditions;
  if (medications && medications.trim()) requestBody.medications = medications;
  if (emergencyContactName && emergencyContactName.trim())
    requestBody.emergencyContactName = emergencyContactName;
  if (emergencyContactPhone && emergencyContactPhone.trim())
    requestBody.emergencyContactPhone = emergencyContactPhone;

  let res;
  try {
    res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://ezlabtesting-api.com/api/v1"
      }/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        credentials: "include",
        cache: "no-store",
      },
    );
  } catch (error: any) {
    // Handle connection errors (ECONNREFUSED, network failures, etc.)
    if (
      error.cause?.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      throw new Error(
        "Unable to connect to server. The server may be down. Please try again later.",
      );
    }
    throw new Error(
      "Network error occurred. Please check your connection and try again.",
    );
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registration failed");
  }

  const data = await res.json();

  return { success: true, email: data?.data?.email || email };
}
