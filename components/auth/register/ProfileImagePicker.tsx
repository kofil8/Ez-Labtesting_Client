"use client";

import { FieldError } from "@/components/shared/FieldError";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Camera, Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

interface ProfileImagePickerProps {
  value?: string;
  firstName?: string;
  lastName?: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onValidationError?: (message?: string) => void;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export function ProfileImagePicker({
  value,
  firstName,
  lastName,
  error,
  disabled,
  onChange,
  onValidationError,
}: ProfileImagePickerProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.trim() || "EZ";

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      onValidationError?.("Upload a JPG, PNG, WEBP, or GIF image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      onValidationError?.("Upload an image smaller than 5MB.");
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setFileName(file.name);
      onValidationError?.(undefined);
      onChange(dataUrl);
    } catch (readError) {
      onValidationError?.(
        readError instanceof Error
          ? readError.message
          : "Unable to process the selected image.",
      );
      event.target.value = "";
    }
  };

  const handleRemove = () => {
    setFileName("");
    onValidationError?.(undefined);
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className='space-y-3'>
      <div className='rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,0.98))] p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.35)]'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <div className='relative h-28 w-28 overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_65%),linear-gradient(180deg,#eff6ff_0%,#f8fafc_100%)] shadow-inner sm:h-32 sm:w-32'>
            {value ? (
              <Image
                src={value}
                alt='Profile image preview'
                fill
                unoptimized
                className='object-cover'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] text-3xl font-semibold tracking-[0.08em] text-white'>
                {initials.toUpperCase()}
              </div>
            )}
          </div>

          <div className='space-y-1'>
            <div className='inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700'>
              <Camera className='h-3.5 w-3.5' />
              Optional profile image
            </div>
            <h3 className='text-base font-semibold text-slate-950'>
              Add a recognizable account photo
            </h3>
            <p className='max-w-xs text-sm leading-6 text-slate-600'>
              Optional now, helpful later for account recognition and support.
            </p>
          </div>

          <div className='flex w-full flex-col gap-2 sm:flex-row'>
            <label
              htmlFor={inputId}
              className={cn(
                "flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-900",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <UploadCloud className='h-4 w-4' />
              <span>{value ? "Replace image" : "Upload image"}</span>
            </label>

            <Button
              type='button'
              variant='outline'
              onClick={handleRemove}
              disabled={disabled || !value}
              className='min-h-11 rounded-xl border-slate-300 text-slate-700'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Remove
            </Button>
          </div>

          <input
            ref={inputRef}
            id={inputId}
            type='file'
            accept='image/jpeg,image/png,image/webp,image/gif'
            className='hidden'
            disabled={disabled}
            onChange={handleFileChange}
          />

          <p className='text-xs leading-5 text-slate-500'>
            JPG, PNG, WEBP, or GIF up to 5MB.
            {fileName ? ` Selected: ${fileName}` : ""}
          </p>
        </div>
      </div>

      <FieldError error={error} id={`${inputId}-error`} />
    </div>
  );
}
