"use client";

import { SignupForm } from "@/components/auth/SignupForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useAuth } from "@/lib/auth-context";
import { Activity, Award, Sparkles, TrendingUp, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

export function SignupPageContent() {
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

  // Don't render signup form if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left Side - Branded Content */}
      <div className='hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-600'>
        {/* Animated Background Blobs */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-1/2 -left-1/2 w-full h-full bg-cyan-500/20 rounded-full blur-3xl animate-blob' />
          <div className='absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-2000' />
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-teal-500/20 rounded-full blur-3xl animate-blob animation-delay-4000' />
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
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white'>
              <Sparkles className='h-4 w-4' />
              <span className='text-sm font-medium'>Join 50,000+ users</span>
            </div>

            <h1 className='text-4xl lg:text-5xl font-bold text-white leading-tight'>
              Take Control of Your Health Journey
            </h1>
            <p className='text-xl text-teal-50'>
              Get instant access to comprehensive lab testing, personalized
              health insights, and expert medical guidance.
            </p>

            {/* Features List */}
            <div className='space-y-4 pt-8'>
              <div className='flex items-start gap-4 group'>
                <div className='bg-white/10 backdrop-blur-sm rounded-lg p-2 group-hover:bg-white/20 transition-all duration-200'>
                  <Activity className='h-5 w-5 text-white' />
                </div>
                <div>
                  <div className='text-white font-semibold mb-1'>
                    Comprehensive Testing
                  </div>
                  <div className='text-teal-50 text-sm'>
                    Access over 500+ lab tests from certified medical facilities
                  </div>
                </div>
              </div>

              <div className='flex items-start gap-4 group'>
                <div className='bg-white/10 backdrop-blur-sm rounded-lg p-2 group-hover:bg-white/20 transition-all duration-200'>
                  <TrendingUp className='h-5 w-5 text-white' />
                </div>
                <div>
                  <div className='text-white font-semibold mb-1'>
                    Health Tracking Dashboard
                  </div>
                  <div className='text-teal-50 text-sm'>
                    Monitor your health trends with beautiful visualizations
                  </div>
                </div>
              </div>

              <div className='flex items-start gap-4 group'>
                <div className='bg-white/10 backdrop-blur-sm rounded-lg p-2 group-hover:bg-white/20 transition-all duration-200'>
                  <Award className='h-5 w-5 text-white' />
                </div>
                <div>
                  <div className='text-white font-semibold mb-1'>
                    Expert Consultation
                  </div>
                  <div className='text-teal-50 text-sm'>
                    Get professional guidance on your test results
                  </div>
                </div>
              </div>

              <div className='flex items-start gap-4 group'>
                <div className='bg-white/10 backdrop-blur-sm rounded-lg p-2 group-hover:bg-white/20 transition-all duration-200'>
                  <Users className='h-5 w-5 text-white' />
                </div>
                <div>
                  <div className='text-white font-semibold mb-1'>
                    Family Management
                  </div>
                  <div className='text-teal-50 text-sm'>
                    Manage health records for your entire family
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className='relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6'>
          <div className='flex items-start gap-4'>
            <div className='w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg'>
              S
            </div>
            <div className='flex-1'>
              <p className='text-white mb-2 italic'>
                "Ez LabTesting made it incredibly easy to get my annual health
                checkup done. The results were detailed and easy to understand."
              </p>
              <div className='text-teal-50 text-sm font-medium'>
                Sarah Johnson
              </div>
              <div className='text-teal-100 text-xs'>
                Healthcare Professional
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className='flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-gray-50 to-teal-50/30'>
        <div className='w-full max-w-md'>
          {/* Mobile Logo */}
          <div className='lg:hidden flex items-center justify-center gap-2 mb-8'>
            <div className='bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl p-2'>
              <Activity className='h-6 w-6 text-white' />
            </div>
            <span className='text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent'>
              Ez LabTesting
            </span>
          </div>

          {/* Form Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-2'>
              Create your account
            </h1>
            <p className='text-gray-600'>
              Start your health journey with us today
            </p>
          </div>

          {/* Signup Form */}
          <Suspense
            fallback={
              <div className='flex items-center justify-center py-12'>
                <LoadingSpinner />
              </div>
            }
          >
            <SignupForm />
          </Suspense>

          {/* Mobile Features */}
          <div className='lg:hidden mt-12 pt-8 border-t border-gray-200'>
            <div className='text-center text-sm text-gray-600 mb-4'>
              Join thousands of users who trust us with their health
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg p-4 text-center'>
                <div className='text-2xl font-bold text-gray-900'>500+</div>
                <div className='text-xs text-gray-600'>Lab Tests</div>
              </div>
              <div className='bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-4 text-center'>
                <div className='text-2xl font-bold text-gray-900'>24-48h</div>
                <div className='text-xs text-gray-600'>Fast Results</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
