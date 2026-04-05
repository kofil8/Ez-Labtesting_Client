"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User } from "@/types/user";
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  Droplet,
  Heart,
  Mail,
  MapPin,
  Phone,
  Pill,
  Shield,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { useEffect } from "react";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function UserDetailsDialog({
  open,
  onOpenChange,
  user,
}: UserDetailsDialogProps) {
  // Debug: Log when user data changes
  useEffect(() => {
    if (user) {
      console.log("[UserDetailsDialog] User data updated:", user);
    }
  }, [user]);

  if (!user) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSimpleDate = (dateString?: string) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadge = (role: string) => {
    const normalizedRole = role.toUpperCase();
    const roleConfig: Record<string, { label: string; className: string }> = {
      SUPER_ADMIN: {
        label: "Super Admin",
        className: "bg-purple-500 hover:bg-purple-600",
      },
      ADMIN: { label: "Admin", className: "bg-orange-500 hover:bg-orange-600" },
      LAB_PARTNER: {
        label: "Lab Partner",
        className: "bg-blue-500 hover:bg-blue-600",
      },
      CUSTOMER: {
        label: "Customer",
        className: "bg-green-500 hover:bg-green-600",
      },
    };

    const config = roleConfig[normalizedRole] || roleConfig.CUSTOMER;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={user?.id}>
      <DialogContent className='max-w-4xl max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>User Details</DialogTitle>
          <DialogDescription>
            Complete information for {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='h-[calc(90vh-120px)] pr-4'>
          <div className='space-y-6'>
            {/* Personal Information */}
            <div>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <UserIcon className='h-5 w-5' />
                Personal Information
              </h3>
              <div className='grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg'>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>
                    First Name
                  </p>
                  <p className='font-medium'>
                    {user.firstName || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>
                    Last Name
                  </p>
                  <p className='font-medium'>
                    {user.lastName || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>
                    Date of Birth
                  </p>
                  <p className='font-medium flex items-center gap-2'>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                    {formatSimpleDate(user.dateOfBirth)}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>
                    Blood Type
                  </p>
                  <p className='font-medium flex items-center gap-2'>
                    <Droplet className='h-4 w-4 text-red-500' />
                    {user.bloodType || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>
                    Gender
                  </p>
                  <p className='font-medium'>
                    {user.gender
                      ? user.gender === "NON_BINARY"
                        ? "Non-binary"
                        : user.gender === "PREFER_NOT_TO_SAY"
                          ? "Prefer not to say"
                          : user.gender.charAt(0) +
                            user.gender.slice(1).toLowerCase()
                      : "Not provided"}
                  </p>
                </div>
                <div className='col-span-2'>
                  <p className='text-sm text-muted-foreground mb-1'>Bio</p>
                  <p className='font-medium text-sm'>
                    {user.bio || "No bio provided"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Phone className='h-5 w-5' />
                Contact Information
              </h3>
              <div className='grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg'>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>Email</p>
                  <p className='font-medium flex items-center gap-2'>
                    <Mail className='h-4 w-4 text-muted-foreground' />
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>
                    Phone Number
                  </p>
                  <p className='font-medium'>
                    {user.phoneNumber || user.phone || "Not provided"}
                  </p>
                </div>
                <div className='col-span-2'>
                  <p className='text-sm text-muted-foreground mb-1'>Address</p>
                  <p className='font-medium flex items-center gap-2'>
                    <MapPin className='h-4 w-4 text-muted-foreground' />
                    {user.address || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Medical Information */}
            <div>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Heart className='h-5 w-5' />
                Medical Information
              </h3>
              <div className='space-y-4 bg-muted/50 p-4 rounded-lg'>
                <div>
                  <p className='text-sm text-muted-foreground mb-1 flex items-center gap-2'>
                    <Shield className='h-4 w-4' />
                    Allergies
                  </p>
                  <p className='font-medium text-sm'>
                    {user.allergies || "None reported"}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1 flex items-center gap-2'>
                    <Activity className='h-4 w-4' />
                    Medical Conditions
                  </p>
                  <p className='font-medium text-sm'>
                    {user.medicalConditions || "None reported"}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1 flex items-center gap-2'>
                    <Pill className='h-4 w-4' />
                    Current Medications
                  </p>
                  <p className='font-medium text-sm'>
                    {user.medications || "None reported"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Emergency Contact */}
            <div>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Phone className='h-5 w-5 text-red-500' />
                Emergency Contact
              </h3>
              <div className='grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg'>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>
                    Contact Name
                  </p>
                  <p className='font-medium'>
                    {user.emergencyContactName || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>
                    Contact Phone
                  </p>
                  <p className='font-medium'>
                    {user.emergencyContactPhone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Status */}
            <div>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Shield className='h-5 w-5' />
                Account Status
              </h3>
              <div className='grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg'>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>Role</p>
                  <div className='mt-1'>{getRoleBadge(user.role)}</div>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>
                    Account Status
                  </p>
                  <div className='flex items-center gap-2 mt-1'>
                    {user.status?.toUpperCase() === "ACTIVE" ? (
                      <>
                        <CheckCircle className='h-4 w-4 text-green-500' />
                        <span className='font-medium text-green-600'>
                          Active
                        </span>
                      </>
                    ) : user.status?.toUpperCase() === "BLOCKED" ? (
                      <>
                        <XCircle className='h-4 w-4 text-red-500' />
                        <span className='font-medium text-red-600'>
                          Blocked
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className='h-4 w-4 text-gray-500' />
                        <span className='font-medium text-gray-600'>
                          Disabled
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>
                    Email Verification
                  </p>
                  <div className='flex items-center gap-2 mt-1'>
                    {user.isVerified ? (
                      <>
                        <CheckCircle className='h-4 w-4 text-green-500' />
                        <span className='font-medium text-green-600'>
                          Verified
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className='h-4 w-4 text-orange-500' />
                        <span className='font-medium text-orange-600'>
                          Not Verified
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>
                    MFA Status
                  </p>
                  <div className='flex items-center gap-2 mt-1'>
                    {user.mfaEnabled ? (
                      <>
                        <CheckCircle className='h-4 w-4 text-green-500' />
                        <span className='font-medium text-green-600'>
                          Enabled
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className='h-4 w-4 text-gray-500' />
                        <span className='font-medium text-gray-600'>
                          Disabled
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1 flex items-center gap-2'>
                    <Calendar className='h-4 w-4' />
                    Account Created
                  </p>
                  <p className='font-medium text-sm'>
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1 flex items-center gap-2'>
                    <Clock className='h-4 w-4' />
                    Last Login
                  </p>
                  <p className='font-medium text-sm'>
                    {formatDate(user.lastLogin)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
