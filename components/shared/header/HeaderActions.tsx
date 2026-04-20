"use client";

import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, X } from "lucide-react";
import { NotificationsBell } from "../../notifications/NotificationsBell";

interface HeaderActionsProps {
  cartCount: number;
  onCartClick: () => void;
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  isAuthenticated: boolean;
  showCart?: boolean;
}

export function HeaderActions({
  cartCount,
  onCartClick,
  onMenuToggle,
  isMobileMenuOpen,
  isAuthenticated,
  showCart = true,
}: HeaderActionsProps) {
  return (
    <div className='flex items-center gap-1 min-[600px]:gap-1.5'>
      {showCart && (
        <Button
          variant='ghost'
          size='icon'
          onClick={onCartClick}
          className='relative rounded-full text-muted-foreground hover:bg-muted hover:text-foreground'
          aria-label='Cart'
        >
          <ShoppingCart className='h-5 w-5' />
          {cartCount > 0 && (
            <span className='absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground'>
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Button>
      )}

      {isAuthenticated && <NotificationsBell />}

      <Button
        variant='ghost'
        size='icon'
        className='text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden'
        onClick={onMenuToggle}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <X className='h-6 w-6' />
        ) : (
          <Menu className='h-6 w-6' />
        )}
      </Button>
    </div>
  );
}
