'use client'

import { createContext, useContext, useState } from 'react'

interface CartSidebarContextType {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const CartSidebarContext = createContext<CartSidebarContextType | undefined>(
  undefined
)

export function CartSidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen(!isOpen)

  return (
    <CartSidebarContext.Provider value={{ isOpen, openCart, closeCart, toggleCart }}>
      {children}
    </CartSidebarContext.Provider>
  )
}

export function useCartSidebar() {
  const context = useContext(CartSidebarContext)
  if (context === undefined) {
    throw new Error('useCartSidebar must be used within CartSidebarProvider')
  }
  return context
}

