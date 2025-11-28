import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hook/use-toast";
import { useAuth } from "@/lib/auth-context";
import { MFAFormData, mfaSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

// Separate component for OTP Input to avoid hook issues
function OTPInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  const handleChange = (index: number, digit: string) => {
    if (!/^[0-9]?$/.test(digit)) return;

    const newVal = value.split("");
    newVal[index] = digit;
    onChange(newVal.join(""));

    if (digit && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (
      e.key === "Backspace" &&
      !value[index] &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className='flex gap-2 justify-center mt-2'>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            if (inputRefs.current) inputRefs.current[i] = el;
          }}
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className='
            w-12 h-14 text-center text-2xl font-semibold
            border rounded-lg bg-background
            focus:ring-2 focus:ring-primary focus:border-primary
          '
        />
      ))}
    </div>
  );
}

export function MFAForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { verifyMFA } = useAuth();
  const [loading, setLoading] = useState(false);

  const emailParam = searchParams.get("email");
  const email =
    emailParam ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("otp_email")
      : null) ||
    "";

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<MFAFormData>({
    resolver: zodResolver(mfaSchema),
  });

  const onSubmit = async (data: MFAFormData) => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email not found. Please start again.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const success = await verifyMFA(data.code);
      const fromParam = searchParams.get("from");
      const safeFrom =
        fromParam && fromParam.startsWith("/") && !fromParam.startsWith("//")
          ? fromParam
          : null;

      if (success) {
        toast({
          title: "Verification successful!",
          description: "You are authenticated.",
        });
        router.push(safeFrom || "/results");
      } else {
        toast({
          title: "Verification failed",
          description: "Invalid code. Try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to verify code.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='pt-6 space-y-4'>
          {email && (
            <div className='text-sm text-muted-foreground text-center'>
              Verification code sent to <strong>{email}</strong>
            </div>
          )}

          <div>
            <Label>Verification Code</Label>

            <OTPInput
              value={watch("code") || ""}
              onChange={(v) => setValue("code", v)}
            />

            {errors.code && (
              <p className='text-sm text-destructive mt-1'>
                {errors.code.message}
              </p>
            )}
          </div>

          <p className='text-sm text-muted-foreground text-center'>
            Enter the 6-digit code sent to your email
          </p>
        </CardContent>

        <CardFooter className='flex flex-col space-y-4'>
          <Button type='submit' disabled={loading || !email} className='w-full'>
            {loading ? "Verifying…" : "Verify Code"}
          </Button>

          <Button
            type='button'
            variant='ghost'
            className='w-full'
            onClick={() => {
              const fromParam = searchParams.get("from");
              const safeFrom =
                fromParam &&
                fromParam.startsWith("/") &&
                !fromParam.startsWith("//")
                  ? fromParam
                  : null;

              router.push(
                safeFrom
                  ? `/login?from=${encodeURIComponent(safeFrom)}`
                  : "/login"
              );
            }}
          >
            Back to Login
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
