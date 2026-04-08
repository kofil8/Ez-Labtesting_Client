"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
} from "@/lib/services/notifications.api";
import { useNotificationsStore } from "@/lib/store/notifications-store";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

export function NotificationsBell() {
  const { user } = useAuth();
  const router = useRouter();

  const hydrated = useNotificationsStore((state) => state.hydrated);
  const ownerUserId = useNotificationsStore((state) => state.ownerUserId);
  const notifications = useNotificationsStore((state) => state.notifications);
  const unreadCount = useNotificationsStore((state) => state.unreadCount);
  const markAsReadLocal = useNotificationsStore(
    (state) => state.markAsReadLocal,
  );
  const markAllAsReadLocal = useNotificationsStore(
    (state) => state.markAllAsReadLocal,
  );

  const [open, setOpen] = useState(false);
  const [isMarkingAll, startMarkAllTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => {
    if (!hydrated || ownerUserId !== user?.id) return [];
    return notifications;
  }, [hydrated, notifications, ownerUserId, user?.id]);

  const unread =
    hydrated && ownerUserId === user?.id ? unreadCount : 0;

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markAsReadLocal(notification.id);
      void markNotificationRead(notification.id).catch((error) => {
        console.error("Failed to mark notification as read", error);
        toast.error("Failed to update notification status");
      });
    }

    const clickAction = notification.data["clickAction"];
    if (typeof clickAction === "string" && clickAction.startsWith("/")) {
      setOpen(false);
      router.push(clickAction);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsReadLocal();
    startMarkAllTransition(() => {
      void markAllNotificationsRead().catch((error) => {
        console.error("Failed to mark all notifications as read", error);
        toast.error("Failed to update notifications");
      });
    });
  };

  return (
    <div ref={containerRef} className='relative'>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => setOpen((value) => !value)}
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
              <Button
                variant='ghost'
                size='sm'
                className='text-xs'
                onClick={handleMarkAllRead}
                disabled={items.length === 0 || unread === 0 || isMarkingAll}
              >
                Mark all read
              </Button>
            </div>

            <div className='max-h-80 overflow-auto py-1'>
              {items.length === 0 ? (
                <div className='px-4 py-8 text-center text-sm text-muted-foreground'>
                  No notifications yet
                </div>
              ) : (
                items.slice(0, 20).map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left px-4 py-3 flex flex-col gap-1 hover:bg-muted transition-colors ${
                      notification.isRead ? "opacity-70" : ""
                    }`}
                  >
                    <div className='flex items-center justify-between gap-3'>
                      <span className='text-sm font-semibold truncate'>
                        {notification.title}
                      </span>
                      <span className='text-[11px] text-muted-foreground shrink-0'>
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {notification.body && (
                      <span className='text-sm text-muted-foreground line-clamp-2'>
                        {notification.body}
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
