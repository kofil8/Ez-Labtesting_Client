"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hook/use-toast";
import { useAuth } from "@/lib/auth-context";
import {
  ProfileUpdateFormData,
  profileUpdateSchema,
} from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export function ProfileForm() {
  const { toast } = useToast();
  const {
    user,
    updateProfile,
    fetchProfile,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [profileImage, setprofileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const hasFetchedRef = useRef(false); // Track if we've already fetched

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
  });

  // Fetch profile on mount - only once when authenticated
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // Only fetch if authenticated
    if (!isAuthenticated) {
      hasFetchedRef.current = false;
      return;
    }

    // Prevent multiple fetches
    if (hasFetchedRef.current) {
      return;
    }

    hasFetchedRef.current = true;
    let mounted = true;

    const loadProfile = async () => {
      setFetching(true);
      try {
        await fetchProfile();
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Reset ref on error so we can retry later
        if (mounted) {
          hasFetchedRef.current = false;
        }
      } finally {
        if (mounted) {
          setFetching(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]); // Depend on authLoading to wait for auth init

  // Update form when user data is available
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth || "",
      });
      // Note: profileImage URL would come from user object if backend returns it
      // For now, we'll handle it separately
    }
  }, [user, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    // Reset file input
    const fileInput = document.getElementById(
      "profileImage"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data: ProfileUpdateFormData) => {
    setLoading(true);
    try {
      const result = await updateProfile(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || undefined,
          dateOfBirth: data.dateOfBirth || undefined,
        },
        selectedFile || undefined
      );

      if (result) {
        // Clear selected file after successful upload
        setSelectedFile(null);
        setPreviewUrl(null);

        // Refresh profile to get updated profile picture URL
        await fetchProfile();

        toast({
          title: "Success",
          description: "Your profile has been updated.",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while auth is loading or fetching profile without user data
  if (authLoading || (fetching && !user)) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <p className='text-muted-foreground text-center py-4'>
            Loading profile...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!user || !isAuthenticated) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <p className='text-muted-foreground'>
            Please log in to view your profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your profile information and personal details.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-3 sm:space-y-4 p-4 sm:p-6'>
          {/* Profile Picture Upload */}
          <div className='flex flex-col items-center space-y-4 pb-4 border-b'>
            <div className='relative'>
              <div className='w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg'>
                {previewUrl || profileImage ? (
                  <img
                    src={previewUrl || profileImage || ""}
                    alt='Profile'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <span className='text-3xl sm:text-4xl font-bold text-white'>
                    {user.firstName?.[0]?.toUpperCase() || "U"}
                    {user.lastName?.[0]?.toUpperCase() || ""}
                  </span>
                )}
              </div>
              {previewUrl && (
                <button
                  type='button'
                  onClick={handleRemovePicture}
                  className='absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90 transition-colors shadow-lg'
                >
                  <X className='w-4 h-4' />
                </button>
              )}
            </div>
            <div className='flex flex-col items-center space-y-2'>
              <Label htmlFor='profileImage' className='cursor-pointer'>
                <div className='flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'>
                  <Camera className='w-4 h-4' />
                  <span className='text-sm font-medium'>
                    {previewUrl ? "Change Picture" : "Upload Picture"}
                  </span>
                </div>
              </Label>
              <input
                id='profileImage'
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='hidden'
              />
              <p className='text-xs text-muted-foreground text-center max-w-xs'>
                JPG, PNG or GIF. Max size 5MB
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            <div>
              <Label htmlFor='firstName'>First name</Label>
              <Input
                id='firstName'
                placeholder='John'
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor='lastName'>Last name</Label>
              <Input
                id='lastName'
                placeholder='Doe'
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='your@email.com'
              disabled
              {...register("email")}
            />
            <p className='text-xs text-muted-foreground mt-2'>
              Email cannot be changed. Contact support if you need to update it.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            <div>
              <Label htmlFor='phone' className='text-sm sm:text-base'>
                Phone number
              </Label>
              <Input
                id='phone'
                type='tel'
                placeholder='1234567890'
                {...register("phone")}
                className='text-sm sm:text-base'
              />
              {errors.phone && (
                <p className='text-xs sm:text-sm text-destructive mt-1'>
                  {errors.phone.message}
                </p>
              )}
              <p className='text-xs text-muted-foreground mt-1 sm:mt-2'>
                Format: 10 digits
              </p>
            </div>

            <div>
              <Label htmlFor='dateOfBirth' className='text-sm sm:text-base'>
                Date of birth
              </Label>
              <Input
                id='dateOfBirth'
                type='date'
                {...register("dateOfBirth")}
                className='text-sm sm:text-base'
              />
              {errors.dateOfBirth && (
                <p className='text-xs sm:text-sm text-destructive mt-1'>
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className='p-4 sm:p-6'>
          <Button
            type='submit'
            disabled={loading}
            className='w-full text-sm sm:text-base'
          >
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
