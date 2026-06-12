import { describe, expect, it } from "vitest";
import {
  buildRegisterRequest,
  buildResetPasswordRequest,
  extractApiMessage,
  extractRoleFromToken,
  getDashboardRouteForRole,
  getSafeRedirectTarget,
} from "./shared";

function encodeBase64Url(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createToken(payload: Record<string, unknown>) {
  return `header.${encodeBase64Url(JSON.stringify(payload))}.signature`;
}

describe("auth shared helpers", () => {
  it("maps roles to dashboard routes with normalization and fallback", () => {
    expect(getDashboardRouteForRole("ADMIN")).toBe("/dashboard/admin");
    expect(getDashboardRouteForRole("lab-partner")).toBe(
      "/dashboard/lab-partner",
    );
    expect(getDashboardRouteForRole("labpartner")).toBe(
      "/dashboard/lab-partner",
    );
    expect(getDashboardRouteForRole("SUPER_ADMIN")).toBe(
      "/dashboard/superadmin",
    );
    expect(getDashboardRouteForRole("superadmin")).toBe(
      "/dashboard/superadmin",
    );
    expect(getDashboardRouteForRole("unknown")).toBe("/dashboard/customer");
    expect(getDashboardRouteForRole(null)).toBe("/dashboard/customer");
  });

  it("accepts only local redirect targets", () => {
    expect(getSafeRedirectTarget("/dashboard/admin/categories")).toBe(
      "/dashboard/admin/categories",
    );
    expect(getSafeRedirectTarget("https://evil.example")).toBeNull();
    expect(getSafeRedirectTarget("//evil.example")).toBeNull();
    expect(getSafeRedirectTarget(null)).toBeNull();
  });

  it("extracts normalized roles from JWT payloads", () => {
    const token = createToken({ user: { role: "LAB_PARTNER" } });
    expect(extractRoleFromToken(token)).toBe("lab_partner");
  });

  it("extracts the best backend error message from envelopes", () => {
    expect(
      extractApiMessage(
        { errorMessages: [{ message: "OTP expired or invalid" }] },
        "Fallback",
      ),
    ).toBe("OTP expired or invalid");

    expect(
      extractApiMessage({ error: "Email already in use" }, "Fallback"),
    ).toBe("Email already in use");

    expect(extractApiMessage(undefined, "Fallback")).toBe("Fallback");
  });

  it("builds register requests with backend field names and normalized values", () => {
    expect(
      buildRegisterRequest({
        firstName: "  Jane ",
        lastName: " Doe ",
        email: " jane@example.com ",
        password: "StrongPass1!",
        phone: "+1 (555) 123-4567",
        gender: "FEMALE",
        dateOfBirth: "1990-01-01",
        addressLine1: " 123 Main St ",
        addressLine2: "",
        city: " New York ",
        state: " ny ",
        zipCode: "10001",
      }),
    ).toEqual({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "StrongPass1!",
      phoneNumber: "15551234567",
      gender: "FEMALE",
      dateOfBirth: "1990-01-01",
      addressLine1: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    });
  });

  it("builds reset password requests with reset token", () => {
    expect(
      buildResetPasswordRequest({
        resetToken: "  token-123  ",
        password: "NewPassword1!",
      }),
    ).toEqual({
      resetToken: "token-123",
      newPassword: "NewPassword1!",
    });
  });
});
