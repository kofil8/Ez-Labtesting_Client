import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { PageContainer } from "@/components/shared/PageContainer";

export const metadata = {
  title: "Forgot Password | Ez LabTesting",
  description: "Reset your Ez LabTesting password",
};

export default function ForgotPasswordPage() {
  return (
    <PageContainer>
      <div className="flex items-center justify-center min-h-screen py-12 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground mt-2">
              Enter your email address and we&apos;ll help you reset your password.
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </PageContainer>
  );
}

