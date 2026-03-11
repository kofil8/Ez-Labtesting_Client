"use client";

import { MedicalSpinner } from "@/components/auth/MedicalSpinner";
import { MultiStepSignupForm } from "@/components/auth/MultiStepSignupForm";
import { useAuth } from "@/lib/auth-context";
import { Activity, Award, Lock, Shield, TrendingUp, Users } from "lucide-react";
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
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50'>
        <MedicalSpinner size='lg' text='Loading...' />
      </div>
    );
  }

  // Don't render signup form if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className='h-screen overflow-hidden grid lg:grid-cols-2 bg-gradient-to-br from-white via-blue-50 to-cyan-50 lg:from-white lg:to-white'>
      {/* Left Side - Professional Healthcare Branding - Desktop Only */}
      <div className='hidden lg:flex flex-col justify-between p-6 xl:p-8 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900'>
        {/* Decorative Blurred Circles */}
        <div className='absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none' />
        <div className='absolute bottom-0 left-0 w-80 h-80 bg-cyan-300/15 rounded-full blur-3xl pointer-events-none' />

        {/* Content Stack */}
        <div className='relative z-10 space-y-6'>
          {/* Logo and Brand */}
          <div
            className='space-y-1.5 animate-in fade-in slide-in-left duration-500'
            style={{ animationDelay: "100ms" }}
          >
            <div className='flex items-center gap-2.5'>
              <div className='bg-white/95 rounded-lg p-2 shadow-lg shadow-blue-900/20'>
                <Activity className='h-6 w-6 text-blue-700' strokeWidth={2.5} />
              </div>
              <div>
                <div className='text-xl font-bold text-white'>
                  Ez LabTesting
                </div>
                <div className='text-xs text-blue-100 font-medium tracking-wide'>
                  Trusted Healthcare Partner
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div
            className='inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/30 rounded-full px-3 py-2 text-white animate-in fade-in slide-in-left duration-500'
            style={{ animationDelay: "150ms" }}
          >
            <Award className='h-3.5 w-3.5 flex-shrink-0' />
            <span className='text-xs font-semibold'>
              Trusted by 50,000+ patients
            </span>
          </div>

          {/* Main Heading */}
          <div
            className='space-y-3 max-w-lg animate-in fade-in slide-in-left duration-500'
            style={{ animationDelay: "200ms" }}
          >
            <h1 className='text-3xl lg:text-4xl font-bold text-white leading-tight'>
              Your Health,
              <br />
              Simplified
            </h1>
            <p className='text-sm lg:text-base text-blue-50 leading-relaxed'>
              Get lab tested by board-certified medical professionals with
              CLIA-certified facilities. Fast, accurate, and secure.
            </p>
          </div>

          {/* Healthcare-Focused Features */}
          <div
            className='space-y-2 max-w-lg animate-in fade-in slide-in-left duration-500'
            style={{ animationDelay: "300ms" }}
          >
            {[
              {
                icon: Award,
                title: "Certified Lab Results",
                desc: "Results from CLIA-certified facilities",
              },
              {
                icon: TrendingUp,
                title: "Secure Health Dashboard",
                desc: "Encrypted, HIPAA-compliant storage",
              },
              {
                icon: Users,
                title: "24/7 Healthcare Support",
                desc: "Access lab specialists anytime",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className='flex gap-3 hover:bg-white/10 p-2 rounded-lg transition-colors duration-200'
              >
                <div className='flex-shrink-0'>
                  <item.icon className='h-5 w-5 text-white mt-0.5' />
                </div>
                <div>
                  <h3 className='font-semibold text-white text-xs'>
                    {item.title}
                  </h3>
                  <p className='text-xs text-blue-100'>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Testimonial */}
        <div
          className='relative z-10 bg-white/15 backdrop-blur-md border border-white/30 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 animate-in fade-in slide-in-left duration-500'
          style={{ animationDelay: "400ms" }}
        >
          <div className='flex items-start gap-3'>
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0'>
              DR
            </div>
            <div className='flex-1'>
              <p className='text-white mb-2 italic leading-relaxed text-xs'>
                &quot;Ez LabTesting has streamlined our patient onboarding
                process. Secure, compliant, and easy to use.&quot;
              </p>
              <div className='text-white text-xs font-semibold'>
                Dr. Michael Chen, MD
              </div>
              <div className='text-blue-100 text-xs'>Internal Medicine</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side / Full Width Mobile - Signup Form */}
      <div className='flex items-center justify-center h-screen overflow-y-auto px-4 sm:px-6 md:px-6 lg:px-6 py-3 md:py-4 lg:py-4 w-full'>
        <div className='w-full max-w-md my-auto'>
          {/* Mobile Header */}
          <div className='lg:hidden flex flex-col items-center justify-center gap-1.5 mb-3 animate-in fade-in duration-500'>
            <div className='bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg p-2 shadow-lg shadow-blue-200/30'>
              <Activity className='h-6 w-6 text-white' />
            </div>
            <div className='text-center'>
              <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
                Ez LabTesting
              </h1>
              <p className='text-xs text-gray-600 font-medium mt-0.5'>
                Create Your Health Account
              </p>
            </div>
          </div>

          {/* Form Header */}
          <div
            className='text-center mb-3 md:mb-4 animate-in fade-in duration-500'
            style={{ animationDelay: "100ms" }}
          >
            <h2 className='text-xl sm:text-2xl md:text-2xl lg:text-2xl font-bold text-gray-900 mb-1'>
              Create Your Account
            </h2>
            <p className='text-xs text-gray-600'>
              Secure, simple, and compliant health testing
            </p>
          </div>

          {/* Signup Form */}
          <div
            className='animate-in fade-in duration-500'
            style={{ animationDelay: "200ms" }}
          >
            <Suspense
              fallback={
                <div className='flex items-center justify-center py-12'>
                  <MedicalSpinner size='md' text='Loading form...' />
                </div>
              }
            >
              <MultiStepSignupForm />
            </Suspense>
          </div>

          {/* Mobile Trust Indicators */}
          <div
            className='lg:hidden mt-4 pt-4 border-t border-gray-200 animate-in fade-in duration-500'
            style={{ animationDelay: "300ms" }}
          >
            <h3 className='text-xs font-semibold text-gray-900 mb-3 text-center'>
              Why trust Ez LabTesting?
            </h3>
            <div className='grid grid-cols-3 gap-2 text-center'>
              {[
                { icon: Shield, label: "HIPAA Compliant" },
                { icon: Lock, label: "Encrypted" },
                { icon: Award, label: "Certified Labs" },
              ].map((item, idx) => (
                <div key={idx} className='space-y-1.5'>
                  <div className='flex justify-center'>
                    <item.icon className='h-4 w-4 text-blue-600' />
                  </div>
                  <div className='text-xs text-gray-600 font-medium'>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg p-3 hover:shadow-md transition-shadow'>
              <div className='flex gap-2'>
                <Shield className='h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5' />
                <p className='text-xs text-gray-700 leading-relaxed'>
                  Your health information is protected by industry-leading
                  encryption and HIPAA regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
