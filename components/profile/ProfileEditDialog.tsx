"use client";

import { getProfile } from "@/app/actions/get-profile";
import { updateProfile } from "@/app/actions/update-profile";
import { PhoneInputField } from "@/components/shared/PhoneInputField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Heart, Loader2, Stethoscope, User } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  user?: any;
}

export function ProfileEditDialog({
  open,
  onOpenChange,
  onSuccess,
  user: initialUser,
}: ProfileEditDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(initialUser || null);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [bio, setBio] = useState("");

  // Fetch user data when dialog opens
  useEffect(() => {
    if (open) {
      const fetchUser = async () => {
        if (initialUser) {
          setUser(initialUser);
          return;
        }
        setLoading(true);
        try {
          const res = await getProfile();
          if (res?.success && res.profile) {
            setUser(res.profile);
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          toast.error(
            "Unable to load your profile. Your data remains secure. Please try again.",
          );
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [open, initialUser]);

  // Reset form when dialog opens or user changes
  useEffect(() => {
    if (open && user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || user.phoneNumber || "");
      setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "");
      setGender(user.gender || "");
      setAddress(user.address || "");
      setBloodType(user.bloodType || "");
      setAllergies(user.allergies || "");
      setMedicalConditions(user.medicalConditions || "");
      setMedications(user.medications || "");
      setEmergencyContactName(user.emergencyContactName || "");
      setEmergencyContactPhone(user.emergencyContactPhone || "");
      setBio(user.bio || "");
    }
  }, [open, user]);

  const handleAction = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      try {
        const res = await updateProfile(formData);
        if (res?.success) {
          toast.success("Your profile has been updated.");
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
        if (
          errorMessage.toLowerCase().includes("session has expired") ||
          errorMessage.toLowerCase().includes("not authenticated")
        ) {
          setTimeout(() => {
            onOpenChange(false);
          }, 2000);
        }
      }
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName.trim());
    formData.append("lastName", lastName.trim());
    if (phone) formData.append("phoneNumber", phone.trim());
    if (dateOfBirth) formData.append("dateOfBirth", dateOfBirth);
    if (gender) formData.append("gender", gender);
    if (address) formData.append("address", address.trim());
    if (bloodType) formData.append("bloodType", bloodType);
    if (allergies) formData.append("allergies", allergies.trim());
    if (medicalConditions)
      formData.append("medicalConditions", medicalConditions.trim());
    if (medications) formData.append("medications", medications.trim());
    if (emergencyContactName)
      formData.append("emergencyContactName", emergencyContactName.trim());
    if (emergencyContactPhone)
      formData.append("emergencyContactPhone", emergencyContactPhone.trim());
    if (bio) formData.append("bio", bio.trim());

    handleAction(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0'>
        <div className='bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-6 pb-8'>
          <DialogHeader className='text-white'>
            <DialogTitle className='text-2xl font-bold text-white'>
              Edit Profile
            </DialogTitle>
            <DialogDescription className='text-white/90'>
              Update your personal information and medical details.
            </DialogDescription>
          </DialogHeader>
        </div>

        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
          </div>
        ) : !user ? (
          <div className='p-6 text-center text-muted-foreground'>
            Unable to load profile information
          </div>
        ) : (
          <form onSubmit={onSubmit} className='p-6'>
            {error && (
              <div className='mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20'>
                <p className='text-sm text-destructive text-center'>{error}</p>
              </div>
            )}

            <div className='space-y-8'>
              {/* Personal Information Section */}
              <div>
                <div className='flex items-center gap-2 mb-4'>
                  <User className='w-5 h-5 text-blue-600' />
                  <h3 className='text-lg font-semibold text-foreground'>
                    Personal Information
                  </h3>
                </div>
                <div className='space-y-4'>
                  {/* Name Fields */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='firstName'
                        className='text-sm font-medium'
                      >
                        First name <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='firstName'
                        placeholder='John'
                        className='h-10'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='lastName' className='text-sm font-medium'>
                        Last name <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='lastName'
                        placeholder='Doe'
                        className='h-10'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Email (Read-only) */}
                  <div className='space-y-2'>
                    <Label htmlFor='email' className='text-sm font-medium'>
                      Email
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      value={user.email}
                      disabled
                      className='h-10 bg-muted'
                    />
                    <p className='text-xs text-muted-foreground'>
                      Email cannot be changed. Contact support if you need to
                      update it.
                    </p>
                  </div>

                  {/* Phone and Date of Birth */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <PhoneInputField
                        id='phone'
                        label='Phone number'
                        value={phone}
                        onChange={setPhone}
                        placeholder='Enter phone number'
                        helperText='Include country code when needed'
                        defaultCountry='us'
                        variant='compact'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='dateOfBirth'
                        className='text-sm font-medium'
                      >
                        Date of birth
                      </Label>
                      <Input
                        id='dateOfBirth'
                        type='date'
                        className='h-10'
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className='space-y-2'>
                    <Label htmlFor='gender' className='text-sm font-medium'>
                      Gender
                    </Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className='h-10'>
                        <SelectValue placeholder='Select gender' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='MALE'>Male</SelectItem>
                        <SelectItem value='FEMALE'>Female</SelectItem>
                        <SelectItem value='NON_BINARY'>Non-Binary</SelectItem>
                        <SelectItem value='PREFER_NOT_TO_SAY'>
                          Prefer not to say
                        </SelectItem>
                        <SelectItem value='OTHER'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Address */}
                  <div className='space-y-2'>
                    <Label htmlFor='address' className='text-sm font-medium'>
                      Address
                    </Label>
                    <Input
                      id='address'
                      placeholder='123 Main St, City, State ZIP'
                      className='h-10'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  {/* Bio */}
                  <div className='space-y-2'>
                    <Label htmlFor='bio' className='text-sm font-medium'>
                      Bio
                    </Label>
                    <Textarea
                      id='bio'
                      placeholder='Tell us about yourself...'
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={500}
                      className='resize-none'
                    />
                    <div className='flex justify-between items-center'>
                      <p className='text-xs text-muted-foreground'>
                        Optional. Write a short bio (max 500 characters).
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {bio.length}/500
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information Section */}
              <div className='pt-6 border-t border-blue-200/50'>
                <div className='flex items-center gap-2 mb-4'>
                  <Heart className='w-5 h-5 text-red-600' />
                  <h3 className='text-lg font-semibold text-foreground'>
                    Medical Information
                  </h3>
                </div>
                <div className='space-y-4'>
                  {/* Blood Type */}
                  <div className='space-y-2'>
                    <Label htmlFor='bloodType' className='text-sm font-medium'>
                      Blood Type
                    </Label>
                    <Select value={bloodType} onValueChange={setBloodType}>
                      <SelectTrigger className='h-10'>
                        <SelectValue placeholder='Select blood type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='A+'>A+</SelectItem>
                        <SelectItem value='A-'>A-</SelectItem>
                        <SelectItem value='B+'>B+</SelectItem>
                        <SelectItem value='B-'>B-</SelectItem>
                        <SelectItem value='AB+'>AB+</SelectItem>
                        <SelectItem value='AB-'>AB-</SelectItem>
                        <SelectItem value='O+'>O+</SelectItem>
                        <SelectItem value='O-'>O-</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className='text-xs text-muted-foreground'>
                      Your blood type helps us provide better care
                    </p>
                  </div>

                  {/* Allergies */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='allergies'
                      className='text-sm font-medium flex items-center gap-2'
                    >
                      <AlertCircle className='w-4 h-4 text-orange-500' />
                      Allergies
                    </Label>
                    <Textarea
                      id='allergies'
                      placeholder='List any allergies (medications, food, etc.)'
                      rows={2}
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      maxLength={500}
                      className='resize-none'
                    />
                    <p className='text-xs text-muted-foreground'>
                      Separate multiple allergies with commas
                    </p>
                  </div>

                  {/* Medical Conditions */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='medicalConditions'
                      className='text-sm font-medium'
                    >
                      Medical Conditions
                    </Label>
                    <Textarea
                      id='medicalConditions'
                      placeholder='List any chronic conditions or diagnoses'
                      rows={2}
                      value={medicalConditions}
                      onChange={(e) => setMedicalConditions(e.target.value)}
                      maxLength={500}
                      className='resize-none'
                    />
                  </div>

                  {/* Current Medications */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='medications'
                      className='text-sm font-medium flex items-center gap-2'
                    >
                      <Stethoscope className='w-4 h-4 text-blue-600' />
                      Current Medications
                    </Label>
                    <Textarea
                      id='medications'
                      placeholder='List current medications and dosages'
                      rows={2}
                      value={medications}
                      onChange={(e) => setMedications(e.target.value)}
                      maxLength={500}
                      className='resize-none'
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className='pt-6 border-t border-red-200/50'>
                <div className='flex items-center gap-2 mb-4'>
                  <AlertCircle className='w-5 h-5 text-red-600' />
                  <h3 className='text-lg font-semibold text-foreground'>
                    Emergency Contact
                  </h3>
                </div>
                <div className='space-y-4'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='emergencyContactName'
                        className='text-sm font-medium'
                      >
                        Contact Name
                      </Label>
                      <Input
                        id='emergencyContactName'
                        placeholder='Full name'
                        className='h-10'
                        value={emergencyContactName}
                        onChange={(e) =>
                          setEmergencyContactName(e.target.value)
                        }
                      />
                    </div>

                    <div className='space-y-2'>
                      <PhoneInputField
                        id='emergencyContactPhone'
                        label='Contact Phone'
                        value={emergencyContactPhone}
                        onChange={setEmergencyContactPhone}
                        placeholder='Enter phone number'
                        defaultCountry='us'
                        variant='compact'
                      />
                    </div>
                  </div>
                  <p className='text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/30'>
                    <strong>Important:</strong> This person will be contacted in
                    case of medical emergencies
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className='pt-6 mt-6 border-t gap-2'>
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
                type='submit'
                disabled={isPending}
                className='min-w-[100px] bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
              >
                {isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
