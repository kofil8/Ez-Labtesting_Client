"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { ProfileUpdateFormData, profileUpdateSchema } from "@/lib/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function ProfileForm() {
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileUpdateFormData) => {
    setLoading(true);
    try {
      const result = await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
      });

      if (result) {
        toast({
          title: "Success",
          description: "Your profile has been updated.",
        });
      } else {
        toast({
          title: "Error",
          description: "Could not update profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your profile information and personal details.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              disabled
              {...register("email")}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Email cannot be changed. Contact support if you need to update it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="phone" className="text-sm sm:text-base">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="1234567890"
                {...register("phone")}
                className="text-sm sm:text-base"
              />
              {errors.phone && (
                <p className="text-xs sm:text-sm text-destructive mt-1">
                  {errors.phone.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                Format: 10 digits
              </p>
            </div>

            <div>
              <Label htmlFor="dateOfBirth" className="text-sm sm:text-base">Date of birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                className="text-sm sm:text-base"
              />
              {errors.dateOfBirth && (
                <p className="text-xs sm:text-sm text-destructive mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 sm:p-6">
          <Button type="submit" disabled={loading} className="w-full text-sm sm:text-base">
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

