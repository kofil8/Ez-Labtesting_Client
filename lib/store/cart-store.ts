import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  testId: string
  testName: string
  price: number
}

interface CartState {
  items: CartItem[]
  promoCode: string | null
  discount: number
  addItem: (item: CartItem) => void
  removeItem: (testId: string) => void
  clearCart: () => void
  setPromoCode: (code: string, discount: number) => void
  clearPromoCode: () => void
  getTotal: () => number
  getSubtotal: () => number
  getDiscount: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discount: 0,
      
      addItem: (item: CartItem) => {
        set((state) => {
          // Check if item already exists
          const exists = state.items.some(i => i.testId === item.testId)
          if (exists) {
            return state // Don't add duplicates
          }
          return { items: [...state.items, item] }
        })
      },
      
      removeItem: (testId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.testId !== testId)
        }))
      },
      
      clearCart: () => {
        set({ items: [], promoCode: null, discount: 0 })
      },
      
      setPromoCode: (code: string, discount: number) => {
        set({ promoCode: code, discount })
      },
      
      clearPromoCode: () => {
        set({ promoCode: null, discount: 0 })
      },
      
      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price, 0)
      },
      
      getDiscount: () => {
        const subtotal = get().getSubtotal()
        return subtotal * get().discount
      },
      
      getTotal: () => {
        const subtotal = get().getSubtotal()
        const discountAmount = subtotal * get().discount
        return subtotal - discountAmount
      },
      
      getItemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)

