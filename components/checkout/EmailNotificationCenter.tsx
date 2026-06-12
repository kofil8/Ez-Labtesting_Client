"use client";

import { AlertCircle, Bell, CheckCircle2, Mail } from "lucide-react";
import { useEffect, useState } from "react";

interface EmailNotification {
  id: string;
  type: "status_update" | "support_reply" | "order_confirmation";
  subject: string;
  message: string;
  status?: string;
  timestamp: Date;
  read: boolean;
}

export default function EmailNotificationCenter() {
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // In a real app, this would be connected to a WebSocket or polling endpoint
  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem("emailNotifications");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(
          parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          })),
        );
      } catch {
        // Invalid JSON
      }
    }
  }, []);

  // Simulate receiving notifications (would be from real API in production)
  useEffect(() => {
    const handleNotification = (event: CustomEvent) => {
      const newNotif: EmailNotification = {
        id: `notif-${Date.now()}`,
        type: event.detail.type,
        subject: event.detail.subject,
        message: event.detail.message,
        status: event.detail.status,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => {
        const updated = [newNotif, ...prev];
        localStorage.setItem("emailNotifications", JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener("labOrderNotification" as any, handleNotification);
    return () =>
      window.removeEventListener(
        "labOrderNotification" as any,
        handleNotification,
      );
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!notifications.length) return null;

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='relative p-3 bg-white dark:bg-slate-900 rounded-full shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700 transition'
      >
        <Bell className='h-6 w-6 text-slate-700 dark:text-slate-300' />
        {unreadCount > 0 && (
          <span className='absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isExpanded && (
        <div className='absolute bottom-16 right-0 w-96 max-h-96 overflow-y-auto bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700'>
          <div className='sticky top-0 bg-slate-50 dark:bg-slate-800 p-4 border-b'>
            <h3 className='font-semibold flex items-center gap-2'>
              <Mail className='h-4 w-4' />
              Email Notifications
            </h3>
          </div>

          <div className='divide-y'>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                  !notif.read ? "bg-blue-50 dark:bg-blue-950/20" : ""
                }`}
              >
                <div className='flex gap-3'>
                  <div className='flex-shrink-0 mt-1'>
                    {notif.type === "status_update" ? (
                      <CheckCircle2 className='h-5 w-5 text-green-600' />
                    ) : notif.type === "support_reply" ? (
                      <AlertCircle className='h-5 w-5 text-blue-600' />
                    ) : (
                      <CheckCircle2 className='h-5 w-5 text-blue-600' />
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium text-sm'>{notif.subject}</p>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {notif.message}
                    </p>
                    {notif.status && (
                      <p className='text-xs font-semibold mt-2 text-green-600 dark:text-green-400'>
                        Status: {notif.status}
                      </p>
                    )}
                    <p className='text-xs text-muted-foreground mt-2'>
                      {notif.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='p-3 border-t text-xs text-center text-muted-foreground bg-slate-50 dark:bg-slate-800'>
            Showing {notifications.length} notifications
          </div>
        </div>
      )}
    </div>
  );
}

// Utility to emit notifications (called from backend webhooks or polling)
export function emitLabOrderNotification(data: {
  type: "status_update" | "support_reply" | "order_confirmation";
  subject: string;
  message: string;
  status?: string;
}) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("labOrderNotification", { detail: data }),
    );
  }
}
