"use client";

import { deleteProfile } from "@/app/actions/delete-profile";
import { updateProfile } from "@/app/actions/update-profile";
import type { Profile } from "@/app/profile/types/profile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hook/use-toast";
import { logoutSession } from "@/lib/auth/client";
import { cn, getProfileImageUrl } from "@/lib/utils";
import {
  AlertTriangle,
  CalendarDays,
  Camera,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";

type ProfileFormState = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio: string;
  gender: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
};

function formatDate(value?: string) {
  if (!value) return "Not provided";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Not provided";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function toDateInput(value?: string) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

function formatLabel(value?: string) {
  if (!value) return "Not provided";
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInitials(profile: Profile) {
  const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase();
  return initials || "P";
}

function getDisplayName(profile: Profile) {
  return `${profile.firstName} ${profile.lastName}`.trim() || "Patient";
}

function getFormState(profile: Profile): ProfileFormState {
  return {
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    phoneNumber: profile.contactInfo.phone || "",
    bio: profile.bio || "",
    gender: profile.contactInfo.gender || "",
    dateOfBirth: toDateInput(profile.contactInfo.dateOfBirth),
    addressLine1: profile.contactInfo.addressLine1 || "",
    addressLine2: profile.contactInfo.addressLine2 || "",
    city: profile.contactInfo.city || "",
    state: profile.contactInfo.state || "",
    zipCode: profile.contactInfo.zipCode || "",
  };
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className='rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm'>
      <div className='mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500'>
        {icon}
        {label}
      </div>
      <p className='truncate text-base font-semibold text-slate-950'>{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className='border-b border-slate-100 py-3 last:border-b-0'>
      <dt className='text-xs font-semibold uppercase text-slate-500'>{label}</dt>
      <dd className='mt-1 text-sm font-medium text-slate-900'>
        {value || <span className='text-slate-400'>Not provided</span>}
      </dd>
    </div>
  );
}

export function CustomerProfileManager({ profile }: { profile: Profile }) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImagePending, setIsImagePending] = useState(false);
  const [removeProfileImage, setRemoveProfileImage] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<ProfileFormState>(() => getFormState(profile));

  const avatarUrl = useMemo(() => {
    if (profileImageFile) return URL.createObjectURL(profileImageFile);
    if (removeProfileImage) return "";
    return getProfileImageUrl(profile.avatarUrl) || "";
  }, [profile.avatarUrl, profileImageFile, removeProfileImage]);

  const profileReadiness = useMemo(() => {
    const checks = [
      profile.firstName,
      profile.lastName,
      profile.email,
      profile.contactInfo.phone,
      profile.contactInfo.dateOfBirth,
      profile.contactInfo.gender,
      profile.contactInfo.addressLine1 || profile.contactInfo.address,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile]);

  function updateField(field: keyof ProfileFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(async () => {
      try {
        await updateProfile(formData);
        toast({
          title: "Profile updated",
          description: "Your profile details have been saved.",
        });
        setProfileImageFile(null);
        setRemoveProfileImage(false);
        router.refresh();
      } catch (error) {
        toast({
          title: "Profile update failed",
          description:
            error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  async function saveProfileImage(file: File | null, removeImage = false) {
    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }

    if (removeImage) {
      formData.append("removeProfileImage", "true");
    }

    setIsImagePending(true);
    try {
      await updateProfile(formData);
      toast({
        title: removeImage ? "Profile image removed" : "Profile image updated",
        description: removeImage
          ? "Your profile image has been removed."
          : "Your new profile image has been saved.",
      });
      setProfileImageFile(null);
      setRemoveProfileImage(false);
      router.refresh();
    } catch (error) {
      setProfileImageFile(null);
      setRemoveProfileImage(false);
      toast({
        title: "Image update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImagePending(false);
    }
  }

  async function handleDeleteProfile() {
    setIsDeleting(true);
    try {
      await deleteProfile();
      await logoutSession({ shouldRedirect: false });
      window.location.assign("/");
    } catch (error) {
      setIsDeleting(false);
      toast({
        title: "Profile deletion failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className='space-y-6'>
      <section className='overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm'>
        <div className='bg-[linear-gradient(135deg,#e0f2fe_0%,#f8fafc_48%,#ecfdf5_100%)] px-5 py-6 sm:px-7'>
          <div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
            <div className='flex items-end gap-4'>
              <div className='relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border-4 border-white bg-sky-600 shadow-sm'>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${getDisplayName(profile)} profile`}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='grid h-full w-full place-items-center text-2xl font-bold text-white'>
                    {getInitials(profile)}
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type='button'
                      className='absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full border border-white/70 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
                      aria-label='Edit profile image'
                      disabled={isImagePending}
                    >
                      <Camera className='h-4 w-4' />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start' className='w-44'>
                    <DropdownMenuItem
                      onSelect={(event) => {
                        event.preventDefault();
                        fileInputRef.current?.click();
                      }}
                    >
                      <Upload className='mr-2 h-4 w-4' />
                      Upload image
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='text-red-600 focus:text-red-600'
                      disabled={!profile.avatarUrl && !profileImageFile}
                      onSelect={(event) => {
                        event.preventDefault();
                        setProfileImageFile(null);
                        setRemoveProfileImage(true);
                        void saveProfileImage(null, true);
                      }}
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      Remove image
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  event.target.value = "";
                  if (!file) return;
                  setProfileImageFile(file);
                  setRemoveProfileImage(false);
                  void saveProfileImage(file);
                }}
              />
              <div className='min-w-0 pb-1'>
                <div className='mb-2 flex flex-wrap items-center gap-2'>
                  <span className='rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700'>
                    {formatLabel(profile.role)}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      profile.isVerified
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700",
                    )}
                  >
                    {profile.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
                <h1 className='truncate text-2xl font-bold text-slate-950 sm:text-3xl'>
                  {getDisplayName(profile)}
                </h1>
                <p className='mt-1 text-sm text-slate-600'>
                  {profile.email}
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 border-t border-slate-200 p-5 sm:grid-cols-2 xl:grid-cols-4'>
          <StatTile
            icon={<ShieldCheck className='h-4 w-4 text-blue-600' />}
            label='Account'
            value={formatLabel(profile.status || profile.accountInfo.verificationStatus)}
          />
          <StatTile
            icon={<CalendarDays className='h-4 w-4 text-blue-600' />}
            label='Member Since'
            value={formatDate(profile.accountInfo.memberSince)}
          />
          <StatTile
            icon={<CheckCircle2 className='h-4 w-4 text-blue-600' />}
            label='Readiness'
            value={`${profileReadiness}% complete`}
          />
          <StatTile
            icon={<UserRound className='h-4 w-4 text-blue-600' />}
            label='Age'
            value={profile.healthSummary.age ? String(profile.healthSummary.age) : "Not set"}
          />
        </div>
      </section>

      <Tabs defaultValue='overview' className='space-y-5'>
        <TabsList className='grid h-auto w-full grid-cols-3 rounded-lg bg-slate-100 p-1 lg:w-fit'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='profile'>Edit Profile</TabsTrigger>
          <TabsTrigger value='danger'>Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='mt-0'>
          <div className='grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]'>
            <section className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='grid h-10 w-10 place-items-center rounded-lg bg-blue-50'>
                  <Mail className='h-5 w-5 text-blue-600' />
                </div>
                <div>
                  <h2 className='text-base font-semibold text-slate-950'>
                    Contact Details
                  </h2>
                  <p className='text-sm text-slate-500'>
                    Details used for order and result communication.
                  </p>
                </div>
              </div>
              <dl className='grid grid-cols-1 gap-x-8 md:grid-cols-2'>
                <DetailRow label='Email' value={profile.email} />
                <DetailRow label='Phone' value={profile.contactInfo.phone} />
                <DetailRow label='Date of Birth' value={formatDate(profile.contactInfo.dateOfBirth)} />
                <DetailRow label='Gender' value={formatLabel(profile.contactInfo.gender)} />
                <DetailRow label='Address' value={profile.contactInfo.address} />
                <DetailRow label='Username' value={profile.username} />
              </dl>
            </section>

            <section className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='grid h-10 w-10 place-items-center rounded-lg bg-emerald-50'>
                  <ShieldCheck className='h-5 w-5 text-emerald-600' />
                </div>
                <div>
                  <h2 className='text-base font-semibold text-slate-950'>
                    Account Security
                  </h2>
                  <p className='text-sm text-slate-500'>
                    Protected account and identity status.
                  </p>
                </div>
              </div>
              <dl>
                <DetailRow label='Role' value={formatLabel(profile.role)} />
                <DetailRow label='Status' value={formatLabel(profile.status)} />
                <DetailRow
                  label='Verification'
                  value={profile.isVerified ? "Verified" : "Not verified"}
                />
                <DetailRow label='Last Updated' value={formatDate(profile.updatedAt)} />
              </dl>
            </section>
          </div>
        </TabsContent>

        <TabsContent value='profile' className='mt-0'>
          <form
            id='profile-details-form'
            onSubmit={handleProfileSubmit}
            className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'
          >
            <div className='mb-5 border-b border-slate-100 pb-5'>
              <div>
                <h2 className='text-lg font-semibold text-slate-950'>
                  Profile Details
                </h2>
                <p className='text-sm text-slate-500'>
                  Update the fields supported by your secure profile API.
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  value={form.firstName}
                  onChange={(event) => updateField("firstName", event.target.value)}
                  className='mt-1'
                />
              </div>
              <div>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  value={form.lastName}
                  onChange={(event) => updateField("lastName", event.target.value)}
                  className='mt-1'
                />
              </div>
              <div>
                <Label htmlFor='phoneNumber'>Phone</Label>
                <Input
                  id='phoneNumber'
                  value={form.phoneNumber}
                  onChange={(event) => updateField("phoneNumber", event.target.value)}
                  className='mt-1'
                />
              </div>
              <div>
                <Label htmlFor='dateOfBirth'>Date of Birth</Label>
                <Input
                  id='dateOfBirth'
                  type='date'
                  value={form.dateOfBirth}
                  onChange={(event) => updateField("dateOfBirth", event.target.value)}
                  className='mt-1'
                />
              </div>
              <div>
                <Label htmlFor='gender'>Gender</Label>
                <Select
                  value={form.gender || "unset"}
                  onValueChange={(value) => updateField("gender", value === "unset" ? "" : value)}
                >
                  <SelectTrigger id='gender' className='mt-1'>
                    <SelectValue placeholder='Select gender' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='unset'>Not provided</SelectItem>
                    <SelectItem value='MALE'>Male</SelectItem>
                    <SelectItem value='FEMALE'>Female</SelectItem>
                    <SelectItem value='NON_BINARY'>Non-binary</SelectItem>
                    <SelectItem value='OTHER'>Other</SelectItem>
                    <SelectItem value='PREFER_NOT_TO_SAY'>Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='state'>State</Label>
                <Input
                  id='state'
                  value={form.state}
                  onChange={(event) => updateField("state", event.target.value)}
                  className='mt-1'
                />
              </div>
              <div className='md:col-span-2'>
                <Label htmlFor='bio'>Bio</Label>
                <Textarea
                  id='bio'
                  value={form.bio}
                  onChange={(event) => updateField("bio", event.target.value)}
                  className='mt-1 min-h-[96px]'
                  placeholder='Add helpful profile notes.'
                />
              </div>
              <div className='md:col-span-2'>
                <Label htmlFor='addressLine1'>Address Line 1</Label>
                <Input
                  id='addressLine1'
                  value={form.addressLine1}
                  onChange={(event) => updateField("addressLine1", event.target.value)}
                  className='mt-1'
                />
              </div>
              <div className='md:col-span-2'>
                <Label htmlFor='addressLine2'>Address Line 2</Label>
                <Input
                  id='addressLine2'
                  value={form.addressLine2}
                  onChange={(event) => updateField("addressLine2", event.target.value)}
                  className='mt-1'
                />
              </div>
              <div>
                <Label htmlFor='city'>City</Label>
                <Input
                  id='city'
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  className='mt-1'
                />
              </div>
              <div>
                <Label htmlFor='zipCode'>ZIP Code</Label>
                <Input
                  id='zipCode'
                  value={form.zipCode}
                  onChange={(event) => updateField("zipCode", event.target.value)}
                  className='mt-1'
                />
              </div>
            </div>

            <div className='mt-5 flex justify-end'>
              <Button type='submit' disabled={isPending}>
                {isPending ? "Saving profile..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value='danger' className='mt-0'>
          <section className='max-w-2xl rounded-lg border border-red-200 bg-white p-5 shadow-sm'>
            <div className='flex items-start gap-3'>
              <div className='grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-red-50'>
                <AlertTriangle className='h-5 w-5 text-red-600' />
              </div>
              <div className='min-w-0'>
                <h2 className='text-lg font-semibold text-slate-950'>
                  Delete Profile
                </h2>
                <p className='mt-1 text-sm text-slate-600'>
                  This permanently deletes your account profile from the backend.
                  You will be signed out after deletion.
                </p>
                <Button
                  type='button'
                  variant='outline'
                  className='mt-4 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700'
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete My Profile
                </Button>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete profile permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your profile record will be deleted
              and your current session will end.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProfile}
              disabled={isDeleting}
              className='bg-red-600 hover:bg-red-700'
            >
              {isDeleting ? "Deleting..." : "Delete Profile"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
