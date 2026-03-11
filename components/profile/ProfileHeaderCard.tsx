import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";

interface ProfileHeaderCardProps {
  fullName: string;
  roleLabel: string;
  verificationStatus: "verified" | "unverified" | "pending";
  initials: string;
  avatarUrl?: string;
  avatarEditAction?: ReactNode;
  editAction?: ReactNode;
  logoutAction?: ReactNode;
  className?: string;
}

export function ProfileHeaderCard({
  fullName,
  roleLabel,
  verificationStatus,
  initials,
  avatarUrl,
  avatarEditAction,
  editAction,
  logoutAction,
  className,
}: ProfileHeaderCardProps) {
  const verificationLabel =
    verificationStatus === "verified"
      ? "Verified"
      : verificationStatus === "pending"
        ? "Pending"
        : "Unverified";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      <div className='h-24 bg-gradient-to-r from-blue-50 to-slate-50' />
      <div className='px-5 pb-5 sm:px-6 sm:pb-6'>
        <div className='-mt-10 flex flex-col gap-4 sm:-mt-9 sm:flex-row sm:items-start sm:justify-between'>
          <div className='flex min-w-0 items-center gap-4'>
            <div className='relative h-20 w-20'>
              <div className='flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-600 text-2xl font-semibold text-white shadow-sm'>
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={`${fullName} profile image`}
                    width={80}
                    height={80}
                    loading='eager'
                    className='h-full w-full object-cover'
                  />
                ) : (
                  initials
                )}
              </div>
              {avatarEditAction && (
                <div className='absolute -bottom-1 -right-1'>
                  {avatarEditAction}
                </div>
              )}
            </div>

            <div className='min-w-0 pt-4 sm:pt-2'>
              <h1 className='truncate text-2xl font-semibold text-slate-900 sm:text-3xl'>
                {fullName}
              </h1>
              <div className='mt-2 flex flex-wrap items-center gap-2'>
                <Badge
                  variant='secondary'
                  className='border border-blue-100 bg-blue-50 text-blue-700'
                >
                  {roleLabel}
                </Badge>
                <Badge
                  variant='outline'
                  className={cn(
                    "border",
                    verificationStatus === "verified"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-50 text-slate-700",
                  )}
                >
                  {verificationLabel}
                </Badge>
              </div>
            </div>
          </div>
          <div className='flex gap-2 pt-2 sm:pt-0'>
            {editAction && <div>{editAction}</div>}
            {logoutAction && <div>{logoutAction}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
