import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { PageContainer } from "@/components/shared/PageContainer";

export const metadata = {
  title: "Reset Password | Ez LabTesting",
  description: "Create a new password for your Ez LabTesting account",
};

export default function ResetPasswordPage() {
  return (
    <PageContainer>
      <div className="flex items-center justify-center min-h-screen py-12 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Create New Password</h1>
            <p className="text-muted-foreground mt-2">
              Enter your new password to regain access to your account.
            </p>
          </div>

          <ResetPasswordForm />
        </div>
      </div>
    </PageContainer>
  );
}

