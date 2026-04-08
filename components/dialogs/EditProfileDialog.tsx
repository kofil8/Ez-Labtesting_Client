"use client";

import { Profile, UpdateProfilePayload } from "@/app/profile/types/profile";
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
import { useToast } from "@/hook/use-toast";
import { cn } from "@/lib/utils";
import { AlertCircle, HeartPulse, Phone, Shield } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface FormValues {
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  currentMedications: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

interface EditProfileDialogProps {
  profile: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: UpdateProfilePayload) => Promise<void>;
  isLoading?: boolean;
}

function normalizeDateForInput(value?: string): string {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().split("T")[0];
}

function toFormValues(profile: Profile): FormValues {
  return {
    phone: profile.contactInfo.phone || "",
    dateOfBirth: normalizeDateForInput(profile.contactInfo.dateOfBirth),
    gender: profile.contactInfo.gender || "",
    address: profile.contactInfo.address || "",
    bloodType: profile.medicalInfo.bloodType || "",
    allergies: profile.medicalInfo.allergies?.join(", ") || "",
    medicalConditions: profile.medicalInfo.medicalConditions?.join(", ") || "",
    currentMedications:
      profile.medicalInfo.currentMedications?.join(", ") || "",
    emergencyContactName: profile.emergencyContact.name || "",
    emergencyContactPhone: profile.emergencyContact.phone || "",
  };
}

export function EditProfileDialog({
  profile,
  open,
  onOpenChange,
  onSave,
  isLoading = false,
}: EditProfileDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const { toast } = useToast();

  const initialValues = useMemo(() => toFormValues(profile), [profile]);
  const [formValues, setFormValues] = useState<FormValues>(initialValues);

  useEffect(() => {
    if (open) {
      setFormValues(initialValues);
      setErrors({});
    }
  }, [open, initialValues]);

  const handleInputChange = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const hasChanges = useMemo(
    () => JSON.stringify(formValues) !== JSON.stringify(initialValues),
    [formValues, initialValues],
  );

  const validateForm = () => {
    const nextErrors: Partial<FormValues> = {};

    const phonePattern = /^[+]?[(]?[0-9\s\-()]{7,20}$/;
    const hasPhone = formValues.phone.trim().length > 0;
    const hasEmergencyPhone =
      formValues.emergencyContactPhone.trim().length > 0;

    if (hasPhone && !phonePattern.test(formValues.phone.trim())) {
      nextErrors.phone = "Please enter a valid phone number.";
    }

    if (
      hasEmergencyPhone &&
      !phonePattern.test(formValues.emergencyContactPhone.trim())
    ) {
      nextErrors.emergencyContactPhone =
        "Please enter a valid emergency contact phone.";
    }

    if (formValues.dateOfBirth) {
      const dob = new Date(formValues.dateOfBirth);
      const now = new Date();
      if (Number.isNaN(dob.getTime()) || dob > now) {
        nextErrors.dateOfBirth = "Date of birth must be a valid past date.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      const payload: UpdateProfilePayload = {
        phone: formValues.phone || undefined,
        dateOfBirth: formValues.dateOfBirth || undefined,
        gender: formValues.gender || undefined,
        address: formValues.address || undefined,
        bloodType: formValues.bloodType || undefined,
        allergies: formValues.allergies
          ? formValues.allergies
              .split(",")
              .map((a: string) => a.trim())
              .filter(Boolean)
          : [],
        medicalConditions: formValues.medicalConditions
          ? formValues.medicalConditions
              .split(",")
              .map((c: string) => c.trim())
              .filter(Boolean)
          : [],
        currentMedications: formValues.currentMedications
          ? formValues.currentMedications
              .split(",")
              .map((m: string) => m.trim())
              .filter(Boolean)
          : [],
        emergencyContactName: formValues.emergencyContactName || undefined,
        emergencyContactPhone: formValues.emergencyContactPhone || undefined,
      };

      await onSave(payload);

      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const isSubmitDisabled = isSaving || isLoading || !hasChanges;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-hidden p-0'>
        <DialogHeader className='border-b border-slate-200 px-6 pb-4 pt-6'>
          <DialogTitle className='text-xl text-slate-900'>
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your personal and medical details. Changes are saved
            securely.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className='flex max-h-[calc(90vh-104px)] flex-col'
        >
          <div className='space-y-6 overflow-y-auto px-6 py-5'>
            {(errors.phone ||
              errors.dateOfBirth ||
              errors.emergencyContactPhone) && (
              <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
                <div className='flex items-start gap-2'>
                  <AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
                  <p>Please correct invalid fields before saving.</p>
                </div>
              </div>
            )}

            <section className='rounded-xl border border-slate-200 bg-white p-4 sm:p-5'>
              <div className='mb-4 flex items-center gap-2'>
                <Phone className='h-4 w-4 text-blue-600' />
                <h3 className='text-sm font-semibold text-slate-900'>
                  Contact Information
                </h3>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='sm:col-span-2'>
                  <PhoneInputField
                    id='phone'
                    label='Phone Number'
                    value={formValues.phone}
                    onChange={(value) => handleInputChange("phone", value)}
                    error={errors.phone}
                    defaultCountry='us'
                    placeholder='Enter phone number'
                    variant='compact'
                    showIcon={false}
                  />
                </div>

                <div>
                  <Label htmlFor='dateOfBirth'>Date of Birth</Label>
                  <Input
                    id='dateOfBirth'
                    type='date'
                    value={formValues.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className={cn(
                      "mt-1",
                      errors.dateOfBirth &&
                        "border-red-300 focus-visible:ring-red-200",
                    )}
                  />
                  {errors.dateOfBirth && (
                    <p className='mt-1 text-xs text-red-600'>
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor='gender'>Gender</Label>
                  <Select
                    value={formValues.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                  >
                    <SelectTrigger className='mt-1 h-11 rounded-lg border-2 border-blue-100'>
                      <SelectValue placeholder='Select gender' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='male'>Male</SelectItem>
                      <SelectItem value='female'>Female</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                      <SelectItem value='prefer_not_to_say'>
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor='bloodType'>Blood Type</Label>
                  <Select
                    value={formValues.bloodType}
                    onValueChange={(value) =>
                      handleInputChange("bloodType", value)
                    }
                  >
                    <SelectTrigger className='mt-1 h-11 rounded-lg border-2 border-blue-100'>
                      <SelectValue placeholder='Select blood type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='O+'>O+</SelectItem>
                      <SelectItem value='O-'>O-</SelectItem>
                      <SelectItem value='A+'>A+</SelectItem>
                      <SelectItem value='A-'>A-</SelectItem>
                      <SelectItem value='B+'>B+</SelectItem>
                      <SelectItem value='B-'>B-</SelectItem>
                      <SelectItem value='AB+'>AB+</SelectItem>
                      <SelectItem value='AB-'>AB-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='sm:col-span-2'>
                  <Label htmlFor='address'>Address</Label>
                  <Textarea
                    id='address'
                    placeholder='Street, City, State, ZIP'
                    value={formValues.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className='mt-1 min-h-[88px]'
                  />
                </div>
              </div>
            </section>

            <section className='rounded-xl border border-slate-200 bg-white p-4 sm:p-5'>
              <div className='mb-4 flex items-center gap-2'>
                <HeartPulse className='h-4 w-4 text-blue-600' />
                <h3 className='text-sm font-semibold text-slate-900'>
                  Medical Information
                </h3>
              </div>

              <div className='space-y-4'>
                <div>
                  <Label htmlFor='allergies'>Allergies</Label>
                  <Textarea
                    id='allergies'
                    placeholder='e.g., Penicillin, Shellfish'
                    value={formValues.allergies}
                    onChange={(e) =>
                      handleInputChange("allergies", e.target.value)
                    }
                    className='mt-1 min-h-[88px]'
                  />
                  <p className='mt-1 text-xs text-muted-foreground'>
                    Use commas to separate items.
                  </p>
                </div>

                <div>
                  <Label htmlFor='medicalConditions'>Medical Conditions</Label>
                  <Textarea
                    id='medicalConditions'
                    placeholder='e.g., Hypertension, Diabetes'
                    value={formValues.medicalConditions}
                    onChange={(e) =>
                      handleInputChange("medicalConditions", e.target.value)
                    }
                    className='mt-1 min-h-[88px]'
                  />
                  <p className='mt-1 text-xs text-muted-foreground'>
                    Use commas to separate items.
                  </p>
                </div>

                <div>
                  <Label htmlFor='currentMedications'>
                    Current Medications
                  </Label>
                  <Textarea
                    id='currentMedications'
                    placeholder='e.g., Lisinopril 10mg, Metformin 500mg'
                    value={formValues.currentMedications}
                    onChange={(e) =>
                      handleInputChange("currentMedications", e.target.value)
                    }
                    className='mt-1 min-h-[88px]'
                  />
                  <p className='mt-1 text-xs text-muted-foreground'>
                    Use commas to separate items.
                  </p>
                </div>
              </div>
            </section>

            <section className='rounded-xl border border-slate-200 bg-white p-4 sm:p-5'>
              <div className='mb-4 flex items-center gap-2'>
                <Shield className='h-4 w-4 text-blue-600' />
                <h3 className='text-sm font-semibold text-slate-900'>
                  Emergency Contact
                </h3>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div>
                  <Label htmlFor='emergencyContactName'>Contact Name</Label>
                  <Input
                    id='emergencyContactName'
                    placeholder='John Doe'
                    value={formValues.emergencyContactName}
                    onChange={(e) =>
                      handleInputChange("emergencyContactName", e.target.value)
                    }
                    className='mt-1'
                  />
                </div>

                <div>
                  <PhoneInputField
                    id='emergencyContactPhone'
                    label='Contact Phone'
                    value={formValues.emergencyContactPhone}
                    onChange={(value) =>
                      handleInputChange("emergencyContactPhone", value)
                    }
                    error={errors.emergencyContactPhone}
                    placeholder='Enter phone number'
                    defaultCountry='us'
                    variant='compact'
                    showIcon={false}
                  />
                </div>
              </div>
            </section>
          </div>

          <DialogFooter className='sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isSaving || isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitDisabled}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
