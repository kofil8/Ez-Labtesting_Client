import { Test } from '@/types/test'
import { Order } from '@/types/order'
import { Result } from '@/types/result'
import { Panel } from '@/types/panel'
import { PromoCode } from '@/types/promo-code'
import { User } from '@/types/user'
import testsData from '@/data/tests.json'
import ordersData from '@/data/orders.json'
import resultsData from '@/data/results.json'
import panelsData from '@/data/panels.json'
import promoCodesData from '@/data/promo-codes.json'
import usersData from '@/data/users.json'

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

export async function getResultsByOrderId(orderId: string): Promise<Result[]> {
  await delay(300)
  const results = resultsData as Result[]
  return results.filter(result => result.orderId === orderId)
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
  const promoCode = (promoCodesData as PromoCode[]).find(
    pc => pc.code.toUpperCase() === code.toUpperCase() && pc.enabled
  )
  
  if (!promoCode) {
    return { valid: false, discount: 0 }
  }
  
  // Check if promo code is still valid
  const now = new Date()
  const validFrom = new Date(promoCode.validFrom)
  const validUntil = new Date(promoCode.validUntil)
  
  if (now < validFrom || now > validUntil) {
    return { valid: false, discount: 0 }
  }
  
  // Check usage limit
  if (promoCode.usageLimit && promoCode.usageCount && promoCode.usageCount >= promoCode.usageLimit) {
    return { valid: false, discount: 0 }
  }
  
  const discount = promoCode.discountType === 'percentage' 
    ? promoCode.discountValue / 100 
    : promoCode.discountValue
  
  return { valid: true, discount }
}

// Panel CRUD functions
export async function getAllPanels(): Promise<Panel[]> {
  await delay(300)
  return panelsData as Panel[]
}

export async function getPanelById(id: string): Promise<Panel | null> {
  await delay(200)
  const panels = panelsData as Panel[]
  return panels.find(panel => panel.id === id) || null
}

export async function createPanel(panelData: Partial<Panel>): Promise<Panel> {
  await delay(500)
  const newPanel: Panel = {
    id: `panel-${Date.now()}`,
    name: panelData.name || '',
    description: panelData.description || '',
    testIds: panelData.testIds || [],
    originalPrice: panelData.originalPrice || 0,
    bundlePrice: panelData.bundlePrice || 0,
    savings: panelData.savings || 0,
    enabled: panelData.enabled !== undefined ? panelData.enabled : true,
    ...panelData
  } as Panel
  
  return newPanel
}

export async function updatePanel(id: string, panelData: Partial<Panel>): Promise<Panel> {
  await delay(500)
  const panels = panelsData as Panel[]
  const existingPanel = panels.find(p => p.id === id)
  if (!existingPanel) {
    throw new Error('Panel not found')
  }
  
  return { ...existingPanel, ...panelData } as Panel
}

export async function deletePanel(id: string): Promise<void> {
  await delay(500)
  // In real app, would call API to delete
}

// PromoCode CRUD functions
export async function getAllPromoCodes(): Promise<PromoCode[]> {
  await delay(300)
  return promoCodesData as PromoCode[]
}

export async function getPromoCodeById(id: string): Promise<PromoCode | null> {
  await delay(200)
  const promoCodes = promoCodesData as PromoCode[]
  return promoCodes.find(pc => pc.id === id) || null
}

export async function createPromoCode(promoCodeData: Partial<PromoCode>): Promise<PromoCode> {
  await delay(500)
  const newPromoCode: PromoCode = {
    id: `promo-${Date.now()}`,
    code: promoCodeData.code || '',
    description: promoCodeData.description,
    discountType: promoCodeData.discountType || 'percentage',
    discountValue: promoCodeData.discountValue || 0,
    minPurchaseAmount: promoCodeData.minPurchaseAmount,
    maxDiscountAmount: promoCodeData.maxDiscountAmount,
    validFrom: promoCodeData.validFrom || new Date().toISOString(),
    validUntil: promoCodeData.validUntil || new Date().toISOString(),
    usageLimit: promoCodeData.usageLimit,
    usageCount: promoCodeData.usageCount || 0,
    enabled: promoCodeData.enabled !== undefined ? promoCodeData.enabled : true,
    applicableTo: promoCodeData.applicableTo || 'all',
    ...promoCodeData
  } as PromoCode
  
  return newPromoCode
}

export async function updatePromoCode(id: string, promoCodeData: Partial<PromoCode>): Promise<PromoCode> {
  await delay(500)
  const promoCodes = promoCodesData as PromoCode[]
  const existingPromoCode = promoCodes.find(pc => pc.id === id)
  if (!existingPromoCode) {
    throw new Error('Promo code not found')
  }
  
  return { ...existingPromoCode, ...promoCodeData } as PromoCode
}

export async function deletePromoCode(id: string): Promise<void> {
  await delay(500)
  // In real app, would call API to delete
}

// Test CRUD functions (enhanced)
export async function createTest(testData: Partial<Test>): Promise<Test> {
  await delay(500)
  const newTest: Test = {
    id: `test-${Date.now()}`,
    name: testData.name || '',
    description: testData.description || '',
    category: testData.category || 'general',
    price: testData.price || 0,
    cptCodes: testData.cptCodes || [],
    labCode: testData.labCode || '',
    labName: testData.labName || 'CPL',
    turnaroundDays: testData.turnaroundDays || 1,
    sampleType: testData.sampleType || 'Blood',
    preparation: testData.preparation,
    keywords: testData.keywords,
    enabled: testData.enabled !== undefined ? testData.enabled : true,
    ...testData
  } as Test
  
  return newTest
}

export async function updateTest(id: string, testData: Partial<Test>): Promise<Test> {
  await delay(500)
  const tests = testsData as Test[]
  const existingTest = tests.find(t => t.id === id)
  if (!existingTest) {
    throw new Error('Test not found')
  }
  
  return { ...existingTest, ...testData } as Test
}

export async function deleteTest(id: string): Promise<void> {
  await delay(500)
  // In real app, would call API to delete
}

// User CRUD functions
export async function getAllUsers(): Promise<User[]> {
  await delay(300)
  return usersData as User[]
}

export async function getUserById(id: string): Promise<User | null> {
  await delay(200)
  const users = usersData as User[]
  return users.find(user => user.id === id) || null
}

export async function createUser(userData: Partial<User>): Promise<User> {
  await delay(500)
  const newUser: User = {
    id: `user-${Date.now()}`,
    email: userData.email || '',
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    phone: userData.phone,
    dateOfBirth: userData.dateOfBirth,
    role: userData.role || 'customer',
    createdAt: new Date().toISOString(),
    mfaEnabled: userData.mfaEnabled || false,
    ...userData
  } as User
  
  return newUser
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
  await delay(500)
  const users = usersData as User[]
  const existingUser = users.find(u => u.id === id)
  if (!existingUser) {
    throw new Error('User not found')
  }
  
  return { ...existingUser, ...userData } as User
}

export async function deleteUser(id: string): Promise<void> {
  await delay(500)
  // In real app, would call API to delete
}

// Order Management functions
export async function getAllOrders(): Promise<Order[]> {
  await delay(300)
  return ordersData as Order[]
}

export async function updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
  await delay(500)
  const orders = ordersData as Order[]
  const existingOrder = orders.find(o => o.id === id)
  if (!existingOrder) {
    throw new Error('Order not found')
  }
  
  return { 
    ...existingOrder, 
    ...orderData,
    updatedAt: new Date().toISOString()
  } as Order
}

export async function deleteOrder(id: string): Promise<void> {
  await delay(500)
  // In real app, would call API to delete
}

