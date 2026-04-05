"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Apple, Coins, CreditCard, Smartphone } from "lucide-react";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
}

export type PaymentMethod = "card" | "google_pay" | "apple_pay" | "crypto";

export function PaymentMethodCard({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentMethodCardProps) {
  return (
    <RadioGroup
      value={paymentMethod}
      onValueChange={(value) => onPaymentMethodChange(value as PaymentMethod)}
      className='grid grid-cols-1 sm:grid-cols-2 gap-3'
    >
      <div
        className={`rounded-xl border p-4 transition-colors ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-gray-200 dark:border-gray-700"}`}
      >
        <div className='flex items-center gap-3'>
          <RadioGroupItem value='card' id='card' />
          <div className='flex items-center gap-2'>
            <CreditCard className='h-5 w-5 text-primary' />
            <Label htmlFor='card' className='font-semibold'>
              Card
            </Label>
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl border p-4 transition-colors ${paymentMethod === "google_pay" ? "border-primary bg-primary/5" : "border-gray-200 dark:border-gray-700"}`}
      >
        <div className='flex items-center gap-3'>
          <RadioGroupItem value='google_pay' id='google_pay' />
          <div className='flex items-center gap-2'>
            <Smartphone className='h-5 w-5 text-primary' />
            <Label htmlFor='google_pay' className='font-semibold'>
              Google Pay
            </Label>
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl border p-4 transition-colors ${paymentMethod === "apple_pay" ? "border-primary bg-primary/5" : "border-gray-200 dark:border-gray-700"}`}
      >
        <div className='flex items-center gap-3'>
          <RadioGroupItem value='apple_pay' id='apple_pay' />
          <div className='flex items-center gap-2'>
            <Apple className='h-5 w-5 text-primary' />
            <Label htmlFor='apple_pay' className='font-semibold'>
              Apple Pay
            </Label>
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl border p-4 transition-colors ${paymentMethod === "crypto" ? "border-primary bg-primary/5" : "border-gray-200 dark:border-gray-700"}`}
      >
        <div className='flex items-center gap-3'>
          <RadioGroupItem value='crypto' id='crypto' />
          <div className='flex items-center gap-2'>
            <Coins className='h-5 w-5 text-primary' />
            <Label htmlFor='crypto' className='font-semibold'>
              Crypto
            </Label>
          </div>
        </div>
      </div>
    </RadioGroup>
  );
}
