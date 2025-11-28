"use client";

import { getProfile } from "@/app/actions/get-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProfileImageUrl } from "@/lib/utils";
import {
  Calendar,
  CheckCircle2,
  Edit,
  Mail,
  Phone,
  Shield,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ProfileEditDialog } from "./ProfileEditDialog";
import { ProfileImageEditDialog } from "./ProfileImageEditDialog";

export function ProfileView() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isImageEditOpen, setIsImageEditOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const hasFetchedRef = useRef(false);

  // Fetch profile on mount
  useEffect(() => {
    if (hasFetchedRef.current) return;

    hasFetchedRef.current = true;
    const loadProfile = async () => {
      setFetching(true);
      try {
        const res = await getProfile();
        if (res?.success && res.profile) {
          setUser(res.profile);
        }
      } catch (error: any) {
        console.error("Failed to fetch profile:", error);
        hasFetchedRef.current = false;
        // Redirect to login if not authenticated or session expired
        const errorMessage = error?.message || "";
        if (
          errorMessage.includes("Session expired") ||
          errorMessage.includes("Not authenticated") ||
          errorMessage.includes("log in")
        ) {
          router.push("/login?from=/profile&expired=true");
        } else {
          router.push("/login?from=/profile");
        }
      } finally {
        setFetching(false);
      }
    };

    loadProfile();
  }, [router]);

  // Reset image error when profile picture changes
  // This must be before any early returns to follow Rules of Hooks
  useEffect(() => {
    setImageError(false);
  }, [user?.profileImage]);

  if (fetching && !user) {
    return (
      <Card className='border-2 shadow-lg'>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent'></div>
              <p className='mt-4 text-muted-foreground'>Loading profile...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className='border-2 shadow-lg'>
        <CardContent className='pt-6'>
          <p className='text-muted-foreground text-center py-4'>
            Please log in to view your profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleEditSuccess = async () => {
    setImageError(false); // Reset image error when profile is updated
    // Refetch profile
    try {
      const res = await getProfile();
      if (res?.success && res.profile) {
        setUser(res.profile);
      }
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    }
    setIsEditOpen(false);
  };

  const handleImageEditSuccess = async () => {
    setImageError(false); // Reset image error when profile image is updated
    // Refetch profile
    try {
      const res = await getProfile();
      if (res?.success && res.profile) {
        setUser(res.profile);
      }
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    }
    setIsImageEditOpen(false);
  };

  return (
    <>
      <Card className='border-2 shadow-lg overflow-hidden'>
        <CardContent className='p-0'>
          {/* Profile Header with Image */}
          <div className='relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 pb-16'>
            <div className='flex flex-col items-center text-center text-white'>
              {/* Profile Picture */}
              <div className='relative mb-4 group'>
                <div className='w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl'>
                  {(() => {
                    const imageUrl = getProfileImageUrl(user.profileImage);
                    const showImage = imageUrl && !imageError;

                    // Debug logging (only in development)
                    if (process.env.NODE_ENV === "development" && imageUrl) {
                      console.log("[ProfileView] Image rendering:", {
                        profileImage: user.profileImage,
                        imageUrl,
                        showImage,
                        imageError,
                      });
                    }

                    return showImage ? (
                      <img
                        src={imageUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        className='w-full h-full object-cover'
                        onError={() => {
                          // Silently handle image load errors - fallback to initials
                          // Only log in development for debugging
                          if (process.env.NODE_ENV === "development") {
                            console.warn(
                              "[ProfileView] Image failed to load, showing initials:",
                              imageUrl
                            );
                          }
                          setImageError(true);
                        }}
                        onLoad={() => {
                          if (process.env.NODE_ENV === "development") {
                            console.log(
                              "[ProfileView] Image loaded successfully:",
                              imageUrl
                            );
                          }
                        }}
                        loading='lazy'
                        decoding='async'
                        suppressHydrationWarning
                      />
                    ) : (
                      <span className='text-5xl font-bold'>
                        {user.firstName?.[0]?.toUpperCase() || "U"}
                        {user.lastName?.[0]?.toUpperCase() || ""}
                      </span>
                    );
                  })()}
                </div>
                {/* Edit Icon Overlay */}
                <button
                  onClick={() => setIsImageEditOpen(true)}
                  className='absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all hover:scale-110 border-2 border-white/50 backdrop-blur-sm'
                  aria-label='Edit profile picture'
                >
                  <Edit className='w-4 h-4' />
                </button>
              </div>

              {/* Name and Role */}
              <h2 className='text-3xl font-bold mb-2'>
                {user.firstName} {user.lastName}
              </h2>
              <div className='flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm'>
                <UserIcon className='w-4 h-4' />
                <span className='text-sm font-medium capitalize'>
                  {user.role}
                </span>
                {user.isVerified && (
                  <CheckCircle2 className='w-4 h-4 text-green-300' />
                )}
              </div>
            </div>

            {/* Edit Button */}
            <div className='absolute top-4 right-4'>
              <Button
                onClick={() => setIsEditOpen(true)}
                variant='secondary'
                className='bg-white/90 hover:bg-white text-primary shadow-lg backdrop-blur-sm'
              >
                <Edit className='w-4 h-4 mr-2' />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Profile Details */}
          <div className='p-6 sm:p-8 space-y-6'>
            {/* Personal Information */}
            <div>
              <h3 className='text-lg font-semibold mb-4 flex items-center'>
                <div className='w-1.5 h-1.5 bg-primary rounded-full mr-2'></div>
                Personal Information
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors'>
                  <Mail className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-muted-foreground mb-1'>
                      Email Address
                    </p>
                    <p className='font-medium break-all'>{user.email}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors'>
                  <Phone className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-muted-foreground mb-1'>
                      Phone Number
                    </p>
                    <p className='font-medium'>
                      {user.phone || user.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors'>
                  <Calendar className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-muted-foreground mb-1'>
                      Date of Birth
                    </p>
                    <p className='font-medium'>
                      {user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "Not provided"}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors'>
                  <Calendar className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-muted-foreground mb-1'>
                      Member Since
                    </p>
                    <p className='font-medium'>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className='pt-4 border-t'>
              <h3 className='text-lg font-semibold mb-4 flex items-center'>
                <div className='w-1.5 h-1.5 bg-primary rounded-full mr-2'></div>
                Account Information
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors'>
                  <Shield className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-muted-foreground mb-1'>
                      Account Status
                    </p>
                    <div className='flex items-center gap-2'>
                      {user.isVerified ? (
                        <>
                          <CheckCircle2 className='w-4 h-4 text-green-500' />
                          <p className='font-medium text-green-600 dark:text-green-400'>
                            Verified
                          </p>
                        </>
                      ) : (
                        <>
                          <XCircle className='w-4 h-4 text-yellow-500' />
                          <p className='font-medium text-yellow-600 dark:text-yellow-400'>
                            Unverified
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors'>
                  <UserIcon className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-muted-foreground mb-1'>
                      Account Type
                    </p>
                    <p className='font-medium capitalize'>{user.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {user.bio && (
              <div className='pt-4 border-t'>
                <h3 className='text-lg font-semibold mb-4 flex items-center'>
                  <div className='w-1.5 h-1.5 bg-primary rounded-full mr-2'></div>
                  About
                </h3>
                <div className='p-4 rounded-lg bg-muted/50'>
                  <p className='text-foreground'>{user.bio}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ProfileEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={handleEditSuccess}
        user={user}
      />
      <ProfileImageEditDialog
        open={isImageEditOpen}
        onOpenChange={setIsImageEditOpen}
        onSuccess={handleImageEditSuccess}
        user={user}
      />
    </>
  );
}
