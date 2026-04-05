"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (user: User) => void;
}

export function UserEditDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: UserEditDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<User>({
    defaultValues: {
      role: "CUSTOMER",
      isVerified: false,
      status: "ACTIVE",
    },
  });

  const role = watch("role");
  const isVerified = watch("isVerified");
  const status = watch("status");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");

  useEffect(() => {
    if (user) {
      reset({
        ...user,
        // Normalize phoneNumber
        phoneNumber: user.phoneNumber || user.phone || "",
      });
      setPhoneNumber(user.phoneNumber || user.phone || "");
      setEmergencyContactPhone(user.emergencyContactPhone || "");
    } else {
      reset({
        id: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        dateOfBirth: "",
        address: "",
        bloodType: "",
        allergies: "",
        medicalConditions: "",
        medications: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        bio: "",
        role: "CUSTOMER",
        isVerified: false,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      } as Partial<User> as User);
      setPhoneNumber("");
      setEmergencyContactPhone("");
    }
  }, [user, reset, open]);

  const onSubmit = async (data: User) => {
    setIsSubmitting(true);
    try {
      const userData: User = {
        ...data,
        phoneNumber: phoneNumber,
        emergencyContactPhone: emergencyContactPhone,
        id: user?.id || `user-${Date.now()}`,
        createdAt: user?.createdAt || new Date().toISOString(),
      };

      // Remove phone field if it exists (use phoneNumber instead)
      delete userData.phone;

      await onSave(userData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>
            {user ? "Edit User" : "Create New User"}
          </DialogTitle>
          <DialogDescription>
            {user
              ? "Update user information and settings"
              : "Add a new user to the system"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='h-[calc(90vh-180px)] pr-4'>
          <form id='user-form' onSubmit={handleSubmit(onSubmit)}>
            <Tabs defaultValue='personal' className='w-full'>
              <TabsList className='grid w-full grid-cols-4'>
                <TabsTrigger value='personal'>Personal</TabsTrigger>
                <TabsTrigger value='contact'>Contact</TabsTrigger>
                <TabsTrigger value='medical'>Medical</TabsTrigger>
                <TabsTrigger value='account'>Account</TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value='personal' className='space-y-4 mt-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='firstName'>
                      First Name <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='firstName'
                      {...register("firstName", {
                        required: "First name is required",
                        minLength: {
                          value: 2,
                          message: "Minimum 2 characters",
                        },
                      })}
                      placeholder='Enter first name'
                    />
                    {errors.firstName && (
                      <p className='text-sm text-red-500'>
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='lastName'>
                      Last Name <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='lastName'
                      {...register("lastName", {
                        required: "Last name is required",
                        minLength: {
                          value: 2,
                          message: "Minimum 2 characters",
                        },
                      })}
                      placeholder='Enter last name'
                    />
                    {errors.lastName && (
                      <p className='text-sm text-red-500'>
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='dateOfBirth'>Date of Birth</Label>
                    <Input
                      id='dateOfBirth'
                      type='date'
                      {...register("dateOfBirth")}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='bloodType'>Blood Type</Label>
                    <Select
                      value={watch("bloodType") || ""}
                      onValueChange={(value) => setValue("bloodType", value)}
                    >
                      <SelectTrigger>
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
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='gender'>Gender</Label>
                    <Select
                      value={watch("gender") || ""}
                      onValueChange={(value) =>
                        setValue("gender", value as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select gender' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='MALE'>Male</SelectItem>
                        <SelectItem value='FEMALE'>Female</SelectItem>
                        <SelectItem value='NON_BINARY'>Non-binary</SelectItem>
                        <SelectItem value='PREFER_NOT_TO_SAY'>
                          Prefer not to say
                        </SelectItem>
                        <SelectItem value='OTHER'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='col-span-2 space-y-2'>
                    <Label htmlFor='bio'>Bio</Label>
                    <Textarea
                      id='bio'
                      {...register("bio", {
                        maxLength: {
                          value: 500,
                          message: "Maximum 500 characters",
                        },
                      })}
                      placeholder='Tell us about yourself...'
                      rows={3}
                      maxLength={500}
                    />
                    {errors.bio && (
                      <p className='text-sm text-red-500'>
                        {errors.bio.message}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Contact Information Tab */}
              <TabsContent value='contact' className='space-y-4 mt-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='col-span-2 space-y-2'>
                    <Label htmlFor='email'>
                      Email Address <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      placeholder='user@example.com'
                      disabled={!!user}
                    />
                    {errors.email && (
                      <p className='text-sm text-red-500'>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {!user && (
                    <div className='col-span-2 space-y-2'>
                      <Label htmlFor='password'>
                        Password <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='password'
                        type='password'
                        {...register("password", {
                          required: user ? false : "Password is required",
                          minLength: {
                            value: 6,
                            message: "Minimum 6 characters",
                          },
                        })}
                        placeholder='Enter password'
                      />
                      {errors.password && (
                        <p className='text-sm text-red-500'>
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div className='space-y-2'>
                    <Label htmlFor='phoneNumber'>Phone Number</Label>
                    <PhoneInput
                      defaultCountry='us'
                      value={phoneNumber}
                      onChange={(phone) => {
                        setPhoneNumber(phone);
                        setValue("phoneNumber", phone);
                      }}
                      inputProps={{
                        id: "phoneNumber",
                        placeholder: "Enter phone number",
                      }}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='emergencyContactPhone'>
                      Emergency Contact Phone
                    </Label>
                    <PhoneInput
                      defaultCountry='us'
                      value={emergencyContactPhone}
                      onChange={(phone) => {
                        setEmergencyContactPhone(phone);
                        setValue("emergencyContactPhone", phone);
                      }}
                      inputProps={{
                        id: "emergencyContactPhone",
                        placeholder: "Enter emergency contact phone",
                      }}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='emergencyContactName'>
                      Emergency Contact Name
                    </Label>
                    <Input
                      id='emergencyContactName'
                      {...register("emergencyContactName")}
                      placeholder='Enter contact name'
                    />
                  </div>

                  <div className='col-span-2 space-y-2'>
                    <Label htmlFor='address'>Address</Label>
                    <Textarea
                      id='address'
                      {...register("address", {
                        maxLength: {
                          value: 255,
                          message: "Maximum 255 characters",
                        },
                      })}
                      placeholder='Enter full address'
                      rows={2}
                      maxLength={255}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Medical Information Tab */}
              <TabsContent value='medical' className='space-y-4 mt-4'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='allergies'>Allergies</Label>
                    <Textarea
                      id='allergies'
                      {...register("allergies", {
                        maxLength: {
                          value: 500,
                          message: "Maximum 500 characters",
                        },
                      })}
                      placeholder='List any known allergies...'
                      rows={3}
                      maxLength={500}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Separate multiple allergies with commas
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='medicalConditions'>
                      Medical Conditions
                    </Label>
                    <Textarea
                      id='medicalConditions'
                      {...register("medicalConditions", {
                        maxLength: {
                          value: 500,
                          message: "Maximum 500 characters",
                        },
                      })}
                      placeholder='List any medical conditions...'
                      rows={3}
                      maxLength={500}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Separate multiple conditions with commas
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='medications'>Current Medications</Label>
                    <Textarea
                      id='medications'
                      {...register("medications", {
                        maxLength: {
                          value: 500,
                          message: "Maximum 500 characters",
                        },
                      })}
                      placeholder='List current medications...'
                      rows={3}
                      maxLength={500}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Include dosage information if available
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Account Settings Tab */}
              <TabsContent value='account' className='space-y-4 mt-4'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='role'>
                      Role <span className='text-red-500'>*</span>
                    </Label>
                    <Select
                      value={role}
                      onValueChange={(value) => setValue("role", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='CUSTOMER'>Customer</SelectItem>
                        <SelectItem value='LAB_PARTNER'>Lab Partner</SelectItem>
                        <SelectItem value='ADMIN'>Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-4 pt-2'>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='isVerified'
                        checked={isVerified}
                        onCheckedChange={(checked) =>
                          setValue("isVerified", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor='isVerified'
                        className='font-normal cursor-pointer'
                      >
                        Email Verified
                      </Label>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='status'>
                        Account Status <span className='text-red-500'>*</span>
                      </Label>
                      <Select
                        value={status}
                        onValueChange={(value) =>
                          setValue("status", value as any)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='ACTIVE'>Active</SelectItem>
                          <SelectItem value='DISABLED'>Disabled</SelectItem>
                          <SelectItem value='BLOCKED'>Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {user && (
                    <div className='bg-muted p-4 rounded-lg space-y-2 mt-4'>
                      <h4 className='font-semibold text-sm'>
                        Account Information
                      </h4>
                      <div className='grid grid-cols-2 gap-2 text-sm'>
                        <div>
                          <p className='text-muted-foreground'>User ID</p>
                          <p className='font-mono text-xs'>{user.id}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Created</p>
                          <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                        {user.lastLogin && (
                          <div>
                            <p className='text-muted-foreground'>Last Login</p>
                            <p>
                              {new Date(user.lastLogin).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </ScrollArea>

        <DialogFooter className='pt-4 border-t'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type='submit' form='user-form' disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : user ? "Update User" : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
