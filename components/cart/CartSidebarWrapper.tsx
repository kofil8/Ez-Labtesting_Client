'use client'

import { useCartSidebar } from '@/lib/cart-sidebar-context'
import { CartSidebar } from './CartSidebar'
import { Suspense } from 'react'

function CartSidebarContent() {
  const { isOpen, closeCart } = useCartSidebar()

  return <CartSidebar isOpen={isOpen} onClose={closeCart} />
}

export function CartSidebarWrapper() {
  return (
    <Suspense fallback={null}>
      <CartSidebarContent />
    </Suspense>
  )
}

