"use client";

import { ProfileView } from "@/components/profile/ProfileView";
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

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <SiteHeader />
      <main className="flex-1">
        <PageContainer>
          <div className="py-6 sm:py-8 md:py-12 px-2 sm:px-4 md:px-8">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8 md:mb-12">
              <div className="relative">
                {/* Background decoration */}
                <div className="absolute -top-20 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                    👤 <span>Your Profile</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
                    My <span className="text-gradient-primary">Profile</span>
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    View and manage your profile information.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content with Sidebar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <AccountSidebar />
              </div>

              {/* Main Content */}
              <div className="md:col-span-3">
                <ProfileView />
              </div>
            </div>
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}

