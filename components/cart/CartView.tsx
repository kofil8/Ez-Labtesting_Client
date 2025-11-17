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
  const getSubtotal = useCartStore((state) => state.getSubtotal)
  const getDiscount = useCartStore((state) => state.getDiscount)
  const appliedPromoCode = useCartStore((state) => state.promoCode)
  const storeDiscount = useCartStore((state) => state.discount)
  const setStorePromoCode = useCartStore((state) => state.setPromoCode)
  const clearPromoCode = useCartStore((state) => state.clearPromoCode)
  
  const [promoCodeInput, setPromoCodeInput] = useState('')
  const [validating, setValidating] = useState(false)

  const subtotal = getSubtotal()
  const discountAmount = getDiscount()
  const total = getTotal()

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return
    
    setValidating(true)
    try {
      const result = await validatePromoCode(promoCodeInput)
      if (result.valid) {
        setStorePromoCode(promoCodeInput.toUpperCase(), result.discount)
        setPromoCodeInput('')
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

  const handleRemovePromo = () => {
    clearPromoCode()
    toast({
      title: 'Promo code removed',
      description: 'The discount has been removed from your order.',
    })
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
              {appliedPromoCode ? (
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-600">
                      ✓ {appliedPromoCode} Applied
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(storeDiscount * 100)}% discount
                    </p>
                  </div>
                  <Button
                    onClick={handleRemovePromo}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Input
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      disabled={validating}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyPromo()
                        }
                      }}
                    />
                    <Button
                      onClick={handleApplyPromo}
                      disabled={!promoCodeInput.trim() || validating}
                      variant="secondary"
                    >
                      {validating ? 'Checking...' : 'Apply'}
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {storeDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({Math.round(storeDiscount * 100)}%)</span>
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

