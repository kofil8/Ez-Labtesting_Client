'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { getUserOrders } from '@/lib/api'
import { Order } from '@/types/order'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'

export function ResultsList() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      // Use default user-1 if no user is logged in (for demo purposes)
      const userId = user?.id || 'user-1'
      const data = await getUserOrders(userId)
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case 'processing':
        return <Badge className="bg-blue-500"><Clock className="h-3 w-3 mr-1" />Processing</Badge>
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'cancelled':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6 text-center">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            Place your first order to see results here
          </p>
          <Button asChild>
            <Link href="/tests">Browse Tests</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Ordered on {formatDateShort(order.createdAt)}
                </p>
              </div>
              {getStatusBadge(order.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Tests */}
              <div>
                <h4 className="font-medium text-sm mb-2">Tests Ordered:</h4>
                <ul className="space-y-1">
                  {order.tests.map((test, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex justify-between">
                      <span>• {test.testName}</span>
                      <span>{formatCurrency(test.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total */}
              <div className="pt-2 border-t flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
              </div>

              {/* Action Button */}
              {order.status === 'completed' && (
                <Button asChild className="w-full">
                  <Link href={`/results/${order.id}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Results
                  </Link>
                </Button>
              )}
              {order.status === 'processing' && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Your sample is being processed. Results will be available soon.
                  </p>
                </div>
              )}
              {order.status === 'pending' && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Please visit a lab to provide your sample.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

