"use client";

import type { CustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { getProfileImageUrl } from "@/lib/utils";
import { useState } from "react";

export function CustomerAvatar({
  viewer,
  className = "",
  alt = "Profile image",
}: {
  viewer?: CustomerDashboardViewer | null;
  className?: string;
  alt?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = getProfileImageUrl(viewer?.profileImage);
  const showImage = Boolean(imageUrl && !imageFailed);

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-blue-100 bg-blue-50 text-blue-700 ${className}`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={alt}
          className='h-full w-full object-cover'
          loading='lazy'
          decoding='async'
          onError={() => setImageFailed(true)}
        />
      ) : (
        <svg
          aria-hidden='true'
          viewBox='0 0 80 80'
          className='h-full w-full'
          role='img'
        >
          <rect width='80' height='80' rx='18' fill='#E0F2FE' />
          <circle cx='40' cy='34' r='20' fill='#FED7AA' />
          <path
            d='M19 34c2-13 10-22 22-22 11 0 18 7 20 17-7-6-15-7-24-5-7 2-12 5-18 10Z'
            fill='#0F766E'
          />
          <circle cx='32' cy='36' r='2.8' fill='#0F172A' />
          <circle cx='48' cy='36' r='2.8' fill='#0F172A' />
          <path
            d='M33 48c4 4 10 4 14 0'
            fill='none'
            stroke='#0F172A'
            strokeLinecap='round'
            strokeWidth='3'
          />
          <path
            d='M17 80c2-14 12-24 23-24s21 10 23 24H17Z'
            fill='#2563EB'
          />
          <path
            d='M27 62c7 6 19 6 26 0'
            fill='none'
            stroke='#BFDBFE'
            strokeLinecap='round'
            strokeWidth='3'
          />
        </svg>
      )}
    </span>
  );
}
