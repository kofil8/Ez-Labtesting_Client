import { SignupForm } from "@/components/auth/SignupForm";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";

export const metadata = {
  title: "Sign Up | EZ Lab Testing",
  description: "Create your account",
};

export default function SignupPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main className='flex-1'>
        <PageContainer>
          <div className='max-w-md mx-auto py-12'>
            <h1 className='text-3xl font-bold text-center mb-8'>
              Create Account
            </h1>
            <SignupForm />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
