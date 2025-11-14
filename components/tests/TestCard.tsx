'use client'

import Link from 'next/link'
import { Test } from '@/types/test'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart-store'
import { useToast } from '@/hooks/use-toast'
import { ShoppingCart, Clock } from 'lucide-react'

interface TestCardProps {
  test: Test
}

export function TestCard({ test }: TestCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      testId: test.id,
      testName: test.name,
      price: test.price,
    })
    toast({
      title: 'Added to cart',
      description: `${test.name} has been added to your cart.`,
    })
  }

  return (
    <Link href={`/tests/${test.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-2">{test.name}</CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {formatCurrency(test.price)}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {test.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span>{test.turnaroundDays} {test.turnaroundDays === 1 ? 'day' : 'days'} turnaround</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <span className="mr-2">🏥</span>
              <span>Provided by {test.labName}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <span className="mr-2">💉</span>
              <span>{test.sampleType}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAddToCart}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

