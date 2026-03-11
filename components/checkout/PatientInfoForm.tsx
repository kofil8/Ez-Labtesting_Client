"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PatientInfoFormProps {
  onFormChange?: (data: PatientFormData, isValid: boolean) => void;
  initialData?: PatientFormData;
}

export function PatientInfoForm({
  onFormChange,
  initialData,
}: PatientInfoFormProps) {
  const isValidInternationalPhone = (value: string) => {
    const normalized = value.replace(/\s/g, "");
    return /^\+\d{7,15}$/.test(normalized);
  };

  const [formData, setFormData] = useState<PatientFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    dateOfBirth: initialData?.dateOfBirth || "",
    gender: initialData?.gender || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zipCode: initialData?.zipCode || "",
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    dateOfBirth: false,
    gender: false,
    phone: false,
    email: false,
    address: false,
    city: false,
    state: false,
    zipCode: false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const validateField = (field: keyof PatientFormData, value: string) => {
    let error = "";

    switch (field) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          error = "This field is required";
        } else if (value.trim().length < 2) {
          error = "Must be at least 2 characters";
        } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          error = "Only letters, spaces, hyphens, and apostrophes allowed";
        }
        break;
      case "dateOfBirth":
        if (!value) {
          error = "Date of birth is required";
        } else {
          const dob = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          if (dob > today) {
            error = "Date cannot be in the future";
          } else if (age < 0 || age > 120) {
            error = "Please enter a valid date of birth";
          }
        }
        break;
      case "gender":
        if (!value) {
          error = "Please select a gender";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!isValidInternationalPhone(value)) {
          error = "Please enter a valid phone number";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "address":
        if (!value.trim()) {
          error = "Address is required";
        }
        break;
      case "city":
        if (!value.trim()) {
          error = "City is required";
        }
        break;
      case "state":
        if (!value.trim()) {
          error = "State is required";
        } else if (!/^[A-Za-z]{2}$/.test(value.trim())) {
          error = "Use 2-letter state code";
        }
        break;
      case "zipCode":
        if (!value.trim()) {
          error = "ZIP code is required";
        } else if (!/^\d{5}(-\d{4})?$/.test(value.trim())) {
          error = "Invalid ZIP code";
        }
        break;
    }

    return error;
  };

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Validate if field has been touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }

    // Check overall validity
    const isValid = checkFormValidity(newFormData);
    onFormChange?.(newFormData, isValid);
  };

  const handleBlur = (field: keyof PatientFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const checkFormValidity = (data: PatientFormData) => {
    return (
      data.firstName.trim().length >= 2 &&
      data.lastName.trim().length >= 2 &&
      data.dateOfBirth !== "" &&
      data.gender !== "" &&
      !!data.phone &&
      isValidInternationalPhone(data.phone) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
      data.address.trim().length > 0 &&
      data.city.trim().length > 0 &&
      /^[A-Za-z]{2}$/.test(data.state.trim()) &&
      /^\d{5}(-\d{4})?$/.test(data.zipCode.trim()) &&
      !validateField("firstName", data.firstName) &&
      !validateField("lastName", data.lastName) &&
      !validateField("dateOfBirth", data.dateOfBirth) &&
      !validateField("gender", data.gender) &&
      !validateField("phone", data.phone) &&
      !validateField("email", data.email) &&
      !validateField("address", data.address) &&
      !validateField("city", data.city) &&
      !validateField("state", data.state) &&
      !validateField("zipCode", data.zipCode)
    );
  };

  useEffect(() => {
    const isValid = checkFormValidity(formData);
    onFormChange?.(formData, isValid);
  }, [formData, onFormChange]);

  return (
    <Card className='border-2'>
      <CardHeader className='bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 pb-4'>
        <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
          <User className='h-5 w-5 text-blue-600 dark:text-blue-400' />
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-6 space-y-4 sm:space-y-5'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* First Name */}
          <div className='space-y-2'>
            <Label htmlFor='firstName' className='text-sm font-medium'>
              First Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='firstName'
              type='text'
              placeholder='John'
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
              className={`h-11 ${
                touched.firstName && errors.firstName
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              autoComplete='off'
              required
            />
            {touched.firstName && errors.firstName && (
              <p className='text-xs text-red-500 mt-1'>{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className='space-y-2'>
            <Label htmlFor='lastName' className='text-sm font-medium'>
              Last Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='lastName'
              type='text'
              placeholder='Doe'
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName")}
              className={`h-11 ${
                touched.lastName && errors.lastName
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              autoComplete='off'
              required
            />
            {touched.lastName && errors.lastName && (
              <p className='text-xs text-red-500 mt-1'>{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* Date of Birth */}
          <div className='space-y-2'>
            <Label
              htmlFor='dateOfBirth'
              className='text-sm font-medium flex items-center gap-2'
            >
              <Calendar className='h-4 w-4' />
              Date of Birth <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='dateOfBirth'
              type='date'
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              onBlur={() => handleBlur("dateOfBirth")}
              className={`h-11 ${
                touched.dateOfBirth && errors.dateOfBirth
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              autoComplete='off'
              max={new Date().toISOString().split("T")[0]}
              required
            />
            {touched.dateOfBirth && errors.dateOfBirth && (
              <p className='text-xs text-red-500 mt-1'>{errors.dateOfBirth}</p>
            )}
          </div>

          {/* Gender */}
          <div className='space-y-2'>
            <Label htmlFor='gender' className='text-sm font-medium'>
              Gender <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => {
                handleInputChange("gender", value);
                setTouched((prev) => ({ ...prev, gender: true }));
              }}
              required
            >
              <SelectTrigger
                className={`h-11 ${
                  touched.gender && errors.gender
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
              >
                <SelectValue placeholder='Select gender' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='male'>Male</SelectItem>
                <SelectItem value='female'>Female</SelectItem>
                <SelectItem value='other'>Other</SelectItem>
                <SelectItem value='prefer-not-to-say'>
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
            {touched.gender && errors.gender && (
              <p className='text-xs text-red-500 mt-1'>{errors.gender}</p>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div className='space-y-2'>
          <Label htmlFor='phone' className='text-sm font-medium'>
            Phone Number <span className='text-red-500'>*</span>
          </Label>
          <PhoneInput
            defaultCountry='us'
            value={formData.phone}
            onChange={(value) => handleInputChange("phone", value || "")}
            onBlur={() => handleBlur("phone")}
            className='w-full'
            inputClassName={`h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${
              touched.phone && errors.phone
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }`}
            required
          />
          {touched.phone && errors.phone && (
            <p className='text-xs text-red-500 mt-1'>{errors.phone}</p>
          )}
          <p className='text-xs text-muted-foreground'>
            Include your country code
          </p>
        </div>

        {/* Email */}
        <div className='space-y-2'>
          <Label htmlFor='email' className='text-sm font-medium'>
            Email Address <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='email'
            type='email'
            placeholder='john.doe@example.com'
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            className={`h-11 ${
              touched.email && errors.email
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }`}
            autoComplete='email'
            required
          />
          {touched.email && errors.email && (
            <p className='text-xs text-red-500 mt-1'>{errors.email}</p>
          )}
          <p className='text-xs text-muted-foreground'>
            Required for lab results delivery
          </p>
        </div>

        {/* Address */}
        <div className='space-y-2'>
          <Label htmlFor='address' className='text-sm font-medium'>
            Address <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='address'
            type='text'
            placeholder='123 Main St'
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            onBlur={() => handleBlur("address")}
            className={`h-11 ${
              touched.address && errors.address
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }`}
            autoComplete='street-address'
            required
          />
          {touched.address && errors.address && (
            <p className='text-xs text-red-500 mt-1'>{errors.address}</p>
          )}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {/* City */}
          <div className='space-y-2'>
            <Label htmlFor='city' className='text-sm font-medium'>
              City <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='city'
              type='text'
              placeholder='Los Angeles'
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              onBlur={() => handleBlur("city")}
              className={`h-11 ${
                touched.city && errors.city
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              autoComplete='address-level2'
              required
            />
            {touched.city && errors.city && (
              <p className='text-xs text-red-500 mt-1'>{errors.city}</p>
            )}
          </div>

          {/* State */}
          <div className='space-y-2'>
            <Label htmlFor='state' className='text-sm font-medium'>
              State <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='state'
              type='text'
              placeholder='CA'
              value={formData.state}
              onChange={(e) =>
                handleInputChange("state", e.target.value.toUpperCase())
              }
              onBlur={() => handleBlur("state")}
              className={`h-11 ${
                touched.state && errors.state
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              autoComplete='address-level1'
              maxLength={2}
              required
            />
            {touched.state && errors.state && (
              <p className='text-xs text-red-500 mt-1'>{errors.state}</p>
            )}
          </div>

          {/* ZIP Code */}
          <div className='space-y-2'>
            <Label htmlFor='zipCode' className='text-sm font-medium'>
              ZIP Code <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='zipCode'
              type='text'
              placeholder='90001'
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              onBlur={() => handleBlur("zipCode")}
              className={`h-11 ${
                touched.zipCode && errors.zipCode
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              autoComplete='postal-code'
              required
            />
            {touched.zipCode && errors.zipCode && (
              <p className='text-xs text-red-500 mt-1'>{errors.zipCode}</p>
            )}
          </div>
        </div>

        {/* HIPAA Notice */}
        <div className='mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800'>
          <p className='text-xs text-muted-foreground flex items-start gap-2'>
            <ShieldCheck className='h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5' />
            <span>
              Your personal health information is protected under HIPAA
              regulations and will only be used for lab testing purposes.
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
