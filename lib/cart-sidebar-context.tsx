"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface CartSidebarContextType {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartSidebarContext = createContext<CartSidebarContextType | undefined>(
  undefined,
);

export function CartSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  const value = useMemo(
    () => ({ isOpen, openCart, closeCart, toggleCart }),
    [closeCart, isOpen, openCart, toggleCart],
  );

  return (
    <CartSidebarContext.Provider value={value}>
      {children}
    </CartSidebarContext.Provider>
  );
}

export function useCartSidebar() {
  const context = useContext(CartSidebarContext);
  if (context === undefined) {
    throw new Error("useCartSidebar must be used within CartSidebarProvider");
  }
  return context;
}

