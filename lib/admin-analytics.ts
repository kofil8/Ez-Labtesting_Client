// Utility functions for admin analytics

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  notifications: {
    email: boolean
    sms: boolean
  }
}

export interface Order {
  id: string
  userId: string
  tests: Array<{ testId: string; testName: string; price: number }>
  status: string
  subtotal: number
  totalAmount: number
  discount?: number
  promoCode?: string
  customerInfo?: CustomerInfo
  paymentMethod: string
  createdAt: string
  updatedAt?: string
  completedAt?: string
}

export interface Test {
  id: string
  name: string
  category: string
  price: number
  enabled: boolean
}

export interface PromoCode {
  id: string
  code: string
  usageCount: number
  usageLimit: number
  enabled: boolean
}

// Calculate revenue statistics
export function calculateRevenueStats(orders: Order[]) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const completedOrders = orders.filter(o => o.status === 'completed')
  const completedRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
  
  return {
    totalRevenue,
    completedRevenue,
    averageOrderValue,
    totalOrders: orders.length,
    completedOrders: completedOrders.length,
  }
}

// Get revenue by month
export function getRevenueByMonth(orders: Order[]) {
  const monthlyRevenue: Record<string, number> = {}
  
  orders.forEach(order => {
    const date = new Date(order.createdAt)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + order.totalAmount
  })
  
  return Object.entries(monthlyRevenue)
    .map(([month, revenue]) => ({
      month,
      revenue: Number(revenue.toFixed(2)),
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

// Get orders by status
export function getOrdersByStatus(orders: Order[]) {
  const statusCounts: Record<string, number> = {}
  
  orders.forEach(order => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
  })
  
  return Object.entries(statusCounts).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
  }))
}

// Get top selling tests
export function getTopSellingTests(orders: Order[], limit: number = 5) {
  const testCounts: Record<string, { name: string; count: number; revenue: number }> = {}
  
  orders.forEach(order => {
    order.tests.forEach(test => {
      if (!testCounts[test.testId]) {
        testCounts[test.testId] = {
          name: test.testName,
          count: 0,
          revenue: 0,
        }
      }
      testCounts[test.testId].count += 1
      testCounts[test.testId].revenue += test.price
    })
  })
  
  return Object.values(testCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

// Get revenue by payment method
export function getRevenueByPaymentMethod(orders: Order[]) {
  const paymentRevenue: Record<string, number> = {}
  
  orders.forEach(order => {
    const method = order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)
    paymentRevenue[method] = (paymentRevenue[method] || 0) + order.totalAmount
  })
  
  return Object.entries(paymentRevenue).map(([method, revenue]) => ({
    method,
    revenue: Number(revenue.toFixed(2)),
  }))
}

// Get test category distribution
export function getTestCategoryDistribution(tests: Test[]) {
  const categoryCounts: Record<string, number> = {}
  
  tests.forEach(test => {
    if (test.enabled) {
      categoryCounts[test.category] = (categoryCounts[test.category] || 0) + 1
    }
  })
  
  return Object.entries(categoryCounts).map(([category, count]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    count,
  }))
}

// Get promo code usage statistics
export function getPromoCodeStats(promoCodes: PromoCode[]) {
  const totalUsage = promoCodes.reduce((sum, code) => sum + code.usageCount, 0)
  const activeCodes = promoCodes.filter(code => code.enabled).length
  const totalLimit = promoCodes.reduce((sum, code) => sum + code.usageLimit, 0)
  
  return {
    totalUsage,
    activeCodes,
    totalLimit,
    usageRate: totalLimit > 0 ? (totalUsage / totalLimit) * 100 : 0,
  }
}

// Get recent orders
export function getRecentOrders(orders: Order[], limit: number = 5) {
  return [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

// Calculate growth percentage (mock for now)
export function calculateGrowth(current: number, previous: number = 0) {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

