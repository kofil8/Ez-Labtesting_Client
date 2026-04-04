"use server";

import { signupSchema } from "@/lib/schemas/auth-schemas";

export async function registerUser(formData: FormData) {
  const requestData = {
    firstName: String(formData.get("firstName") ?? "").trim(),
    lastName: String(formData.get("lastName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    phone: String(formData.get("phoneNumber") ?? "").replace(/\D/g, ""),
    confirmPassword: String(formData.get("confirmPassword") ?? formData.get("password") ?? ""),
    gender: String(formData.get("gender") ?? "").trim() || undefined,
    profileImage: String(formData.get("profileImage") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    dateOfBirth: String(formData.get("dateOfBirth") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    addressLine1: String(formData.get("addressLine1") ?? "").trim(),
    addressLine2: String(formData.get("addressLine2") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    state: String(formData.get("state") ?? "").trim().toUpperCase(),
    zipCode: String(formData.get("zipCode") ?? "").trim(),
    bloodType: String(formData.get("bloodType") ?? "").trim(),
    allergies: String(formData.get("allergies") ?? "").trim(),
    medicalConditions: String(formData.get("medicalConditions") ?? "").trim(),
    medications: String(formData.get("medications") ?? "").trim(),
    emergencyContactName: String(formData.get("emergencyContactName") ?? "").trim(),
    emergencyContactPhone: String(formData.get("emergencyContactPhone") ?? "").trim(),
  };

  const validated = signupSchema.parse(requestData);

  const requestBody: any = {
    firstName: validated.firstName,
    lastName: validated.lastName,
    email: validated.email,
    password: validated.password,
    phoneNumber: validated.phone,
  };

  if (validated.gender) requestBody.gender = validated.gender;
  if (validated.profileImage) requestBody.profileImage = validated.profileImage;
  if (validated.bio) requestBody.bio = validated.bio;
  if (validated.dateOfBirth) requestBody.dateOfBirth = validated.dateOfBirth;
  if (validated.address) requestBody.address = validated.address;
  if (validated.addressLine1) requestBody.addressLine1 = validated.addressLine1;
  if (validated.addressLine2) requestBody.addressLine2 = validated.addressLine2;
  if (validated.city) requestBody.city = validated.city;
  if (validated.state) requestBody.state = validated.state;
  if (validated.zipCode) requestBody.zipCode = validated.zipCode;
  if (validated.bloodType) requestBody.bloodType = validated.bloodType;
  if (validated.allergies) requestBody.allergies = validated.allergies;
  if (validated.medicalConditions)
    requestBody.medicalConditions = validated.medicalConditions;
  if (validated.medications) requestBody.medications = validated.medications;
  if (validated.emergencyContactName)
    requestBody.emergencyContactName = validated.emergencyContactName;
  if (validated.emergencyContactPhone)
    requestBody.emergencyContactPhone = validated.emergencyContactPhone;

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

  return { success: true, email: data?.data?.email || validated.email };
}
