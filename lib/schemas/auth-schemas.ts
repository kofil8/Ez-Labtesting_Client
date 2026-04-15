import { z } from "zod";

const genderSchema = z
  .enum(["MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY", "OTHER"])
  .optional();

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email or phone number is required")
    .refine(
      (value) => {
        const input = value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex =
          /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
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
    .refine(
      (value) => value === "" || (value.length >= 10 && value.length <= 15),
      "Phone number must be 10 to 15 digits",
    ),
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
  gender: genderSchema,
  profileImage: z
    .string()
    .url("Profile image must be a valid URL")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  addressLine1: z
    .string()
    .max(255, "Address line 1 must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  addressLine2: z
    .string()
    .max(255, "Address line 2 must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .max(100, "City must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  state: z
    .string()
    .max(2, "State must be 2 characters or less")
    .optional()
    .or(z.literal("")),
  zipCode: z
    .string()
    .max(10, "Zip code must be 10 characters or less")
    .optional()
    .or(z.literal("")),
});

export const signupAccountSchema = signupBaseSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
    confirmPassword: true,
    dateOfBirth: true,
    gender: true,
    addressLine1: true,
    addressLine2: true,
    city: true,
    state: true,
    zipCode: true,
  })
  .extend({
    phone: z
      .string()
      .min(10, "Phone number is required")
      .max(15, "Phone number must be 10 to 15 digits")
      .regex(/^\d+$/, "Phone number must contain only digits"),
    gender: z.enum(
      ["MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY", "OTHER"],
      {
        message: "Please select a valid gender",
      },
    ),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
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
  gender: genderSchema,
  dateOfBirth: z.string().optional().or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  profileImage: z.string().optional().or(z.literal("")),
  addressLine1: z.string().max(255).optional().or(z.literal("")),
  addressLine2: z.string().max(255).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  state: z.string().max(2).optional().or(z.literal("")),
  zipCode: z.string().max(10).optional().or(z.literal("")),
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
export type SignupAccountFormData = z.infer<typeof signupAccountSchema>;
export type MFAFormData = z.infer<typeof mfaSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
