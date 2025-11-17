'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, CheckoutFormData } from '@/lib/schemas/checkout-schema'
import { useCartStore } from '@/lib/store/cart-store'
import { useAuth } from '@/lib/auth-context'
import { createOrder } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { formatCurrency } from '@/lib/utils'
import { PaymentMethodCard } from './PaymentMethodCard'
import { CheckoutProgress } from './CheckoutProgress'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, MapPin, Bell } from 'lucide-react'

const CHECKOUT_STEPS = ['Cart', 'Information', 'Payment', 'Confirm']

export function EnhancedCheckoutForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const getSubtotal = useCartStore((state) => state.getSubtotal)
  const getDiscount = useCartStore((state) => state.getDiscount)
  const promoCode = useCartStore((state) => state.promoCode)
  const discount = useCartStore((state) => state.discount)
  const clearCart = useCartStore((state) => state.clearCart)
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

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
      paymentMethod: 'card',
    },
  })

  const paymentMethod = watch('paymentMethod')
  const subtotal = getSubtotal()
  const discountAmount = getDiscount()
  const total = getTotal()

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitting(true)
    try {
      const order = await createOrder({
        userId: user?.id || 'guest',
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
      })

      clearCart()
      toast({
        title: 'Order placed successfully!',
        description: `Order #${order.id} has been created.`,
      })
      router.push('/payment-success')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process your order. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <CheckoutProgress currentStep={currentStep} steps={CHECKOUT_STEPS} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden border-2">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" {...register('firstName')} />
                      {errors.firstName && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" {...register('lastName')} />
                      {errors.lastName && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" {...register('email')} />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone (10 digits) *</Label>
                      <Input id="phone" {...register('phone')} placeholder="5551234567" />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                      {errors.dateOfBirth && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.dateOfBirth.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden border-2">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="street">Street Address *</Label>
                    <Input id="street" {...register('street')} />
                    {errors.street && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.street.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" {...register('city')} />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input id="state" {...register('state')} placeholder="CA" maxLength={2} />
                      {errors.state && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input id="zipCode" {...register('zipCode')} placeholder="90001" />
                      {errors.zipCode && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.zipCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="overflow-hidden border-2">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-purple-600" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emailNotifications"
                      checked={watch('emailNotifications')}
                      onCheckedChange={(checked) =>
                        setValue('emailNotifications', checked as boolean)
                      }
                    />
                    <Label htmlFor="emailNotifications" className="font-normal cursor-pointer">
                      Send me email notifications when results are ready
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smsNotifications"
                      checked={watch('smsNotifications')}
                      onCheckedChange={(checked) =>
                        setValue('smsNotifications', checked as boolean)
                      }
                    />
                    <Label htmlFor="smsNotifications" className="font-normal cursor-pointer">
                      Send me SMS notifications when results are ready
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <PaymentMethodCard
                paymentMethod={paymentMethod}
                onPaymentMethodChange={(method) => setValue('paymentMethod', method)}
              />
            </motion.div>

            {/* Consent */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Consent & Authorization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="hipaaConsent"
                      checked={watch('hipaaConsent')}
                      onCheckedChange={(checked) =>
                        setValue('hipaaConsent', checked as boolean)
                      }
                    />
                    <Label htmlFor="hipaaConsent" className="font-normal cursor-pointer leading-normal">
                      I authorize the release of my medical information as required for lab testing
                      and understand my rights under HIPAA. *
                    </Label>
                  </div>
                  {errors.hipaaConsent && (
                    <p className="text-sm text-destructive">
                      {errors.hipaaConsent.message}
                    </p>
                  )}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="termsConsent"
                      checked={watch('termsConsent')}
                      onCheckedChange={(checked) =>
                        setValue('termsConsent', checked as boolean)
                      }
                    />
                    <Label htmlFor="termsConsent" className="font-normal cursor-pointer leading-normal">
                      I agree to the Terms of Service and Privacy Policy. *
                    </Label>
                  </div>
                  {errors.termsConsent && (
                    <p className="text-sm text-destructive">
                      {errors.termsConsent.message}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-20 glass-strong border-2">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-purple-500/10">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.testId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-between text-sm p-3 bg-muted/50 rounded-lg"
                    >
                      <span className="text-muted-foreground line-clamp-1 font-medium">
                        {item.testName}
                      </span>
                      <span className="font-semibold">{formatCurrency(item.price)}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({promoCode})</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full gradient-primary hover-lift"
                  size="lg"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Place Order ${formatCurrency(total)}`
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By placing this order, you agree to our terms and conditions.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </form>
    </div>
  )
}

