"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import {
  Calendar,
  Copy,
  Edit3,
  LogOut,
  Mail,
  MapPin,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SuperAdminProfileCardProps {
  user: User;
  onLogout?: () => void;
  onEdit?: () => void;
}

export function SuperAdminProfileCard({
  user,
  onLogout,
  onEdit,
}: SuperAdminProfileCardProps) {
  const router = useRouter();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fullName = `${user.firstName} ${user.lastName}`.trim() || "Admin";
  const userInitial = user.email?.charAt(0).toUpperCase() || "S";

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleLogout = async () => {
    onLogout?.();
  };

  const handleEdit = () => {
    onEdit?.();
  };

  const infoSections = [
    {
      title: "Contact Information",
      icon: Mail,
      items: [
        { label: "Email", value: user.email },
        {
          label: "Phone",
          value: user.phone || user.phoneNumber || "Not provided",
        },
      ],
    },
    {
      title: "Personal Information",
      icon: Calendar,
      items: [
        { label: "Date of Birth", value: user.dateOfBirth || "Not provided" },
        { label: "Gender", value: user.gender || "Not provided" },
      ],
    },
    {
      title: "Location",
      icon: MapPin,
      items: [
        {
          label: "Address",
          value:
            user.address ||
            `${user.addressLine1 || ""} ${user.addressLine2 || ""}`.trim() ||
            "Not provided",
        },
        {
          label: "City",
          value:
            `${user.city || ""}, ${user.state || ""} ${user.zipCode || ""}`.trim() ||
            "Not provided",
        },
      ],
    },
  ];

  return (
    <div className='space-y-8'>
      {/* Header Card */}
      <div className='overflow-hidden rounded-3xl border border-slate-200/80 bg-white/92 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.35)] backdrop-blur'>
        {/* Gradient Background */}
        <div className='h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500' />

        {/* Content */}
        <div className='px-6 pb-6 pt-0'>
          <div className='-mt-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between'>
            {/* User Info */}
            <div className='flex gap-4'>
              <div className='flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-blue-500 to-cyan-400 text-4xl font-bold text-white shadow-xl'>
                {user.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.profileImage}
                    alt={fullName}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  userInitial
                )}
              </div>
              <div className='flex flex-col justify-end pb-2'>
                <h1 className='text-2xl font-bold text-slate-900 sm:text-3xl'>
                  {fullName}
                </h1>
                <p className='text-sm text-slate-600 mt-1'>{user.email}</p>
                <div className='mt-3 flex flex-wrap gap-2'>
                  <Badge className='rounded-full bg-red-100 text-red-700 border border-red-200'>
                    <Shield className='h-3 w-3 mr-1' />
                    Superadmin
                  </Badge>
                  <Badge className='rounded-full bg-blue-100 text-blue-700 border border-blue-200'>
                    Full System Access
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-2'>
              {onEdit && (
                <Button onClick={handleEdit} className='gap-2'>
                  <Edit3 className='h-4 w-4' />
                  Edit Profile
                </Button>
              )}
              {onLogout && (
                <Button
                  variant='outline'
                  onClick={handleLogout}
                  className='gap-2 border-red-200 text-red-600 hover:bg-red-50'
                >
                  <LogOut className='h-4 w-4' />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Information Sections */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {infoSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className='overflow-hidden rounded-2xl border border-slate-200/80 bg-white/92 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.35)] backdrop-blur'
            >
              {/* Section Header */}
              <div className='border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600'>
                  <Icon className='h-5 w-5' />
                </div>
                <h3 className='font-semibold text-slate-900'>
                  {section.title}
                </h3>
              </div>

              {/* Section Content */}
              <div className='divide-y divide-slate-100 p-6'>
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className='py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3'
                  >
                    <div>
                      <p className='text-sm font-medium text-slate-500'>
                        {item.label}
                      </p>
                      <p className='text-slate-900 font-medium mt-1'>
                        {item.value}
                      </p>
                    </div>
                    {item.value !== "Not provided" && (
                      <button
                        onClick={() => handleCopy(item.value, item.label)}
                        className='mt-1 p-1.5 text-slate-400 hover:text-slate-600 transition-colors'
                        title='Copy to clipboard'
                      >
                        <Copy
                          className={cn(
                            "h-4 w-4 transition-colors",
                            copiedField === item.label
                              ? "text-green-600"
                              : "text-slate-400",
                          )}
                        />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bio Section */}
      {user.bio && (
        <div className='overflow-hidden rounded-2xl border border-slate-200/80 bg-white/92 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.35)] backdrop-blur p-6'>
          <h3 className='font-semibold text-slate-900 mb-3'>Bio</h3>
          <p className='text-slate-600 leading-relaxed'>{user.bio}</p>
        </div>
      )}

      {/* System Access Info */}
      <div className='overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.35)] backdrop-blur p-6'>
        <div className='flex items-start gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600'>
            <Shield className='h-6 w-6' />
          </div>
          <div>
            <h3 className='font-semibold text-slate-900'>System Access</h3>
            <p className='text-sm text-slate-600 mt-2'>
              As a Superadmin, you have full access to the system management
              panel. This includes managing admin users, system settings, audit
              logs, content management, and user management.
            </p>
            <div className='mt-4 flex flex-wrap gap-2'>
              <Badge variant='outline' className='rounded-full'>
                Admin Management
              </Badge>
              <Badge variant='outline' className='rounded-full'>
                System Settings
              </Badge>
              <Badge variant='outline' className='rounded-full'>
                Audit Logs
              </Badge>
              <Badge variant='outline' className='rounded-full'>
                Content Management
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
