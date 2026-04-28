import { getProfile } from "@/app/actions/get-profile";
import type { Profile } from "@/app/profile/types/profile";
import { EmptyValue } from "@/components/profile/EmptyValue";
import { ErrorState } from "@/components/profile/ErrorState";
import { InfoRow } from "@/components/profile/InfoRow";
import { LogoutButton } from "@/components/profile/LogoutButton";
import { ProfileEditButton } from "@/components/profile/ProfileEditButton";
import { ProfileHeaderCard } from "@/components/profile/ProfileHeaderCard";
import { ProfileImageAction } from "@/components/profile/ProfileImageAction";
import { RecentOrdersCard } from "@/components/profile/RecentOrdersCard";
import { SectionCard } from "@/components/profile/SectionCard";
import { SecurityStatusCard } from "@/components/profile/SecurityStatusCard";
import { StatsGrid } from "@/components/profile/StatsGrid";
import { TransactionSummaryCard } from "@/components/profile/TransactionSummaryCard";
import { HeartPulse, Mail, Shield, Users } from "lucide-react";
import { DashboardSectionHeader } from "./DashboardSectionHeader";

function getDisplayName(profile: Profile): string {
  if (profile.displayName && profile.displayName.trim()) {
    return profile.displayName.trim();
  }

  const composed = `${profile.firstName} ${profile.lastName}`.trim();
  return composed || "Patient";
}

function getInitials(profile: Profile): string {
  const source = getDisplayName(profile)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  return source || "P";
}

function roleLabel(profile: Profile): string {
  if (profile.roleName && profile.roleName.trim()) {
    return profile.roleName;
  }

  const map: Record<string, string> = {
    customer: "Patient",
    admin: "Administrator",
    lab_partner: "Lab Partner",
    superadmin: "Super Admin",
  };

  return map[profile.role] || "Patient";
}

function formatDate(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function formatGender(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function joinList(items?: string[]): string | undefined {
  if (!items || items.length === 0) {
    return undefined;
  }

  return items.join(", ");
}

export async function CustomerProfileContent() {
  let profile: Profile | null = null;
  let sessionExpired = false;
  let hasLoadError = false;

  try {
    const result = await getProfile();
    profile = result.profile;
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    sessionExpired =
      message.includes("session expired") ||
      message.includes("not authenticated");
    hasLoadError = true;
  }

  if (!profile || hasLoadError) {
    return (
      <ErrorState
        title={sessionExpired ? "Session expired" : "Unable to load profile"}
        description={
          sessionExpired
            ? "Your secure session has ended. Please sign in again to continue."
            : "We could not load your profile right now. Please try again in a moment."
        }
        sessionExpired={sessionExpired}
      />
    );
  }

  return (
    <div className='space-y-6'>
      <DashboardSectionHeader
        eyebrow='Patient profile'
        title='Personal and account details'
        description='Keep contact, medical, and security-related details current so orders and results move smoothly.'
        icon={Users}
      />

      <ProfileHeaderCard
        fullName={getDisplayName(profile)}
        initials={getInitials(profile)}
        avatarUrl={profile.avatarUrl}
        roleLabel={roleLabel(profile)}
        verificationStatus={profile.accountInfo.verificationStatus}
        avatarEditAction={
          <ProfileImageAction hasAvatar={Boolean(profile.avatarUrl)} />
        }
        editAction={<ProfileEditButton profile={profile} />}
        logoutAction={<LogoutButton />}
      />

      <StatsGrid
        bloodType={profile.medicalInfo.bloodType}
        testsDone={profile.healthSummary.testsDone}
        accountStatus={profile.accountInfo.verificationStatus}
        age={profile.healthSummary.age}
      />

      <SectionCard
        title='Contact Information'
        icon={<Mail className='h-4 w-4 text-blue-600' />}
      >
        <div className='grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2'>
          <InfoRow label='Email' value={profile.contactInfo.email || profile.email} />
          <InfoRow label='Phone' value={profile.contactInfo.phone} />
          <InfoRow
            label='Date of Birth'
            value={formatDate(profile.contactInfo.dateOfBirth)}
          />
          <InfoRow label='Gender' value={formatGender(profile.contactInfo.gender)} />
          <InfoRow
            label='Address'
            value={profile.contactInfo.address}
            className='md:col-span-2'
          />
        </div>
      </SectionCard>

      <SectionCard
        title='Medical Information'
        icon={<HeartPulse className='h-4 w-4 text-blue-600' />}
      >
        <div className='grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2'>
          <InfoRow
            label='Blood Type'
            value={profile.medicalInfo.bloodType}
            emptyContent={<EmptyValue text='Not set' />}
          />
          <InfoRow
            label='Allergies'
            value={joinList(profile.medicalInfo.allergies)}
            className='md:col-span-2'
          />
          <InfoRow
            label='Medical Conditions'
            value={joinList(profile.medicalInfo.medicalConditions)}
            className='md:col-span-2'
          />
          <InfoRow
            label='Current Medications'
            value={joinList(profile.medicalInfo.currentMedications)}
            className='md:col-span-2'
          />
        </div>
      </SectionCard>

      <SectionCard
        title='Emergency Contact'
        icon={<Users className='h-4 w-4 text-blue-600' />}
      >
        <div className='grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2'>
          <InfoRow label='Contact Name' value={profile.emergencyContact.name} />
          <InfoRow label='Contact Phone' value={profile.emergencyContact.phone} />
        </div>
      </SectionCard>

      <SectionCard
        title='Account Information'
        icon={<Shield className='h-4 w-4 text-blue-600' />}
      >
        <div className='grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2'>
          <InfoRow
            label='Account Status'
            value={
              profile.accountInfo.verificationStatus === "verified"
                ? "Verified"
                : profile.accountInfo.verificationStatus === "pending"
                  ? "Pending"
                  : "Unverified"
            }
          />
          <InfoRow
            label='Member Since'
            value={formatDate(profile.accountInfo.memberSince)}
          />
        </div>
      </SectionCard>

      <div className='border-t border-blue-100 pt-6'>
        <h2 className='mb-4 text-xl font-semibold text-slate-900'>
          Quick Access
        </h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <RecentOrdersCard />
          <TransactionSummaryCard />
          <SecurityStatusCard />
        </div>
      </div>
    </div>
  );
}
