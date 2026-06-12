"use client";

import Image from "next/image";
import Link from "next/link";

interface HeaderLogoProps {
  onClick?: () => void;
}

export function HeaderLogo({ onClick }: HeaderLogoProps) {
  return (
    <Link
      href='/'
      className='group flex shrink-0 items-center gap-2.5 min-[600px]:gap-3'
      onClick={onClick}
    >
      <div className='relative h-9 w-9 overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-transform duration-200 group-hover:scale-[1.03] min-[600px]:h-10 min-[600px]:w-10'>
        <Image
          src='/images/logo.svg'
          alt='Ez LabTesting'
          fill
          className='object-contain p-1.5'
          priority
          unoptimized
        />
      </div>
      <div className='leading-tight'>
        <span className='block text-sm font-bold tracking-tight text-foreground min-[600px]:text-base'>
          Ez LabTesting
        </span>
        <span className='hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-primary min-[600px]:block'>
          Reliable and Fast Results
        </span>
      </div>
    </Link>
  );
}
