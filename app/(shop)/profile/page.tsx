"use client";

import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AccountSidebar } from "@/components/profile/AccountSidebar";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

// Check if auth bypass is enabled for testing
const BYPASS_AUTH = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Skip auth check if bypass is enabled
    if (!BYPASS_AUTH && !isLoading && !isAuthenticated) {
      router.push("/login?from=/profile");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading && !BYPASS_AUTH) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Allow rendering without auth when bypass is enabled
  if (!BYPASS_AUTH && (!isAuthenticated || !user)) {
    return null;
  }

  // Mock user for testing when bypass is enabled
  const displayUser = user || (BYPASS_AUTH ? {
    id: "test-user",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    role: "customer" as const,
    createdAt: new Date().toISOString(),
    mfaEnabled: false,
  } : null);

  return (
    <>
      <SiteHeader />
      <PageContainer>
        <div className="py-6 sm:py-8 md:py-12 px-2 sm:px-4 md:px-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">My Account</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your profile, security settings, and preferences.
            </p>
          </div>

          {/* Main Content with Sidebar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <AccountSidebar />
            </div>

            {/* Main Content */}
            <div className="md:col-span-3 space-y-6 sm:space-y-8">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mr-2 sm:mr-3"></div>
                  Profile Information
                </h2>
                <ProfileForm />
              </div>

              {/* Account Security Section */}
              <div className="pt-4 sm:pt-6 border-t">
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mr-2 sm:mr-3"></div>
                  Security & Password
                </h2>
                <ChangePasswordForm />
              </div>

              {/* Account Information Section */}
              <div className="pt-4 sm:pt-6 border-t">
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mr-2 sm:mr-3"></div>
                  Account Information
                </h2>
                <div className="bg-muted rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                      <p className="font-medium break-all">{displayUser?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Account Type</p>
                      <p className="font-medium capitalize">{displayUser?.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                      <p className="font-medium">
                        {displayUser?.createdAt ? new Date(displayUser.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Two-Factor Auth</p>
                      <p className="font-medium">
                        {displayUser?.mfaEnabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                  {BYPASS_AUTH && (
                    <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        ⚠️ Test Mode: Authentication bypassed for testing
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
      <SiteFooter />
    </>
  );
}

