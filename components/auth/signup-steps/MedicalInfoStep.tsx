"use client";

import { FieldError } from "@/components/shared/FieldError";
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
import { SignupFormData } from "@/lib/schemas/auth-schemas";
import {
  AlertCircle,
  Calendar,
  Droplet,
  Heart,
  Info,
  MapPin,
  Phone,
  Stethoscope,
  Users,
} from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

interface MedicalInfoStepProps {
  form: UseFormReturn<SignupFormData>;
  error: string;
}

export function MedicalInfoStep({ form, error }: MedicalInfoStepProps) {
  const {
    register,
    formState: { errors },
    setValue,
  } = form;

  const [bloodTypeValue, setBloodTypeValue] = useState("");
  const [emergencyPhoneValue, setEmergencyPhoneValue] = useState("");

  const handleEmergencyPhoneChange = (value: string) => {
    setEmergencyPhoneValue(value);
    // Remove '+' and spaces for backend
    const cleanPhone = value.replace(/[^0-9]/g, "");
    setValue("emergencyContactPhone", cleanPhone, { shouldValidate: true });
  };

  return (
    <div className='space-y-2.5 md:space-y-3'>
      {/* Header */}
      <div className='text-center pb-2.5 md:pb-3 border-b border-gray-200 animate-in fade-in slide-in-from-top-2 duration-500'>
        <div className='w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-1.5 md:mb-2 shadow-lg shadow-blue-200/50 animate-in zoom-in duration-500 delay-100'>
          <Heart className='w-5 h-5 md:w-6 md:h-6 text-white' />
        </div>
        <h2 className='text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-0.5'>
          Medical Information
        </h2>
        <p className='text-xs text-gray-600 mb-1.5'>
          Help us provide better care by sharing your health details
        </p>
        <div className='inline-flex items-center gap-1.5 lg:gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg px-3 py-1.5 text-xs text-amber-800 animate-in fade-in slide-in-from-bottom-1 duration-500 delay-200'>
          <Info className='w-3.5 h-3.5 flex-shrink-0' />
          <span className='font-medium'>
            Optional - You can skip this and add it later
          </span>
        </div>
      </div>

      {/* Personal Health Info */}
      <div className='animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150'>
        <div className='flex items-center gap-2 mb-2 lg:mb-3'>
          <div className='w-6 h-6 lg:w-7 lg:h-7 bg-blue-100 rounded-lg flex items-center justify-center'>
            <Droplet className='w-3.5 h-3.5 lg:w-4 lg:h-4 text-blue-600' />
          </div>
          <h3 className='text-sm lg:text-base font-bold text-gray-900'>
            Personal Health
          </h3>
        </div>

        <div className='space-y-3 lg:space-y-4'>
          {/* Date of Birth & Blood Type */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3'>
            <div className='space-y-1 md:space-y-1.5'>
              <Label
                htmlFor='dateOfBirth'
                className='text-xs lg:text-sm font-semibold text-gray-900'
              >
                Date of Birth
              </Label>
              <div className='form-group'>
                <Calendar className='input-icon absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 lg:h-4 lg:w-4 text-gray-400 transition-all duration-200' />
                <Input
                  id='dateOfBirth'
                  type='date'
                  className='pl-9 lg:pl-10 h-10 lg:h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm'
                  {...register("dateOfBirth")}
                />
              </div>
              <FieldError
                error={errors.dateOfBirth?.message}
                id='dateOfBirth-error'
              />
            </div>

            <div className='space-y-1 md:space-y-1.5'>
              <Label
                htmlFor='bloodType'
                className='text-xs lg:text-sm font-semibold text-gray-900'
              >
                Blood Type
              </Label>
              <Select
                value={bloodTypeValue}
                onValueChange={(value) => {
                  setBloodTypeValue(value);
                  setValue("bloodType", value, { shouldValidate: true });
                }}
              >
                <SelectTrigger className='h-10 lg:h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm'>
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
              <FieldError
                error={errors.bloodType?.message}
                id='bloodType-error'
              />
            </div>
          </div>

          {/* Address */}
          <div className='space-y-1 md:space-y-1.5'>
            <Label
              htmlFor='address'
              className='text-xs lg:text-sm font-semibold text-gray-900'
            >
              Address
            </Label>
            <div className='form-group'>
              <MapPin className='input-icon absolute left-3 top-3.5 h-3.5 w-3.5 lg:h-4 lg:w-4 text-gray-400 transition-all duration-200' />
              <Input
                id='address'
                placeholder='123 Main St, City, State ZIP'
                className='pl-9 lg:pl-10 h-10 lg:h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm'
                {...register("address")}
              />
            </div>
            <FieldError error={errors.address?.message} id='address-error' />
          </div>
        </div>
      </div>

      {/* Medical History */}
      <div className='pt-3 lg:pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200'>
        <div className='flex items-center gap-2 mb-2 lg:mb-3'>
          <div className='w-6 h-6 lg:w-7 lg:h-7 bg-red-100 rounded-lg flex items-center justify-center'>
            <Stethoscope className='w-3.5 h-3.5 lg:w-4 lg:h-4 text-red-600' />
          </div>
          <h3 className='text-sm lg:text-base font-bold text-gray-900'>
            Medical History
          </h3>
        </div>

        <div className='space-y-3 lg:space-y-3.5'>
          {/* Allergies */}
          <div className='space-y-1 md:space-y-1.5'>
            <Label
              htmlFor='allergies'
              className='text-xs lg:text-sm font-semibold text-gray-900 flex items-center gap-1.5'
            >
              <AlertCircle className='w-3.5 h-3.5 text-orange-500' />
              Allergies
            </Label>
            <Textarea
              id='allergies'
              placeholder='List any allergies (medications, food, environmental, etc.)'
              rows={2}
              className='border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none transition-all duration-200 text-sm'
              {...register("allergies")}
              maxLength={500}
            />
            <p className='text-xs text-gray-500'>
              Separate multiple allergies with commas
            </p>
            <FieldError
              error={errors.allergies?.message}
              id='allergies-error'
            />
          </div>

          {/* Medical Conditions */}
          <div className='space-y-1 md:space-y-1.5'>
            <Label
              htmlFor='medicalConditions'
              className='text-xs lg:text-sm font-semibold text-gray-900'
            >
              Medical Conditions
            </Label>
            <Textarea
              id='medicalConditions'
              placeholder='List any chronic conditions, diagnoses, or ongoing health issues'
              rows={2}
              className='border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none transition-all duration-200 text-sm'
              {...register("medicalConditions")}
              maxLength={500}
            />
            <FieldError
              error={errors.medicalConditions?.message}
              id='medicalConditions-error'
            />
          </div>

          {/* Current Medications */}
          <div className='space-y-1 md:space-y-1.5'>
            <Label
              htmlFor='medications'
              className='text-xs lg:text-sm font-semibold text-gray-900'
            >
              Current Medications
            </Label>
            <Textarea
              id='medications'
              placeholder='List current medications and dosages (if applicable)'
              rows={2}
              className='border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none transition-all duration-200 text-sm'
              {...register("medications")}
              maxLength={500}
            />
            <FieldError
              error={errors.medications?.message}
              id='medications-error'
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className='pt-2.5 md:pt-3 border-t border-gray-200 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-250'>
        <div className='bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-2.5 md:p-3 space-y-2 md:space-y-2.5 hover:shadow-md transition-all duration-200'>
          <div className='flex items-center gap-1.5'>
            <div className='w-5 h-5 md:w-6 md:h-6 bg-red-600 rounded-lg flex items-center justify-center shadow-sm'>
              <AlertCircle className='w-3.5 h-3.5 md:w-4 md:h-4 text-white' />
            </div>
            <h3 className='text-xs md:text-sm font-bold text-gray-900'>
              Emergency Contact
            </h3>
          </div>

          <p className='text-xs text-red-700 bg-red-100 p-2 rounded-lg border border-red-200'>
            <strong>Important:</strong> This person will be contacted in case of
            medical emergencies
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3'>
            <div className='space-y-1 md:space-y-1.5'>
              <Label
                htmlFor='emergencyContactName'
                className='text-xs lg:text-sm font-semibold text-gray-900 flex items-center gap-1.5'
              >
                <Users className='w-3.5 h-3.5 text-red-600' />
                Contact Name
              </Label>
              <Input
                id='emergencyContactName'
                placeholder='Full name'
                className='h-10 lg:h-11 border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white transition-all duration-200 text-sm'
                {...register("emergencyContactName")}
              />
              <FieldError
                error={errors.emergencyContactName?.message}
                id='emergencyContactName-error'
              />
            </div>

            <div className='space-y-1 md:space-y-1.5'>
              <Label
                htmlFor='emergencyContactPhone'
                className='text-xs lg:text-sm font-semibold text-gray-900 flex items-center gap-1.5'
              >
                <Phone className='w-3.5 h-3.5 text-red-600' />
                Contact Phone
              </Label>
              <PhoneInput
                defaultCountry='us'
                value={emergencyPhoneValue}
                onChange={handleEmergencyPhoneChange}
                placeholder='Enter phone number'
                inputClassName='h-10 lg:h-11 pl-12 border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-sm'
                countrySelectorStyleProps={{
                  buttonClassName:
                    "h-10 lg:h-11 border-red-200 hover:bg-red-50 focus:outline-none transition-all duration-200",
                  flagClassName: "h-3.5 w-5 lg:h-4 lg:w-6 rounded",
                }}
                className='react-international-phone-input-emergency'
                style={
                  {
                    "--react-international-phone-height": "40px",
                    "--react-international-phone-border-radius": "0.5rem",
                    "--react-international-phone-border-color": "#fecaca",
                    "--react-international-phone-background-color": "#ffffff",
                    "--react-international-phone-text-color": "#111827",
                    "--react-international-phone-selected-dropdown-item-background-color":
                      "#fee2e2",
                    "--react-international-phone-country-selector-background-color-hover":
                      "#fef2f2",
                    "--react-international-phone-input-border-color": "#fecaca",
                    "--react-international-phone-input-focus-border-color":
                      "#ef4444",
                  } as React.CSSProperties
                }
              />
              <FieldError
                error={errors.emergencyContactPhone?.message}
                id='emergencyContactPhone-error'
              />
              {emergencyPhoneValue && !errors.emergencyContactPhone && (
                <p className='text-xs text-green-600 flex items-center gap-1 animate-in fade-in slide-in-from-left-1 duration-300'>
                  <span className='w-1 h-1 bg-green-600 rounded-full animate-pulse'></span>
                  Valid phone number
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
