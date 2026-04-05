import { z } from "zod";

export const loginSchema = z.object({
<<<<<<< HEAD
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^\d{10}$/, "Phone must be 10 digits")
      .optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
=======
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
  gender: z
    .enum(["MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY", "OTHER"])
    .optional(),
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
  address: z.string().optional().or(z.literal("")),
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
  bloodType: z.string().optional().or(z.literal("")),
  allergies: z.string().max(500).optional().or(z.literal("")),
  medicalConditions: z.string().max(500).optional().or(z.literal("")),
  medications: z.string().max(500).optional().or(z.literal("")),
  emergencyContactName: z.string().optional().or(z.literal("")),
  emergencyContactPhone: z.string().optional().or(z.literal("")),
});

export const signupSchema = signupBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  },
);

export const signupAccountSchema = signupBaseSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    password: true,
    confirmPassword: true,
    dateOfBirth: true,
    addressLine1: true,
    addressLine2: true,
    city: true,
    state: true,
    zipCode: true,
>>>>>>> 79f18b8adbed41541c366ef4077ec9a710540515
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

<<<<<<< HEAD
export const signupAccountSchema = signupSchema.extend({
  dateOfBirth: z.string().optional().or(z.literal("")),
  addressLine1: z.string().optional().or(z.literal("")),
  addressLine2: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z
    .string()
    .max(2, "State must be 2 characters or less")
    .optional()
    .or(z.literal("")),
  zipCode: z.string().optional().or(z.literal("")),
=======
export const signupMedicalSchema = signupBaseSchema.pick({
  gender: true,
  dateOfBirth: true,
  address: true,
  bloodType: true,
  allergies: true,
  medicalConditions: true,
  medications: true,
  emergencyContactName: true,
  emergencyContactPhone: true,
>>>>>>> 79f18b8adbed41541c366ef4077ec9a710540515
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
<<<<<<< HEAD
=======
  gender: z
    .enum(["MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY", "OTHER"])
    .optional(),
>>>>>>> 79f18b8adbed41541c366ef4077ec9a710540515
  dateOfBirth: z.string().optional().or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
<<<<<<< HEAD
=======
  profileImage: z.string().optional().or(z.literal("")),
  addressLine1: z.string().max(255).optional().or(z.literal("")),
  addressLine2: z.string().max(255).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  state: z.string().max(2).optional().or(z.literal("")),
  zipCode: z.string().max(10).optional().or(z.literal("")),
  bloodType: z.string().optional().or(z.literal("")),
  allergies: z.string().max(500).optional().or(z.literal("")),
  medicalConditions: z.string().max(500).optional().or(z.literal("")),
  medications: z.string().max(500).optional().or(z.literal("")),
  emergencyContactName: z.string().optional().or(z.literal("")),
  emergencyContactPhone: z.string().optional().or(z.literal("")),
>>>>>>> 79f18b8adbed41541c366ef4077ec9a710540515
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
<<<<<<< HEAD
=======
export type SignupMedicalFormData = z.infer<typeof signupMedicalSchema>;
>>>>>>> 79f18b8adbed41541c366ef4077ec9a710540515
export type MFAFormData = z.infer<typeof mfaSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
