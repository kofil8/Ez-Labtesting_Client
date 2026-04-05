"use client";

import { updateProfile } from "@/app/actions/update-profile";
import { Profile, UpdateProfilePayload } from "@/app/profile/types/profile";
import { EditProfileDialog } from "@/components/dialogs/EditProfileDialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface ProfileEditButtonProps {
  profile: Profile;
}

export function ProfileEditButton({ profile }: ProfileEditButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSave = async (payload: UpdateProfilePayload) => {
    const formData = new FormData();

    formData.append("firstName", profile.firstName);
    formData.append("lastName", profile.lastName);

    if (payload.phone !== undefined) {
      formData.append("phoneNumber", payload.phone);
    }
    if (payload.dateOfBirth !== undefined) {
      formData.append("dateOfBirth", payload.dateOfBirth);
    }
    if (payload.gender !== undefined) {
      formData.append("gender", payload.gender);
    }
    if (payload.address !== undefined) {
      formData.append("address", payload.address);
    }
    if (payload.bloodType !== undefined) {
      formData.append("bloodType", payload.bloodType);
    }
    if (payload.allergies) {
      formData.append("allergies", payload.allergies.join(", "));
    }
    if (payload.medicalConditions) {
      formData.append(
        "medicalConditions",
        payload.medicalConditions.join(", "),
      );
    }
    if (payload.currentMedications) {
      formData.append("medications", payload.currentMedications.join(", "));
    }
    if (payload.emergencyContactName !== undefined) {
      formData.append("emergencyContactName", payload.emergencyContactName);
    }
    if (payload.emergencyContactPhone !== undefined) {
      formData.append("emergencyContactPhone", payload.emergencyContactPhone);
    }

    await updateProfile(formData);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      <Button
        variant='outline'
        aria-label='Edit profile details'
        className='border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
        onClick={() => setOpen(true)}
      >
        Edit Profile
      </Button>

      <EditProfileDialog
        profile={profile}
        open={open}
        onOpenChange={setOpen}
        onSave={handleSave}
        isLoading={isPending}
      />
    </>
  );
}
