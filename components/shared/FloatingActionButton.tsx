"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MessageCircle, Phone, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const itemCount = cartItems.length;

  const actions = [
    { icon: ShoppingCart, label: "Cart", href: "/cart", count: itemCount },
    { icon: MessageCircle, label: "Chat", href: "#chat" },
    { icon: Phone, label: "Call", href: "tel:+1234567890" },
    { icon: Mail, label: "Email", href: "mailto:support@kevinlab.com" },
  ];

  return (
    <div className='fixed bottom-6 right-6 z-50'>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className='absolute bottom-20 right-0 space-y-3'
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                {action.href.startsWith("/") ? (
                  <Link href={action.href}>
                    <Button
                      size='lg'
                      className='shadow-lg hover:shadow-xl transition-all gap-2 relative'
                      variant='secondary'
                    >
                      <action.icon className='h-5 w-5' />
                      {action.label}
                      {action.count !== undefined && action.count > 0 && (
                        <Badge className='ml-2 bg-red-500 text-white'>
                          {action.count}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                ) : (
                  <a href={action.href}>
                    <Button
                      size='lg'
                      className='shadow-lg hover:shadow-xl transition-all gap-2'
                      variant='secondary'
                    >
                      <action.icon className='h-5 w-5' />
                      {action.label}
                    </Button>
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          size='lg'
          onClick={() => setIsOpen(!isOpen)}
          className='h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 relative'
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <ShoppingCart className='h-6 w-6' />
            )}
          </motion.div>
          {!isOpen && itemCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className='absolute -top-1 -right-1'
            >
              <Badge className='bg-red-500 text-white h-6 w-6 rounded-full flex items-center justify-center p-0'>
                {itemCount}
              </Badge>
            </motion.div>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
