import { getProfile } from "@/app/actions/get-profile";
import { ErrorState } from "@/components/profile/ErrorState";
import { CustomerProfileManager } from "./CustomerProfileManager";
import { DashboardSectionHeader } from "./DashboardSectionHeader";
import { Users } from "lucide-react";

export async function CustomerProfileContent() {
  const profileResult = await getProfile().catch((error) => {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    const sessionExpired =
      message.includes("session expired") ||
      message.includes("not authenticated");

    return {
      error: true,
      sessionExpired,
    } as const;
  });

  if ("error" in profileResult) {
    return (
      <ErrorState
        title={profileResult.sessionExpired ? "Session expired" : "Unable to load profile"}
        description={
          profileResult.sessionExpired
            ? "Your secure session has ended. Please sign in again to continue."
            : "We could not load your profile right now. Please try again in a moment."
        }
        sessionExpired={profileResult.sessionExpired}
      />
    );
  }

  return (
    <div className='space-y-6'>
      <DashboardSectionHeader
        eyebrow='Patient profile'
        title='Personal and account details'
        description='Manage contact details, profile image, and account access from one place.'
        icon={Users}
      />
      <CustomerProfileManager profile={profileResult.profile} />
    </div>
  );
}
