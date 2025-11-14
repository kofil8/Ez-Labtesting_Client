export interface Order {
  id: string
  userId: string
  tests: OrderTest[]
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  totalAmount: number
  subtotal: number
  discount?: number
  promoCode?: string
  customerInfo: CustomerInfo
  paymentMethod: 'ach' | 'card'
  createdAt: string
  updatedAt?: string
  completedAt?: string
}

export interface OrderTest {
  testId: string
  testName: string
  price: number
}

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

