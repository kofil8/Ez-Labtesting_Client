export const LOGIN_COPY = {
  badge: "Secure patient access",
  title: "Welcome back",
  description:
    "Sign in to manage orders, review results, and continue your secure lab testing journey.",
  emailLabel: "Email address or mobile number",
  emailPlaceholder: "you@example.com or 555-000-1234",
  passwordLabel: "Password",
  passwordPlaceholder: "Enter your password",
  forgotPassword: "Forgot password?",
  submit: "Sign in",
  submitPending: "Signing in...",
  verifiedTitle: "Email verified",
  verifiedDescription: "Your account is active. You can sign in now.",
  helpPrompt: "New to EzLabTesting?",
  createAccount: "Create an account",
  helpCenter: "Help Center",
  legalNote: "HIPAA-aware protection for patient and provider accounts.",
} as const;

export const LOGIN_LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/hipaa-notice", label: "HIPAA Notice" },
] as const;
