"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
} from "@/lib/services/notifications.api";
import { useNotificationsStore } from "@/lib/store/notifications-store";
import { cn } from "@/lib/utils";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  ExternalLink,
  Inbox,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { EmptyState } from "./EmptyState";

type NotificationFilter = "all" | "unread" | "read";

function formatNotificationDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function getClickAction(notification: NotificationItem) {
  const clickAction = notification.data["clickAction"];
  return typeof clickAction === "string" && clickAction.startsWith("/")
    ? clickAction
    : null;
}

function getNotificationTypeLabel(type: string) {
  return type.replace(/_/g, " ").toLowerCase();
}

export function CustomerNotificationsPage() {
  const { user } = useAuth();
  const notifications = useNotificationsStore((state) => state.notifications);
  const unreadCount = useNotificationsStore((state) => state.unreadCount);
  const ownerUserId = useNotificationsStore((state) => state.ownerUserId);
  const setNotifications = useNotificationsStore(
    (state) => state.setNotifications,
  );
  const markAsReadLocal = useNotificationsStore(
    (state) => state.markAsReadLocal,
  );
  const markAllAsReadLocal = useNotificationsStore(
    (state) => state.markAllAsReadLocal,
  );

  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMarkingAll, startMarkAllTransition] = useTransition();

  const scopedNotifications = useMemo(() => {
    if (ownerUserId && user?.id && ownerUserId !== user.id) {
      return [];
    }

    return notifications;
  }, [notifications, ownerUserId, user?.id]);

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return scopedNotifications.filter((notification) => !notification.isRead);
    }

    if (filter === "read") {
      return scopedNotifications.filter((notification) => notification.isRead);
    }

    return scopedNotifications;
  }, [filter, scopedNotifications]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await fetchNotifications({ page: 1, limit: 100 });
      setNotifications(result.data, user?.id);
      toast.success("Notifications refreshed");
    } catch (error) {
      console.error("Failed to refresh notifications", error);
      toast.error("Unable to refresh notifications");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMarkRead = (notification: NotificationItem) => {
    if (notification.isRead) {
      return;
    }

    markAsReadLocal(notification.id);
    void markNotificationRead(notification.id).catch((error) => {
      console.error("Failed to mark notification as read", error);
      toast.error("Failed to update notification");
    });
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

  const filterButton = (
    key: NotificationFilter,
    label: string,
    count: number,
  ) => (
    <button
      key={key}
      type='button'
      onClick={() => setFilter(key)}
      className={cn(
        "shrink-0 rounded-full border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600",
        filter === key
          ? "border-blue-200 bg-blue-50 text-blue-800"
          : "border-blue-100 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700",
      )}
    >
      {label} ({count})
    </button>
  );

  return (
    <div className='space-y-6'>
      <section className='rounded-2xl border border-blue-100 bg-white p-4 shadow-lg shadow-blue-100/25 sm:p-6'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='min-w-0'>
            <p className='text-sm font-medium text-blue-600'>
              Customer portal
            </p>
            <h1 className='mt-2 break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl'>
              Notifications
            </h1>
            <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-600'>
              Review order updates, account alerts, and result availability in
              one secure place.
            </p>
          </div>

          <div className='flex flex-col gap-3 sm:flex-row lg:shrink-0'>
            <Button
              type='button'
              variant='outline'
              onClick={handleRefresh}
              disabled={isRefreshing}
              className='w-full sm:w-auto'
            >
              <RefreshCw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
              Refresh
            </Button>
            <Button
              type='button'
              onClick={handleMarkAllRead}
              disabled={
                scopedNotifications.length === 0 ||
                unreadCount === 0 ||
                isMarkingAll
              }
              className='w-full bg-blue-600 hover:bg-blue-700 sm:w-auto'
            >
              <CheckCheck className='h-4 w-4' />
              Mark all read
            </Button>
          </div>
        </div>
      </section>

      <section className='rounded-2xl border border-blue-100 bg-white p-4 shadow-lg shadow-blue-100/25 sm:p-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex min-w-0 items-center gap-3'>
            <span className='flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600'>
              <Bell className='h-5 w-5' />
            </span>
            <div className='min-w-0'>
              <h2 className='text-lg font-semibold text-slate-950'>
                Notification Center
              </h2>
              <p className='text-sm text-slate-600'>
                {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className='-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0'>
            {filterButton("all", "All", scopedNotifications.length)}
            {filterButton("unread", "Unread", unreadCount)}
            {filterButton(
              "read",
              "Read",
              scopedNotifications.filter((notification) => notification.isRead)
                .length,
            )}
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className='mt-6'>
            <EmptyState
              icon={Inbox}
              title='No notifications found'
              description={
                filter === "all"
                  ? "Order updates and account alerts will appear here when available."
                  : "There are no notifications in this view."
              }
            />
          </div>
        ) : (
          <div className='mt-6 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200'>
            {filteredNotifications.map((notification) => {
              const clickAction = getClickAction(notification);

              return (
                <article
                  key={notification.id}
                  className={cn(
                    "bg-white p-4 sm:p-5",
                    !notification.isRead && "bg-blue-50/50",
                  )}
                >
                  <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                    <div className='min-w-0 flex-1'>
                      <div className='flex flex-wrap items-center gap-2'>
                        {!notification.isRead ? (
                          <span className='rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white'>
                            New
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600'>
                            <CheckCircle2 className='h-3 w-3' />
                            Read
                          </span>
                        )}
                        <span className='rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold capitalize text-slate-600'>
                          {getNotificationTypeLabel(notification.type)}
                        </span>
                        {notification.priority ? (
                          <span className='rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold capitalize text-amber-800'>
                            {notification.priority.toLowerCase()}
                          </span>
                        ) : null}
                      </div>

                      <h3 className='mt-3 break-words text-base font-semibold text-slate-950'>
                        {notification.title}
                      </h3>
                      {notification.body ? (
                        <p className='mt-2 break-words text-sm leading-6 text-slate-600'>
                          {notification.body}
                        </p>
                      ) : null}

                      <dl className='mt-4 grid gap-3 text-sm sm:grid-cols-2'>
                        <div>
                          <dt className='font-medium text-slate-500'>Received</dt>
                          <dd className='mt-1 text-slate-900'>
                            {formatNotificationDate(notification.createdAt)}
                          </dd>
                        </div>
                        <div>
                          <dt className='font-medium text-slate-500'>Read</dt>
                          <dd className='mt-1 text-slate-900'>
                            {notification.readAt
                              ? formatNotificationDate(notification.readAt)
                              : "Not read yet"}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className='flex flex-col gap-2 sm:flex-row lg:flex-col lg:shrink-0'>
                      {!notification.isRead ? (
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => handleMarkRead(notification)}
                          className='w-full sm:w-auto lg:w-full'
                        >
                          Mark read
                        </Button>
                      ) : null}
                      {clickAction ? (
                        <Button
                          asChild
                          size='sm'
                          className='w-full bg-blue-600 hover:bg-blue-700 sm:w-auto lg:w-full'
                        >
                          <Link href={clickAction}>
                            Open
                            <ExternalLink className='h-4 w-4' />
                          </Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
