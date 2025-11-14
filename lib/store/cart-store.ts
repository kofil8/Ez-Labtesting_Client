import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  testId: string
  testName: string
  price: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (testId: string) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
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
        set({ items: [] })
      },
      
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price, 0)
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

