"use client";

import { getProfile } from "@/app/actions/get-profile";
import { updateProfile } from "@/app/actions/update-profile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ProfileUpdateFormData,
  profileUpdateSchema,
} from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  user?: any;
}

export function ProfileEditDialog({
  open,
  onOpenChange,
  onSuccess,
  user: initialUser,
}: ProfileEditDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [user, setUser] = useState<any>(initialUser || null);

  // Fetch user data when dialog opens
  useEffect(() => {
    if (open) {
      const fetchUser = async () => {
        if (initialUser) {
          setUser(initialUser);
          return;
        }
        setLoading(true);
        try {
          const res = await getProfile();
          if (res?.success && res.profile) {
            setUser(res.profile);
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          toast.error("Failed to load profile data");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [open, initialUser]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
  });

  // Reset form when dialog opens or user changes
  useEffect(() => {
    if (open && user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth || "",
      });
      setBio(user.bio || "");
    }
  }, [open, user, reset]);

  const handleAction = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      try {
        const res = await updateProfile(formData);
        if (res?.success) {
          toast.success("Your profile has been updated.");

          onSuccess?.();
          onOpenChange(false);
        }
      } catch (err: any) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);

        // If session expired, close dialog (user will need to login again)
        if (
          errorMessage.toLowerCase().includes("session has expired") ||
          errorMessage.toLowerCase().includes("not authenticated")
        ) {
          setTimeout(() => {
            onOpenChange(false);
            // Optionally redirect to login - but let user see the error first
            // window.location.href = "/login?from=/profile";
          }, 2000);
        }
      }
    });
  };

  const onSubmit = async (data: ProfileUpdateFormData) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    if (data.phone) {
      formData.append("phone", data.phone);
    }
    if (data.dateOfBirth) {
      formData.append("dateOfBirth", data.dateOfBirth);
    }
    if (bio) {
      formData.append("bio", bio);
    }
    handleAction(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0'>
        <div className='bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6 pb-8'>
          <DialogHeader className='text-white'>
            <DialogTitle className='text-2xl font-bold text-white'>
              Edit Profile
            </DialogTitle>
            <DialogDescription className='text-white/90'>
              Update your profile information and personal details.
            </DialogDescription>
          </DialogHeader>
        </div>

        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
          </div>
        ) : !user ? (
          <div className='p-6 text-center text-muted-foreground'>
            Failed to load profile data
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className='p-6'>
            {error && (
              <div className='mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20'>
                <p className='text-sm text-destructive text-center'>{error}</p>
              </div>
            )}

            <div className='space-y-6'>
              {/* Name Fields */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='firstName' className='text-sm font-medium'>
                    First name
                  </Label>
                  <Input
                    id='firstName'
                    placeholder='John'
                    className='h-10'
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='lastName' className='text-sm font-medium'>
                    Last name
                  </Label>
                  <Input
                    id='lastName'
                    placeholder='Doe'
                    className='h-10'
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className='space-y-2'>
                <Label htmlFor='email' className='text-sm font-medium'>
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='your@email.com'
                  disabled
                  className='h-10 bg-muted'
                  {...register("email")}
                />
                <p className='text-xs text-muted-foreground'>
                  Email cannot be changed. Contact support if you need to update
                  it.
                </p>
              </div>

              {/* Phone and Date of Birth */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='phone' className='text-sm font-medium'>
                    Phone number
                  </Label>
                  <Input
                    id='phone'
                    type='tel'
                    placeholder='1234567890'
                    className='h-10'
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.phone.message}
                    </p>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Format: 10 digits
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='dateOfBirth' className='text-sm font-medium'>
                    Date of birth
                  </Label>
                  <Input
                    id='dateOfBirth'
                    type='date'
                    className='h-10'
                    {...register("dateOfBirth")}
                  />
                  {errors.dateOfBirth && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className='space-y-2'>
                <Label htmlFor='bio' className='text-sm font-medium'>
                  Bio
                </Label>
                <Textarea
                  id='bio'
                  placeholder='Tell us about yourself...'
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={500}
                  className='resize-none'
                />
                <div className='flex justify-between items-center'>
                  <p className='text-xs text-muted-foreground'>
                    Optional. Write a short bio about yourself (max 500
                    characters).
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {bio.length}/500
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className='pt-4 border-t gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className='min-w-[100px]'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={isPending}
                className='min-w-[100px] bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              >
                {isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
