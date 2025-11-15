'use client'

import { useCartSidebar } from '@/lib/cart-sidebar-context'
import { CartSidebar } from './CartSidebar'
import { Suspense } from 'react'

function CartSidebarContent() {
  try {
    const { isOpen, closeCart } = useCartSidebar()
    return <CartSidebar isOpen={isOpen} onClose={closeCart} />
  } catch (error) {
    console.error('CartSidebarWrapper error:', error)
    return null
  }
}

export function CartSidebarWrapper() {
  return (
    <Suspense fallback={null}>
      <CartSidebarContent />
    </Suspense>
  )
}

