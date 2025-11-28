"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getProfileImageUrl } from "@/lib/utils";
import { Camera, X, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/update-profile";
import { toast } from "sonner";

interface ProfileImageEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  user?: any;
}

export function ProfileImageEditDialog({
  open,
  onOpenChange,
  onSuccess,
  user,
}: ProfileImageEditDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState("");

  // Reset when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setImageError(false);
      setError("");
      // Cleanup preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [open]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type. Please select an image file.");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large. Please select an image smaller than 5MB.");
        return;
      }

      setSelectedFile(file);
      setImageError(false);
      setError("");

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageError(false);
    // Reset file input
    const fileInput = document.getElementById(
      "profile-image-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select an image to upload.");
      return;
    }

    setError("");
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await updateProfile(formData);
        if (res?.success) {
          // Clear selected file after successful upload
          setSelectedFile(null);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }

          toast.success("Profile picture updated successfully!");
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
        if (errorMessage.toLowerCase().includes("session has expired") ||
            errorMessage.toLowerCase().includes("not authenticated")) {
          setTimeout(() => {
            onOpenChange(false);
            // Optionally redirect to login - but let user see the error first
            // window.location.href = "/login?from=/profile";
          }, 2000);
        }
      }
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md p-0 gap-0'>
        <div className='bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6 pb-8'>
          <DialogHeader className='text-white'>
            <DialogTitle className='text-2xl font-bold text-white'>
              Change Profile Picture
            </DialogTitle>
            <DialogDescription className='text-white/90'>
              Upload a new profile picture or remove the current one.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='p-6'>
          {error && (
            <div className='mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20'>
              <p className='text-sm text-destructive text-center'>{error}</p>
            </div>
          )}

          <div className='flex flex-col items-center space-y-6'>
            {/* Profile Picture Preview */}
            <div className='relative'>
              <div className='w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl ring-4 ring-primary/20'>
                {(() => {
                  // Prioritize preview URL if available, otherwise use profile picture
                  const imageUrl =
                    previewUrl || getProfileImageUrl(user.profileImage);
                  const showImage = imageUrl && !imageError;
                  return showImage ? (
                    <img
                      src={imageUrl}
                      alt='Profile'
                      className='w-full h-full object-cover'
                      onError={() => {
                        // Silently handle image load errors - fallback to initials
                        setImageError(true);
                      }}
                      loading='lazy'
                      decoding='async'
                    />
                  ) : (
                    <span className='text-5xl font-bold text-white'>
                      {user.firstName?.[0]?.toUpperCase() || "U"}
                      {user.lastName?.[0]?.toUpperCase() || ""}
                    </span>
                  );
                })()}
              </div>
              {previewUrl && (
                <button
                  type='button'
                  onClick={handleRemovePicture}
                  className='absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90 transition-colors shadow-lg z-10'
                >
                  <X className='w-4 h-4' />
                </button>
              )}
            </div>

            {/* Upload Button */}
            <div className='flex flex-col items-center space-y-2 w-full'>
              <Label htmlFor='profile-image-upload' className='cursor-pointer w-full'>
                <div className='flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg w-full'>
                  <Camera className='w-5 h-5' />
                  <span className='text-sm font-medium'>
                    {previewUrl ? "Change Picture" : "Choose Picture"}
                  </span>
                </div>
              </Label>
              <input
                id='profile-image-upload'
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='hidden'
              />
              <p className='text-xs text-muted-foreground text-center'>
                JPG, PNG or GIF. Max size 5MB
              </p>
            </div>
          </div>

          <DialogFooter className='pt-6 border-t gap-2'>
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
              type='button'
              onClick={handleUpload}
              disabled={isPending || !selectedFile}
              className='min-w-[100px] bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            >
              {isPending ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

