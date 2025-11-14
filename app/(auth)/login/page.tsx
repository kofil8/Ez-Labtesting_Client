import { SiteHeader } from '@/components/shared/SiteHeader'
import { SiteFooter } from '@/components/shared/SiteFooter'
import { PageContainer } from '@/components/shared/PageContainer'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Login | Kevin Lab Testing',
  description: 'Sign in to your account',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageContainer>
          <div className="max-w-md mx-auto py-12">
            <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
            <LoginForm />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  )
}

