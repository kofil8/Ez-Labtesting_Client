"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useAuth } from "@/lib/auth-context";
import { Activity, Check, Clock, Shield } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

export function LoginPageContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Redirect to homepage if already logged in
    if (!isLoading && isAuthenticated) {
      const fromParam = searchParams.get("from");
      const safeFrom =
        fromParam && fromParam.startsWith("/") && !fromParam.startsWith("//")
          ? fromParam
          : null;
      router.push(safeFrom || "/");
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingSpinner />
      </div>
    );
  }

  // Don't render login form if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left Side - Branded Content */}
      <div className='hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-600 to-teal-600'>
        {/* Animated Background Blobs */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/20 rounded-full blur-3xl animate-blob' />
          <div className='absolute -bottom-1/2 -right-1/2 w-full h-full bg-teal-500/20 rounded-full blur-3xl animate-blob animation-delay-2000' />
        </div>

        {/* Logo and Content */}
        <div className='relative z-10'>
          <div className='flex items-center gap-2 mb-12'>
            <div className='bg-white rounded-xl p-2'>
              <Activity className='h-8 w-8 text-cyan-600' />
            </div>
            <span className='text-2xl font-bold text-white'>Ez LabTesting</span>
          </div>

          <div className='space-y-8 max-w-md'>
            <h1 className='text-4xl lg:text-5xl font-bold text-white leading-tight'>
              Professional Lab Testing Made Simple
            </h1>
            <p className='text-xl text-cyan-50'>
              Access comprehensive health testing from certified labs with
              results delivered securely to your dashboard.
            </p>

            {/* Trust Indicators */}
            <div className='grid grid-cols-2 gap-6 pt-8'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-white/90'>
                  <Check className='h-5 w-5' />
                  <span className='font-semibold'>ISO Certified</span>
                </div>
                <p className='text-cyan-50 text-sm'>
                  All partner labs meet international quality standards
                </p>
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-white/90'>
                  <Shield className='h-5 w-5' />
                  <span className='font-semibold'>Secure & Private</span>
                </div>
                <p className='text-cyan-50 text-sm'>
                  Your health data is encrypted and fully protected
                </p>
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-white/90'>
                  <Clock className='h-5 w-5' />
                  <span className='font-semibold'>Fast Results</span>
                </div>
                <p className='text-cyan-50 text-sm'>
                  Get your test results within 24-48 hours
                </p>
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-white/90'>
                  <Activity className='h-5 w-5' />
                  <span className='font-semibold'>Expert Support</span>
                </div>
                <p className='text-cyan-50 text-sm'>
                  Professional guidance for your health journey
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className='relative z-10 flex items-center gap-8 text-white/80'>
          <div>
            <div className='text-3xl font-bold text-white'>50K+</div>
            <div className='text-sm'>Tests Completed</div>
          </div>
          <div className='h-12 w-px bg-white/20' />
          <div>
            <div className='text-3xl font-bold text-white'>4.9/5</div>
            <div className='text-sm'>User Rating</div>
          </div>
          <div className='h-12 w-px bg-white/20' />
          <div>
            <div className='text-3xl font-bold text-white'>100+</div>
            <div className='text-sm'>Partner Labs</div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className='flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-gray-50 to-cyan-50/30'>
        <div className='w-full max-w-md'>
          {/* Mobile Logo */}
          <div className='lg:hidden flex items-center justify-center gap-2 mb-8'>
            <div className='bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl p-2'>
              <Activity className='h-6 w-6 text-white' />
            </div>
            <span className='text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent'>
              Ez LabTesting
            </span>
          </div>

          {/* Form Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-2'>
              Welcome back
            </h1>
            <p className='text-gray-600'>
              Sign in to access your health dashboard
            </p>
          </div>

          {/* Login Form */}
          <Suspense
            fallback={
              <div className='flex items-center justify-center py-12'>
                <LoadingSpinner />
              </div>
            }
          >
            <LoginForm />
          </Suspense>

          {/* Mobile Trust Indicators */}
          <div className='lg:hidden mt-12 pt-8 border-t border-gray-200'>
            <div className='grid grid-cols-2 gap-4 text-center'>
              <div>
                <div className='text-2xl font-bold text-gray-900'>50K+</div>
                <div className='text-sm text-gray-600'>Tests Completed</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-gray-900'>4.9/5</div>
                <div className='text-sm text-gray-600'>User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
