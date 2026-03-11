"use client";

import { updateProfile } from "@/app/actions/update-profile";
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
import { useToast } from "@/hook/use-toast";
import { Camera, Loader2, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

interface ProfileImageActionProps {
  hasAvatar: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function ProfileImageAction({ hasAvatar }: ProfileImageActionProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const triggerRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    await updateProfile(formData);
  };

  const removeImage = async () => {
    const formData = new FormData();
    formData.append("removeProfileImage", "true");
    await updateProfile(formData);
  };

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please choose an image file.",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    try {
      await uploadImage(file);
      toast({
        title: "Profile image updated",
        description: "Your profile image has been uploaded securely.",
      });
      triggerRefresh();
    } catch (error) {
      toast({
        title: "Unable to upload image",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      event.target.value = "";
    }
  };

  const handleRemoveImage = async () => {
    try {
      await removeImage();
      toast({
        title: "Profile image removed",
        description: "Your profile image has been removed.",
      });
      setIsConfirmOpen(false);
      setIsOpen(false);
      triggerRefresh();
    } catch (error) {
      toast({
        title: "Unable to remove image",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleFileSelected}
      />

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type='button'
            size='icon'
            variant='outline'
            aria-label='Edit profile image'
            disabled={isPending}
            className='h-8 w-8 rounded-full border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50'
          >
            {isPending ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Camera className='h-4 w-4' />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuItem
            onClick={() => fileInputRef.current?.click()}
            className='gap-2'
          >
            <Upload className='h-4 w-4' />
            Upload new image
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(false);
              setIsConfirmOpen(true);
            }}
            disabled={!hasAvatar}
            className='gap-2 text-red-600 focus:text-red-600'
          >
            <Trash2 className='h-4 w-4' />
            Remove image
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove profile image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove your current profile image from your
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveImage}
              disabled={isPending}
              aria-label='Confirm remove profile image'
              className='bg-red-600 hover:bg-red-700 focus:ring-red-500'
            >
              {isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}