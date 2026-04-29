"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
} from "@/lib/services/notifications.api";
import { useNotificationsStore } from "@/lib/store/notifications-store";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

export function NotificationsBell({ className }: { className?: string }) {
  const { user } = useAuth();

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
  const [panelPosition, setPanelPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const [isMarkingAll, startMarkAllTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => {
    if (!hydrated || ownerUserId !== user?.id) return [];
    return notifications;
  }, [hydrated, notifications, ownerUserId, user?.id]);

  const unread = hydrated && ownerUserId === user?.id ? unreadCount : 0;

  const updatePanelPosition = () => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const viewportPadding = 12;

    setPanelPosition({
      top: rect.bottom + 8,
      right: Math.max(viewportPadding, window.innerWidth - rect.right),
    });
  };

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedBell = containerRef.current?.contains(target);
      const clickedPanel = panelRef.current?.contains(target);

      if (!clickedBell && !clickedPanel) {
        setOpen(false);
      }
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    if (!open) return;

    updatePanelPosition();
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);

    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [open]);

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markAsReadLocal(notification.id);
      void markNotificationRead(notification.id).catch((error) => {
        console.error("Failed to mark notification as read", error);
        toast.error("Failed to update notification status");
      });
    }

    setOpen(false);
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

  const notificationPanel =
    typeof document !== "undefined" && open
      ? createPortal(
          <AnimatePresence>
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              role='dialog'
              aria-label='Notifications'
              style={
                panelPosition
                  ? {
                      top: panelPosition.top,
                      right: panelPosition.right,
                    }
                  : undefined
              }
              className='fixed left-3 right-3 top-16 z-[9999] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 sm:left-auto sm:w-96'
            >
              <div className='flex items-center justify-between border-b border-slate-200 px-4 py-3'>
                <p className='text-sm font-semibold text-slate-950'>
                  Notifications
                </p>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-xs text-slate-600'
                  onClick={handleMarkAllRead}
                  disabled={items.length === 0 || unread === 0 || isMarkingAll}
                >
                  Mark all read
                </Button>
              </div>

              <div className='max-h-80 overflow-auto py-1'>
                {items.length === 0 ? (
                  <div className='px-4 py-8 text-center text-sm text-slate-500'>
                    No notifications yet
                  </div>
                ) : (
                  items.slice(0, 20).map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                        notification.isRead ? "opacity-70" : ""
                      }`}
                    >
                      <div className='flex items-center justify-between gap-3'>
                        <span className='min-w-0 truncate text-sm font-semibold text-slate-950'>
                          {notification.title}
                        </span>
                        <span className='shrink-0 text-[11px] text-slate-500'>
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {notification.body && (
                        <span className='line-clamp-2 text-sm text-slate-600'>
                          {notification.body}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
              <div className='border-t border-slate-200 px-4 py-3'>
                <Link
                  href='/dashboard/customer/notifications'
                  onClick={() => setOpen(false)}
                  className='inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600'
                >
                  View all notifications
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => setOpen((value) => !value)}
        className='group relative h-10 w-10 shrink-0 rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950 sm:h-11 sm:w-11'
        aria-label={
          unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
        }
      >
        <Bell className='h-5 w-5 transition-transform group-hover:scale-105' />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm'
            >
              {unread > 99 ? "99+" : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      {notificationPanel}
    </div>
  );
}
