"use client";

import { registerUser } from "@/app/actions/register-user";
import { FormStateMessage } from "@/components/auth/FormStateMessage";
import { FieldError } from "@/components/shared/FieldError";
import { Button } from "@/components/ui/button";
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
import {
  SignupMedicalFormData,
  signupMedicalSchema,
} from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Calendar, ChevronLeft, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { toast } from "sonner";
import {
  BLOOD_TYPES,
  buildRegistrationFormData,
  clearAccountDraft,
  loadAccountDraft,
} from "./register-flow-storage";

export function RegisterMedicalForm() {
  const router = useRouter();
  const accountDraft = useMemo(() => loadAccountDraft(), []);

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupMedicalFormData>({
    resolver: zodResolver(signupMedicalSchema),
    mode: "onBlur",
    defaultValues: {
      dateOfBirth: "",
      bloodType: "",
      address: "",
      allergies: "",
      medicalConditions: "",
      medications: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    },
  });

  useEffect(() => {
    if (!accountDraft) {
      router.replace("/register/account");
    }
  }, [accountDraft, router]);

  const submitRegistration = (medicalData?: SignupMedicalFormData) => {
    if (!accountDraft) return;

    setError("");
    const formData = buildRegistrationFormData(accountDraft, medicalData);

    startTransition(async () => {
      try {
        const res = await registerUser(formData);
        if (res?.success) {
          const email = res.email || accountDraft.email;
          if (typeof window !== "undefined") {
            sessionStorage.setItem("otp_email", email);
          }
          clearAccountDraft();
          toast.success("Account created. Please verify your email to continue.");
          router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        }
      } catch (err: any) {
        const message =
          err?.message ||
          "We could not complete your registration. Please review the form and try again.";
        setError(message);
        toast.error(message);
      }
    });
  };

  if (!accountDraft) {
    return null;
  }

  return (
    <div className='space-y-6'>
      {error ? (
        <FormStateMessage
          type='error'
          message='Registration failed'
          details={error}
          onDismiss={() => setError("")}
        />
      ) : null}

      <div className='rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-900'>
        <p className='font-semibold'>Medical information is optional.</p>
        <p className='mt-1 text-xs text-amber-800'>
          You can skip this step and add or edit details later from your profile after verification.
        </p>
      </div>

      <form onSubmit={handleSubmit((values) => submitRegistration(values))} noValidate className='space-y-5'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label htmlFor='dateOfBirth'>Date of Birth</Label>
            <div className='form-group relative'>
              <Calendar className='input-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
              <Input
                id='dateOfBirth'
                type='date'
                className='h-11 border-slate-300 pl-10 focus-visible:ring-blue-200'
                {...register("dateOfBirth")}
              />
            </div>
            <FieldError error={errors.dateOfBirth?.message} id='dateOfBirth-error' />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='bloodType'>Blood Type</Label>
            <Select onValueChange={(value) => setValue("bloodType", value, { shouldDirty: true })}>
              <SelectTrigger id='bloodType' className='h-11 border-slate-300'>
                <SelectValue placeholder='Select blood type' />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_TYPES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError error={errors.bloodType?.message} id='bloodType-error' />
          </div>
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='address'>Address</Label>
          <div className='form-group relative'>
            <MapPin className='input-icon pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400' />
            <Input
              id='address'
              placeholder='123 Main St, City, State ZIP'
              className='h-11 border-slate-300 pl-10 focus-visible:ring-blue-200'
              {...register("address")}
            />
          </div>
          <FieldError error={errors.address?.message} id='address-error' />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='allergies'>Allergies</Label>
          <Textarea
            id='allergies'
            rows={3}
            maxLength={500}
            placeholder='List medication, food, or environmental allergies'
            className='resize-none border-slate-300 focus-visible:ring-blue-200'
            {...register("allergies")}
          />
          <FieldError error={errors.allergies?.message} id='allergies-error' />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='medicalConditions'>Medical Conditions</Label>
          <Textarea
            id='medicalConditions'
            rows={3}
            maxLength={500}
            placeholder='Share chronic conditions or active diagnoses'
            className='resize-none border-slate-300 focus-visible:ring-blue-200'
            {...register("medicalConditions")}
          />
          <FieldError error={errors.medicalConditions?.message} id='medicalConditions-error' />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='medications'>Current Medications</Label>
          <Textarea
            id='medications'
            rows={3}
            maxLength={500}
            placeholder='Include current medications and dosage notes'
            className='resize-none border-slate-300 focus-visible:ring-blue-200'
            {...register("medications")}
          />
          <FieldError error={errors.medications?.message} id='medications-error' />
        </div>

        <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
          <h3 className='text-sm font-semibold text-slate-900'>Emergency Contact (optional)</h3>
          <p className='mt-1 text-xs text-slate-600'>This helps us support urgent care coordination when needed.</p>

          <div className='mt-3 grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <Label htmlFor='emergencyContactName'>Contact Name</Label>
              <Input
                id='emergencyContactName'
                className='h-11 border-slate-300 focus-visible:ring-blue-200'
                placeholder='Full name'
                {...register("emergencyContactName")}
              />
              <FieldError
                error={errors.emergencyContactName?.message}
                id='emergencyContactName-error'
              />
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='emergencyContactPhone'>Contact Phone</Label>
              <PhoneInput
                defaultCountry='us'
                value={emergencyPhone}
                onChange={(value) => {
                  setEmergencyPhone(value);
                  setValue("emergencyContactPhone", value.replace(/\D/g, ""), {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                inputClassName='h-11 border-slate-300 pl-12 text-sm w-full'
                countrySelectorStyleProps={{
                  buttonClassName:
                    "h-11 border-slate-300 rounded-l-md hover:bg-slate-50 focus:outline-none",
                }}
                className='react-international-phone-input-custom'
              />
              <FieldError
                error={errors.emergencyContactPhone?.message}
                id='emergencyContactPhone-error'
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <Button
            type='button'
            variant='outline'
            className='h-11 gap-1 border-slate-300 text-slate-700 hover:bg-slate-100'
            onClick={() => router.push("/register/account")}
            disabled={isPending}
          >
            <ChevronLeft className='h-4 w-4' />
            Back
          </Button>

          <div className='flex flex-col gap-3 sm:flex-row'>
            <Button
              type='button'
              variant='ghost'
              className='h-11 text-slate-700 hover:bg-slate-100'
              onClick={() => submitRegistration()}
              disabled={isPending}
            >
              Skip for now and create account
            </Button>
            <Button type='submit' disabled={isPending} className='h-11 bg-blue-700 hover:bg-blue-800'>
              {isPending ? "Creating account..." : "Create account with medical info"}
            </Button>
          </div>
        </div>
      </form>

      <p className='flex items-center gap-2 text-xs text-slate-500'>
        <AlertCircle className='h-3.5 w-3.5 text-slate-400' />
        You can update these details later from your profile settings.
      </p>
    </div>
  );
}
