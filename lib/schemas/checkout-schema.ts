import { z } from "zod";

export const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const age =
      (new Date().getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 18 && age <= 120;
  }, "Must be between 18 and 120 years old"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().length(2, "State must be 2 characters"),
  zipCode: z.string().regex(/^\d{5}$/, "ZIP code must be 5 digits"),
  paymentMethod: z.enum(["ach", "card"], {
    message: "Please select a payment method",
  }),
  hipaaConsent: z.boolean().refine((val) => val === true, {
    message: "You must accept the HIPAA authorization",
  }),
  termsConsent: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
