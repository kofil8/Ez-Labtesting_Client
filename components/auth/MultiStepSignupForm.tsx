"use client";

import { registerUser } from "@/app/actions/register-user";
import { FormStateMessage } from "@/components/auth/FormStateMessage";
import { Button } from "@/components/ui/button";
import { SignupFormData, signupSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AccountInfoStep } from "./signup-steps/AccountInfoStep";
import { MedicalInfoStep } from "./signup-steps/MedicalInfoStep";

const STEPS = [
  { id: 1, name: "Account Info", description: "Basic information" },
  { id: 2, name: "Medical Info", description: "Health details (optional)" },
];

export function MultiStepSignupForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const {
    handleSubmit,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = form;

  // Watch all form values to check if step 1 is complete
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const email = watch("email");
  const phone = watch("phone");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Check if step 1 fields are filled and valid
  const isStep1Complete =
    firstName &&
    lastName &&
    email &&
    phone &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    !errors.firstName &&
    !errors.lastName &&
    !errors.email &&
    !errors.phone &&
    !errors.password &&
    !errors.confirmPassword;

  // Step 1 → Step 2 navigation (no submission)
  const handleNextStep = async () => {
    if (currentStep !== 1) return;

    const fieldsToValidate: (keyof SignupFormData)[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "password",
      "confirmPassword",
    ];

    const isValidStep1 = await trigger(fieldsToValidate);

    if (isValidStep1) {
      setError("");
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) return;
    setCurrentStep(currentStep - 1);
    setError("");
  };

  // Final submit from step 2 (Create or Skip)
  const handleFinalSubmit = () => {
    if (currentStep !== 2) return; // hard guard
    const data = getValues();
    handleSubmit(onSubmit)();
  };

  const handleSkipMedical = () => {
    if (currentStep !== 2) return;
    handleFinalSubmit();
  };

  const handleAction = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      try {
        const res = await registerUser(formData);
        if (res?.success) {
          toast.success(
            "Account created! Please verify your email to activate your account.",
          );
          const email = res.email || (formData.get("email") as string);
          // Store email in sessionStorage for OTP verification
          if (typeof window !== "undefined") {
            sessionStorage.setItem("otp_email", email);
          }
          setTimeout(() => {
            router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
          }, 1000);
        }
      } catch (err: any) {
        const errorMessage =
          err.message ||
          "Unable to create your account. Your information is secure. Please verify your details and try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  const onSubmit = async (data: SignupFormData) => {
    // Prevent submission if not on final step
    if (currentStep !== 2) {
      console.log(
        "[BLOCKED] Form submission prevented - not on final step. Current step:",
        currentStep,
      );
      return;
    }

    console.log("[SUBMIT] Creating account from step", currentStep);

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.phone) {
      formData.append("phoneNumber", data.phone);
    }
    // Add optional fields if provided
    if (data.gender) formData.append("gender", data.gender);
    if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth);
    if (data.address) formData.append("address", data.address);
    if (data.bloodType) formData.append("bloodType", data.bloodType);
    if (data.allergies) formData.append("allergies", data.allergies);
    if (data.medicalConditions)
      formData.append("medicalConditions", data.medicalConditions);
    if (data.medications) formData.append("medications", data.medications);
    if (data.emergencyContactName)
      formData.append("emergencyContactName", data.emergencyContactName);
    if (data.emergencyContactPhone)
      formData.append("emergencyContactPhone", data.emergencyContactPhone);

    handleAction(formData);
  };

  // Prevent form submission on Enter key when not on final step
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (currentStep === 1 && isStep1Complete) {
        handleNextStep();
      }
      return false;
    }
  };

  return (
    <div className='w-full'>
      {/* Progress Steps */}
      <div className='mb-3 md:mb-4 animate-in fade-in duration-500'>
        <div className='flex items-center justify-between'>
          {STEPS.map((step, index) => (
            <div key={step.id} className='flex items-center flex-1'>
              <div className='flex flex-col items-center flex-1'>
                <div
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    currentStep > step.id
                      ? "bg-green-600 border-green-600 shadow-md shadow-green-200"
                      : currentStep === step.id
                        ? "bg-blue-600 border-blue-600 ring-4 ring-blue-100 shadow-lg"
                        : "bg-white border-gray-300"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className='w-3.5 h-3.5 md:w-4 md:h-4 text-white animate-in zoom-in duration-300' />
                  ) : (
                    <span
                      className={`text-xs font-bold ${
                        currentStep === step.id ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                </div>
                <div className='mt-1 md:mt-1.5 text-center'>
                  <p
                    className={`text-xs font-semibold transition-colors duration-200 ${
                      currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.name}
                  </p>
                  <p className='text-xs text-gray-500 hidden sm:block'>
                    {step.description}
                  </p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${
                    currentStep > step.id ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className='mb-3 md:mb-3.5'>
          <FormStateMessage
            type='error'
            message='Account Creation Failed'
            details={error}
            onDismiss={() => setError("")}
          />
        </div>
      )}

      {/* Form Content */}
      <form
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={handleKeyDown}
        className='space-y-3 md:space-y-4'
      >
        <div className='animate-in fade-in duration-300'>
          {currentStep === 1 && <AccountInfoStep form={form} error={error} />}
          {currentStep === 2 && <MedicalInfoStep form={form} error={error} />}
        </div>

        {/* Navigation Buttons */}
        <div className='flex items-center justify-between pt-3 md:pt-4 border-t border-gray-200'>
          {currentStep > 1 ? (
            <Button
              type='button'
              variant='outline'
              onClick={handleBack}
              disabled={isPending}
              className='gap-1.5 hover:bg-gray-50 transition-colors h-9 md:h-10 text-sm'
            >
              <ChevronLeft className='w-3.5 h-3.5 md:w-4 md:h-4' />
              Back
            </Button>
          ) : (
            <div />
          )}

          <div className='flex gap-2'>
            {currentStep === 2 && (
              <Button
                type='button'
                variant='ghost'
                onClick={handleSkipMedical}
                disabled={isPending}
                className='text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors h-9 md:h-10 text-xs md:text-sm px-3'
              >
                Skip for now
              </Button>
            )}

            {currentStep < STEPS.length ? (
              <Button
                type='button'
                onClick={handleNextStep}
                disabled={isPending || !isStep1Complete}
                className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 min-w-[90px] md:min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 h-9 md:h-10 text-xs md:text-sm px-4'
              >
                Next
              </Button>
            ) : (
              <Button
                type='button'
                onClick={handleFinalSubmit}
                disabled={isPending}
                className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 min-w-[110px] md:min-w-[130px] shadow-lg hover:shadow-xl transition-all duration-200 button-loading h-9 md:h-10 text-xs md:text-sm px-4'
              >
                {isPending ? "Creating..." : "Create Account"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
