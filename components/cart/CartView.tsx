'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { validatePromoCode } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Trash2, ShoppingBag } from 'lucide-react'

export function CartView() {
  const router = useRouter()
  const { toast } = useToast()
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const getTotal = useCartStore((state) => state.getTotal)
  
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)
  const [validating, setValidating] = useState(false)

  const subtotal = getTotal()
  const discountAmount = subtotal * discount
  const total = subtotal - discountAmount

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return
    
    setValidating(true)
    try {
      const result = await validatePromoCode(promoCode)
      if (result.valid) {
        setDiscount(result.discount)
        setPromoApplied(true)
        toast({
          title: 'Promo code applied!',
          description: `You saved ${Math.round(result.discount * 100)}%`,
        })
      } else {
        toast({
          title: 'Invalid promo code',
          description: 'The promo code you entered is not valid.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to validate promo code.',
        variant: 'destructive',
      })
    } finally {
      setValidating(false)
    }
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some tests to your cart to get started
          </p>
          <Button asChild>
            <Link href="/tests">Browse Tests</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <Card key={item.testId}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{item.testName}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lab Test
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(item.price)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      removeItem(item.testId)
                      toast({
                        title: 'Removed from cart',
                        description: `${item.testName} has been removed.`,
                      })
                    }}
                    className="mt-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Promo Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Promo Code</label>
              <div className="flex gap-2">
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  disabled={promoApplied}
                />
                <Button
                  onClick={handleApplyPromo}
                  disabled={!promoCode.trim() || promoApplied || validating}
                  variant="secondary"
                >
                  {validating ? 'Checking...' : promoApplied ? 'Applied' : 'Apply'}
                </Button>
              </div>
              {promoApplied && (
                <p className="text-sm text-green-600">
                  ✓ Promo code applied
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({Math.round(discount * 100)}%)</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              onClick={() => router.push('/checkout')}
              className="w-full"
              size="lg"
            >
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full"
            >
              <Link href="/tests">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

