import { Test } from '@/types/test'
import { Order } from '@/types/order'
import { Result } from '@/types/result'
import testsData from '@/data/tests.json'
import ordersData from '@/data/orders.json'
import resultsData from '@/data/results.json'

// Mock API functions that simulate async data fetching
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function getAllTests(): Promise<Test[]> {
  await delay(300)
  return testsData as Test[]
}

export async function getTestById(id: string): Promise<Test | null> {
  await delay(200)
  const tests = testsData as Test[]
  return tests.find(test => test.id === id) || null
}

export async function searchTests(query: string, category?: string, sortBy?: string): Promise<Test[]> {
  await delay(300)
  let tests = testsData as Test[]
  
  // Filter by search query
  if (query) {
    const lowerQuery = query.toLowerCase()
    tests = tests.filter(test => 
      test.name.toLowerCase().includes(lowerQuery) ||
      test.description.toLowerCase().includes(lowerQuery) ||
      test.keywords?.some(k => k.toLowerCase().includes(lowerQuery))
    )
  }
  
  // Filter by category
  if (category && category !== 'all') {
    tests = tests.filter(test => test.category === category)
  }
  
  // Sort
  if (sortBy === 'price-asc') {
    tests.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-desc') {
    tests.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'turnaround') {
    tests.sort((a, b) => a.turnaroundDays - b.turnaroundDays)
  }
  
  return tests
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  await delay(300)
  const orders = ordersData as Order[]
  return orders.filter(order => order.userId === userId)
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  await delay(200)
  const orders = ordersData as Order[]
  return orders.find(order => order.id === orderId) || null
}

export async function getResultByOrderId(orderId: string): Promise<Result | null> {
  await delay(300)
  const results = resultsData as Result[]
  return results.find(result => result.orderId === orderId) || null
}

export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  await delay(500)
  const newOrder: Order = {
    id: `order-${Date.now()}`,
    userId: orderData.userId || 'user-1',
    tests: orderData.tests || [],
    status: 'pending',
    totalAmount: orderData.totalAmount || 0,
    createdAt: new Date().toISOString(),
    ...orderData
  } as Order
  
  return newOrder
}

export async function validatePromoCode(code: string): Promise<{ valid: boolean; discount: number }> {
  await delay(400)
  const validCodes: Record<string, number> = {
    'SAVE10': 0.10,
    'WELCOME20': 0.20,
    'HEALTH25': 0.25,
  }
  
  const discount = validCodes[code.toUpperCase()] || 0
  return { valid: discount > 0, discount }
}

