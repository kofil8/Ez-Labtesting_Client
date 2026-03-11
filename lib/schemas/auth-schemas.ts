import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email or phone number is required")
    .refine(
      (value) => {
        const input = value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex =
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return emailRegex.test(input) || phoneRegex.test(input);
      },
      { message: "Enter a valid email address or phone number" },
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupBaseSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone must not exceed 15 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*()]/,
      "Password must contain at least one special character (!@#$%^&*())",
    ),
  confirmPassword: z.string(),
  // Optional medical fields
  gender: z
    .enum(["MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY", "OTHER"])
    .optional(),
  dateOfBirth: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  bloodType: z.string().optional().or(z.literal("")),
  allergies: z.string().max(500).optional().or(z.literal("")),
  medicalConditions: z.string().max(500).optional().or(z.literal("")),
  medications: z.string().max(500).optional().or(z.literal("")),
  emergencyContactName: z.string().optional().or(z.literal("")),
  emergencyContactPhone: z.string().optional().or(z.literal("")),
});

export const signupSchema = signupBaseSchema
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signupAccountSchema = signupBaseSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    password: true,
    confirmPassword: true,
    gender: true,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signupMedicalSchema = signupBaseSchema.pick({
  dateOfBirth: true,
  bloodType: true,
  address: true,
  allergies: true,
  medicalConditions: true,
  medications: true,
  emergencyContactName: true,
  emergencyContactPhone: true,
});

export const mfaSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    otp: z
      .string()
      .length(6, "OTP must be 6 digits")
      .regex(/^\d+$/, "OTP must contain only numbers"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be 10 digits")
    .optional()
    .or(z.literal("")),
  gender: z
    .enum(["MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY", "OTHER"])
    .optional(),
  dateOfBirth: z.string().optional().or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type SignupAccountFormData = z.infer<typeof signupAccountSchema>;
export type SignupMedicalFormData = z.infer<typeof signupMedicalSchema>;
export type MFAFormData = z.infer<typeof mfaSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
