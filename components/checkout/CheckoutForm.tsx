"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hook/use-toast";
import { createOrder } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  CheckoutFormData,
  checkoutSchema,
} from "@/lib/schemas/checkout-schema";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function CheckoutForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDiscount = useCartStore((state) => state.getDiscount);
  const promoCode = useCartStore((state) => state.promoCode);
  const discount = useCartStore((state) => state.discount);
  const clearCart = useCartStore((state) => state.clearCart);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      paymentMethod: "card",
    },
  });

  const paymentMethod = watch("paymentMethod");
  const subtotal = getSubtotal();
  const discountAmount = getDiscount();
  const total = getTotal();

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitting(true);
    try {
      const order = await createOrder({
        userId: user?.id || "guest",
        tests: items,
        subtotal: subtotal,
        totalAmount: total,
        discount: discountAmount,
        promoCode: promoCode || undefined,
        customerInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          address: {
            street: data.street,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
          },
          notifications: {
            email: data.emailNotifications,
            sms: data.smsNotifications,
          },
        },
        paymentMethod: data.paymentMethod,
      });

      clearCart();
      toast({
        title: "Order placed successfully!",
        description: `Order #${order.id} has been created.`,
      });
      router.push(`/results/${order.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Form */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='firstName'>First Name *</Label>
                  <Input id='firstName' {...register("firstName")} />
                  {errors.firstName && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor='lastName'>Last Name *</Label>
                  <Input id='lastName' {...register("lastName")} />
                  {errors.lastName && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor='email'>Email *</Label>
                <Input id='email' type='email' {...register("email")} />
                {errors.email && (
                  <p className='text-sm text-destructive mt-1'>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='phone'>Phone (10 digits) *</Label>
                  <Input
                    id='phone'
                    {...register("phone")}
                    placeholder='5551234567'
                  />
                  {errors.phone && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor='dateOfBirth'>Date of Birth *</Label>
                  <Input
                    id='dateOfBirth'
                    type='date'
                    {...register("dateOfBirth")}
                  />
                  {errors.dateOfBirth && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label htmlFor='street'>Street Address *</Label>
                <Input id='street' {...register("street")} />
                {errors.street && (
                  <p className='text-sm text-destructive mt-1'>
                    {errors.street.message}
                  </p>
                )}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='sm:col-span-1'>
                  <Label htmlFor='city'>City *</Label>
                  <Input id='city' {...register("city")} />
                  {errors.city && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor='state'>State *</Label>
                  <Input
                    id='state'
                    {...register("state")}
                    placeholder='CA'
                    maxLength={2}
                  />
                  {errors.state && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.state.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor='zipCode'>ZIP Code *</Label>
                  <Input
                    id='zipCode'
                    {...register("zipCode")}
                    placeholder='90001'
                  />
                  {errors.zipCode && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='emailNotifications'
                  checked={watch("emailNotifications")}
                  onCheckedChange={(checked) =>
                    setValue("emailNotifications", checked as boolean)
                  }
                />
                <Label
                  htmlFor='emailNotifications'
                  className='font-normal cursor-pointer'
                >
                  Send me email notifications when results are ready
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='smsNotifications'
                  checked={watch("smsNotifications")}
                  onCheckedChange={(checked) =>
                    setValue("smsNotifications", checked as boolean)
                  }
                />
                <Label
                  htmlFor='smsNotifications'
                  className='font-normal cursor-pointer'
                >
                  Send me SMS notifications when results are ready
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) =>
                  setValue("paymentMethod", value as "ach" | "card")
                }
              >
                <div className='flex items-center space-x-2 border rounded-lg p-4'>
                  <RadioGroupItem value='card' id='card' />
                  <Label
                    htmlFor='card'
                    className='flex-1 cursor-pointer font-normal'
                  >
                    <div className='font-semibold'>Credit/Debit Card</div>
                    <div className='text-sm text-muted-foreground'>
                      Pay securely with your card
                    </div>
                  </Label>
                </div>
                <div className='flex items-center space-x-2 border rounded-lg p-4'>
                  <RadioGroupItem value='ach' id='ach' />
                  <Label
                    htmlFor='ach'
                    className='flex-1 cursor-pointer font-normal'
                  >
                    <div className='font-semibold'>ACH Bank Transfer</div>
                    <div className='text-sm text-muted-foreground'>
                      Direct transfer from your bank account
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              {errors.paymentMethod && (
                <p className='text-sm text-destructive mt-2'>
                  {errors.paymentMethod.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Consent */}
          <Card>
            <CardHeader>
              <CardTitle>Consent & Authorization</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-start space-x-2'>
                <Checkbox
                  id='hipaaConsent'
                  checked={watch("hipaaConsent")}
                  onCheckedChange={(checked) =>
                    setValue("hipaaConsent", checked as boolean)
                  }
                />
                <Label
                  htmlFor='hipaaConsent'
                  className='font-normal cursor-pointer leading-normal'
                >
                  I authorize the release of my medical information as required
                  for lab testing and understand my rights under HIPAA. *
                </Label>
              </div>
              {errors.hipaaConsent && (
                <p className='text-sm text-destructive'>
                  {errors.hipaaConsent.message}
                </p>
              )}

              <div className='flex items-start space-x-2'>
                <Checkbox
                  id='termsConsent'
                  checked={watch("termsConsent")}
                  onCheckedChange={(checked) =>
                    setValue("termsConsent", checked as boolean)
                  }
                />
                <Label
                  htmlFor='termsConsent'
                  className='font-normal cursor-pointer leading-normal'
                >
                  I agree to the Terms of Service and Privacy Policy. *
                </Label>
              </div>
              {errors.termsConsent && (
                <p className='text-sm text-destructive'>
                  {errors.termsConsent.message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className='lg:col-span-1'>
          <Card className='sticky top-20'>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                {items.map((item) => (
                  <div
                    key={item.testId}
                    className='flex justify-between text-sm'
                  >
                    <span className='text-muted-foreground line-clamp-1'>
                      {item.testName}
                    </span>
                    <span>{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className='pt-4 border-t space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <>
                    <div className='flex justify-between text-sm text-green-600'>
                      <span>Discount ({promoCode})</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  </>
                )}
                <div className='flex justify-between text-lg font-semibold pt-2 border-t'>
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                type='submit'
                disabled={submitting}
                className='w-full'
                size='lg'
              >
                {submitting ? "Processing..." : "Place Order"}
              </Button>

              <p className='text-xs text-muted-foreground text-center'>
                By placing this order, you agree to our terms and conditions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
