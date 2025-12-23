"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hook/use-toast";
import { createOrder } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  CheckoutFormData,
  checkoutSchema,
} from "@/lib/schemas/checkout-schema";
import { useCartStore } from "@/lib/store/cart-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MxMerchantPayment } from "./MxMerchantPayment";
import { OrderSummary } from "./OrderSummary";

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
  const [orderId, setOrderId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
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
  const processingFee = 2.5;
  const tax = 0;
  const finalTotal = total + processingFee + tax;

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const onSubmit = async (data: CheckoutFormData) => {
    // Generate order ID first for payment metadata
    const generatedOrderId = `order-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setOrderId(generatedOrderId);

    // Payment will be handled by MxMerchantPayment component
    // This form submission just validates the form data
    toast({
      title: "Form validated successfully",
      description: "Please complete payment to place your order.",
    });
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    setSubmitting(true);
    try {
      const formData = getValues();
      const order = await createOrder({
        id: orderId,
        userId: user?.id || "guest",
        tests: items,
        subtotal: subtotal,
        totalAmount: total + 2.5, // Include processing fee
        discount: discountAmount,
        promoCode: promoCode || undefined,
        transactionId,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          },
          notifications: {
            email: formData.emailNotifications,
            sms: formData.smsNotifications,
          },
        },
        paymentMethod: formData.paymentMethod,
      });

      clearCart();
      toast({
        title: "Payment successful!",
        description: `Order #${order.id} confirmed. Confirmation email sent.`,
      });
      router.push(`/results/${order.id}`);
    } catch (error: any) {
      toast({
        title: "Order creation failed",
        description:
          "Payment was successful but we couldn't create your order. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment failed",
      description: error || "Unable to process payment. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6'>
        {/* Main Form */}
        <div className='lg:col-span-2 space-y-4 lg:space-y-6'>
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-5'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <Label
                    htmlFor='firstName'
                    className='text-sm sm:text-base mb-2'
                  >
                    First Name *
                  </Label>
                  <Input
                    id='firstName'
                    autoComplete='given-name'
                    className='h-11 sm:h-10'
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor='lastName'
                    className='text-sm sm:text-base mb-2'
                  >
                    Last Name *
                  </Label>
                  <Input
                    id='lastName'
                    autoComplete='family-name'
                    className='h-11 sm:h-10'
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor='email' className='text-sm sm:text-base mb-2'>
                  Email *
                </Label>
                <Input
                  id='email'
                  type='email'
                  autoComplete='email'
                  inputMode='email'
                  className='h-11 sm:h-10'
                  {...register("email")}
                />
                {errors.email && (
                  <p className='text-sm text-destructive mt-1'>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='phone' className='text-sm sm:text-base mb-2'>
                    Phone (10 digits) *
                  </Label>
                  <Input
                    id='phone'
                    type='tel'
                    autoComplete='tel'
                    inputMode='tel'
                    className='h-11 sm:h-10'
                    {...register("phone")}
                    placeholder='(555) 123-4567'
                  />
                  {errors.phone && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor='dateOfBirth'
                    className='text-sm sm:text-base mb-2'
                  >
                    Date of Birth *
                  </Label>
                  <Input
                    id='dateOfBirth'
                    type='date'
                    className='h-11 sm:h-10'
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
            <CardContent className='space-y-5'>
              <div>
                <Label htmlFor='street' className='text-sm sm:text-base mb-2'>
                  Street Address *
                </Label>
                <Input
                  id='street'
                  autoComplete='street-address'
                  className='h-11 sm:h-10'
                  {...register("street")}
                />
                {errors.street && (
                  <p className='text-sm text-destructive mt-1'>
                    {errors.street.message}
                  </p>
                )}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='sm:col-span-1'>
                  <Label htmlFor='city' className='text-sm sm:text-base mb-2'>
                    City *
                  </Label>
                  <Input
                    id='city'
                    autoComplete='address-level2'
                    className='h-11 sm:h-10'
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor='state' className='text-sm sm:text-base mb-2'>
                    State *
                  </Label>
                  <Input
                    id='state'
                    autoComplete='address-level1'
                    className='h-11 sm:h-10 uppercase'
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
                  <Label
                    htmlFor='zipCode'
                    className='text-sm sm:text-base mb-2'
                  >
                    ZIP Code *
                  </Label>
                  <Input
                    id='zipCode'
                    type='text'
                    inputMode='numeric'
                    autoComplete='postal-code'
                    className='h-11 sm:h-10'
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
            <CardContent className='space-y-4'>
              <div
                className='flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer'
                onClick={() =>
                  setValue("emailNotifications", !watch("emailNotifications"))
                }
              >
                <Checkbox
                  id='emailNotifications'
                  checked={watch("emailNotifications")}
                  onCheckedChange={(checked) =>
                    setValue("emailNotifications", checked as boolean)
                  }
                  className='mt-0.5 h-5 w-5'
                />
                <Label
                  htmlFor='emailNotifications'
                  className='font-normal cursor-pointer leading-relaxed'
                >
                  Send me email notifications when results are ready
                </Label>
              </div>
              <div
                className='flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer'
                onClick={() =>
                  setValue("smsNotifications", !watch("smsNotifications"))
                }
              >
                <Checkbox
                  id='smsNotifications'
                  checked={watch("smsNotifications")}
                  onCheckedChange={(checked) =>
                    setValue("smsNotifications", checked as boolean)
                  }
                  className='mt-0.5 h-5 w-5'
                />
                <Label
                  htmlFor='smsNotifications'
                  className='font-normal cursor-pointer leading-relaxed'
                >
                  Send me SMS notifications for test updates
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Mx Merchant Hosted Form Branding & Security */}
              <div className='flex items-center gap-3 mb-2'>
                <img
                  src='/images/mx-merchant-logo.png'
                  alt='Mx Merchant'
                  className='h-8 w-auto'
                />
                <span className='text-xs font-semibold text-blue-700 dark:text-blue-300'>
                  Secure Payment by Mx Merchant
                </span>
              </div>
              <div className='rounded-lg border-2 border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-950/20 p-4'>
                {orderId ? (
                  <MxMerchantPayment
                    orderId={orderId}
                    amount={finalTotal}
                    tests={items.map((it) => ({
                      testId: it.testId,
                      testName: it.testName,
                      price: it.price,
                      cptCode: (it as any).cptCode,
                      labCode: (it as any).labCode,
                      labName: (it as any).labName,
                    }))}
                    customerInfo={{
                      firstName: getValues().firstName || "",
                      lastName: getValues().lastName || "",
                      email: getValues().email || "",
                      phone: getValues().phone || "",
                      dateOfBirth: getValues().dateOfBirth || "",
                      address: {
                        street: getValues().street || "",
                        city: getValues().city || "",
                        state: getValues().state || "",
                        zipCode: getValues().zipCode || "",
                      },
                    }}
                    promoCode={promoCode || undefined}
                    discount={discount}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                ) : (
                  <div className='p-4 text-sm text-muted-foreground'>
                    Review your information and click{" "}
                    <strong>Place Order</strong> to begin secure payment.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Consent */}
          <Card>
            <CardHeader>
              <CardTitle>Consent & Authorization</CardTitle>
            </CardHeader>
            <CardContent className='space-y-5'>
              <div
                className='flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer'
                onClick={() => setValue("hipaaConsent", !watch("hipaaConsent"))}
              >
                <Checkbox
                  id='hipaaConsent'
                  checked={watch("hipaaConsent")}
                  onCheckedChange={(checked) =>
                    setValue("hipaaConsent", checked as boolean)
                  }
                  className='mt-0.5 h-5 w-5'
                />
                <Label
                  htmlFor='hipaaConsent'
                  className='font-normal cursor-pointer leading-relaxed'
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
              <div
                className='flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer'
                onClick={() => setValue("termsConsent", !watch("termsConsent"))}
              >
                <Checkbox
                  id='termsConsent'
                  checked={watch("termsConsent")}
                  onCheckedChange={(checked) =>
                    setValue("termsConsent", checked as boolean)
                  }
                  className='mt-0.5 h-5 w-5'
                />
                <Label
                  htmlFor='termsConsent'
                  className='font-normal cursor-pointer leading-relaxed'
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
          <OrderSummary
            items={items}
            subtotal={subtotal}
            discount={discount}
            discountAmount={discountAmount}
            promoCode={promoCode}
            total={total}
          />

          {/* Submit Button Below Summary on Desktop */}
          <div className='mt-6 space-y-3'>
            <Button
              type='submit'
              disabled={submitting}
              className='w-full h-12 text-base font-semibold'
              size='lg'
            >
              {submitting ? (
                <>
                  <Loader2 className='h-5 w-5 mr-2 animate-spin' />
                  Processing Order...
                </>
              ) : (
                "Place Order"
              )}
            </Button>

            <p className='text-xs text-muted-foreground text-center leading-relaxed'>
              By placing this order, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
