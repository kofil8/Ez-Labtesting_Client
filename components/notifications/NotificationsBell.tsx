"use client";

import { Button } from "@/components/ui/button";
import { useNotificationsStore } from "@/lib/store/notifications-store";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function NotificationsBell() {
  const unread = useNotificationsStore((s) => s.getUnreadCount());
  const items = useNotificationsStore((s) => s.items);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const clearAll = useNotificationsStore((s) => s.clearAll);

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div ref={containerRef} className='relative'>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => setOpen((v) => !v)}
        className='relative hover:bg-primary/10 transition-colors group h-11 w-11 touch-manipulation'
        aria-label={
          unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
        }
      >
        <Bell className='h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform' />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className='absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-br from-red-600 to-pink-600 text-[10px] sm:text-xs text-white flex items-center justify-center font-bold shadow-lg'
            >
              {unread > 99 ? "99+" : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            role='dialog'
            aria-label='Notifications'
            className='absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border-2 border-blue-100 dark:border-cyan-900/40 bg-white dark:bg-gray-900 shadow-xl z-50'
          >
            <div className='flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-800'>
              <p className='text-sm font-bold'>Notifications</p>
              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-xs'
                  onClick={markAllRead}
                >
                  Mark all read
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-xs text-destructive'
                  onClick={clearAll}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className='max-h-80 overflow-auto py-1'>
              {items.length === 0 ? (
                <div className='px-4 py-8 text-center text-sm text-muted-foreground'>
                  No notifications yet
                </div>
              ) : (
                items.slice(0, 20).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`w-full text-left px-4 py-3 flex flex-col gap-1 hover:bg-muted transition-colors ${
                      n.read ? "opacity-70" : ""
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-semibold truncate'>
                        {n.title}
                      </span>
                      <span className='text-[11px] text-muted-foreground'>
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {n.body && (
                      <span className='text-sm text-muted-foreground line-clamp-2'>
                        {n.body}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
