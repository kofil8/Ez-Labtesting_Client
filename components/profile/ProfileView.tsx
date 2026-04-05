"use client";

import { UpdateProfilePayload } from "@/app/profile/types/profile";
import { EditProfileDialog } from "@/components/dialogs/EditProfileDialog";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hook/useProfile";
import { useCallback, useState } from "react";
import { HealthSummaryStats } from "./HealthSummaryStats";
import { InlineError } from "./InlineError";
import { ProfileHeaderCard } from "./ProfileHeaderCard";
import { ProfileSkeleton } from "./ProfileSkeleton";
import { AccountInformationSection } from "./sections/AccountInformationSection";
import { ContactInformationSection } from "./sections/ContactInformationSection";
import { EmergencyContactSection } from "./sections/EmergencyContactSection";
import { MedicalInformationSection } from "./sections/MedicalInformationSection";

/**
 * Profile View Component - Shows user's comprehensive profile information
 */
export function ProfileView() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { profile, isLoading, isError, error, refetch, updateProfileAsync } =
    useProfile();

  const handleEditProfile = useCallback(() => {
    setEditDialogOpen(true);
  }, []);

  const handleSaveProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      await updateProfileAsync(payload);
    },
    [updateProfileAsync],
  );

  // Loading state
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // Error state
  if (isError || !profile) {
    return (
      <InlineError
        message={
          error instanceof Error
            ? error.message
            : "Unable to load your profile. Please try again."
        }
        onRetry={() => refetch()}
      />
    );
  }

  // Get display name
  const displayName =
    profile.displayName || `${profile.firstName} ${profile.lastName}`;
  const initials =
    `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
  const roleLabel = profile.roleName || profile.role;

  return (
    <div className='space-y-8'>
      {/* Header Card */}
      <ProfileHeaderCard
        fullName={displayName}
        roleLabel={roleLabel}
        verificationStatus={profile.accountInfo.verificationStatus}
        initials={initials}
        editAction={
          <Button variant='outline' onClick={handleEditProfile}>
            Edit Profile
          </Button>
        }
      />

      {/* Health Summary Stats */}
      <HealthSummaryStats
        healthSummary={profile.healthSummary}
        bloodType={profile.medicalInfo.bloodType}
      />

      {/* Sections */}
      <div className='space-y-8'>
        <ContactInformationSection contactInfo={profile.contactInfo} />
        <MedicalInformationSection medicalInfo={profile.medicalInfo} />
        <EmergencyContactSection emergencyContact={profile.emergencyContact} />
        <AccountInformationSection accountInfo={profile.accountInfo} />
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        profile={profile}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
