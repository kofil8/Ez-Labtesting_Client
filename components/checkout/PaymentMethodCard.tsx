'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard, Building2, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

interface PaymentMethodCardProps {
  paymentMethod: 'card' | 'ach'
  onPaymentMethodChange: (method: 'card' | 'ach') => void
}

export function PaymentMethodCard({ paymentMethod, onPaymentMethodChange }: PaymentMethodCardProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const chunks = cleaned.match(/.{1,4}/g) || []
    return chunks.join(' ').slice(0, 19)
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\//g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Secure Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <RadioGroup value={paymentMethod} onValueChange={(value) => onPaymentMethodChange(value as 'ach' | 'card')}>
          <div className="space-y-4">
            {/* Credit Card Option */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onPaymentMethodChange('card')}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="card" id="card" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer font-semibold">
                    <CreditCard className="h-5 w-5" />
                    Credit or Debit Card
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Secure payment via Visa, Mastercard, Amex, or Discover
                  </p>
                  
                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4"
                    >
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="pl-10"
                          />
                          <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="123"
                            maxLength={4}
                            type="password"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cardName">Name on Card *</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <Lock className="h-4 w-4 text-blue-600" />
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Your payment information is encrypted and secure
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ACH Bank Transfer Option */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                paymentMethod === 'ach' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onPaymentMethodChange('ach')}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="ach" id="ach" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="ach" className="flex items-center gap-2 cursor-pointer font-semibold">
                    <Building2 className="h-5 w-5" />
                    ACH Bank Transfer
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Direct transfer from your bank account
                  </p>
                  
                  {paymentMethod === 'ach' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4"
                    >
                      <div>
                        <Label htmlFor="accountType">Account Type *</Label>
                        <Select defaultValue="checking">
                          <SelectTrigger id="accountType">
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="checking">Checking</SelectItem>
                            <SelectItem value="savings">Savings</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="routingNumber">Routing Number *</Label>
                        <Input
                          id="routingNumber"
                          placeholder="123456789"
                          maxLength={9}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="accountNumber">Account Number *</Label>
                        <Input
                          id="accountNumber"
                          placeholder="1234567890"
                          type="password"
                        />
                      </div>

                      <div>
                        <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                        <Input
                          id="accountHolderName"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <Lock className="h-4 w-4 text-green-600" />
                        <p className="text-xs text-green-700 dark:text-green-300">
                          ACH transfers are processed securely through your bank
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

