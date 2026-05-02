"use client";

import { getOrdersByUserId, type UserOrderSummary } from "@/lib/services/order.service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type PrefetchRouter = {
  prefetch: (href: string) => void;
};

type OrdersCacheEntry = {
  data?: UserOrderSummary[];
  expiresAt: number;
  promise?: Promise<UserOrderSummary[]>;
};

const ORDERS_CACHE_TTL_MS = 30_000;
const ordersCache = new Map<string, OrdersCacheEntry>();
const prefetchedRoutes = new Set<string>();

function now() {
  return Date.now();
}

function isOrdersCacheFresh(entry: OrdersCacheEntry | undefined) {
  return Boolean(entry?.data && entry.expiresAt > now());
}

function shouldPreloadOrdersForRoute(href: string) {
  return (
    href === "/dashboard/customer" ||
    href === "/dashboard/customer/orders" ||
    href === "/dashboard/customer/results" ||
    href.startsWith("/dashboard/customer/results/") ||
    href === "/dashboard/customer/transactions"
  );
}

export function preloadCustomerRoute(router: PrefetchRouter, href: string) {
  if (!href || prefetchedRoutes.has(href)) {
    return;
  }

  prefetchedRoutes.add(href);

  try {
    router.prefetch(href);
  } catch {
    prefetchedRoutes.delete(href);
  }
}

export function preloadCustomerOrders(userId: string) {
  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    return Promise.resolve([]);
  }

  const cached = ordersCache.get(normalizedUserId);

  if (isOrdersCacheFresh(cached)) {
    return Promise.resolve(cached!.data!);
  }

  if (cached?.promise) {
    return cached.promise;
  }

  const promise = getOrdersByUserId(normalizedUserId)
    .then((orders) => {
      ordersCache.set(normalizedUserId, {
        data: orders,
        expiresAt: now() + ORDERS_CACHE_TTL_MS,
      });
      return orders;
    })
    .catch((error) => {
      ordersCache.delete(normalizedUserId);
      throw error;
    });

  ordersCache.set(normalizedUserId, {
    data: cached?.data,
    expiresAt: cached?.expiresAt ?? 0,
    promise,
  });

  return promise;
}

export function getCustomerOrdersPreloaded(userId: string) {
  return preloadCustomerOrders(userId);
}

export function invalidateCustomerOrders(userId: string) {
  const normalizedUserId = userId.trim();

  if (normalizedUserId) {
    ordersCache.delete(normalizedUserId);
  }
}

export function preloadCustomerRouteData(userId: string | undefined, href: string) {
  if (userId && shouldPreloadOrdersForRoute(href)) {
    void preloadCustomerOrders(userId);
  }
}

export function useCustomerDashboardPreloader({
  userId,
  routes,
}: {
  userId?: string;
  routes: string[];
}) {
  const router = useRouter();

  useEffect(() => {
    routes.forEach((href) => {
      preloadCustomerRoute(router, href);
      preloadCustomerRouteData(userId, href);
    });
  }, [router, routes, userId]);
}

export function __resetCustomerDashboardPreloadCacheForTests() {
  ordersCache.clear();
  prefetchedRoutes.clear();
}
