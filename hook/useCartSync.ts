import { useAuth } from "@/lib/auth-context";
import {
  getCartDeviceId,
  useCartStore,
  type CartItem,
} from "@/lib/store/cart-store";
import { connectNotificationSocket } from "@/lib/services/notifications.socket";
import { clientFetch } from "@/lib/api-client";
import { useCallback, useEffect, useRef, useState } from "react";

const CART_FOCUS_SYNC_COOLDOWN_MS = 30 * 1000;
const CART_CROSS_TAB_SYNC_DELAY_MS = 1500;

interface UseCartSyncOptions {
  /**
   * Auto-sync on mount (default: true)
   * Set to false if you want manual control
   */
  autoSync?: boolean;
  /**
   * Debounce delay in ms for syncing after local changes (default: 1000)
   */
  syncDelay?: number;
  /**
   * Whether to sync on every item change (default: false for better performance)
   * If false, syncing only happens on app initialization and manual calls
   */
  syncOnChange?: boolean;
}

function getCartSyncKey() {
  const { items, pendingRemovalLabTestIds } = useCartStore.getState();
  const activeLabTestIds = items
    .filter((item) => item.itemType === "TEST" && item.labTestId)
    .map((item) => item.labTestId as string)
    .sort();
  const removalLabTestIds = [...pendingRemovalLabTestIds].sort();

  return JSON.stringify({
    activeLabTestIds,
    removalLabTestIds,
  });
}

/**
 * Hook for managing cart synchronization between client and server
 * Handles:
 * - Initial cart load from server
 * - Auto-syncing when cart changes
 * - Conflict resolution with server timestamps
 * - Graceful degradation when offline
 */
export function useCartSync(options: UseCartSyncOptions = {}) {
  const { autoSync = true, syncDelay = 1000, syncOnChange = false } = options;

  const { user } = useAuth();
  const {
    items,
    pendingRemovalLabTestIds,
    isSyncing,
    isInitialized,
    initializeFromServer,
    syncWithServer,
  } = useCartStore();

  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const hasSyncedRef = useRef(false);
  const lastSyncedKeyRef = useRef<string | null>(null);

  /**
   * Initialize cart from server on mount if user is authenticated
   */
  useEffect(() => {
    if (!autoSync || !user?.id || hasSyncedRef.current) return;

    hasSyncedRef.current = true;
    initializeFromServer().finally(() => {
      lastSyncedKeyRef.current = getCartSyncKey();
    });
  }, [autoSync, user?.id, initializeFromServer]);

  /**
   * Debounced sync when cart items change (optional)
   */
  useEffect(() => {
    if (!syncOnChange || !user?.id || isSyncing || !isInitialized) return;

    const syncKey = getCartSyncKey();
    if (syncKey === lastSyncedKeyRef.current) return;

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Set new timeout for debounced sync
    syncTimeoutRef.current = setTimeout(async () => {
      await syncWithServer();
      lastSyncedKeyRef.current = getCartSyncKey();
    }, syncDelay);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [
    items,
    pendingRemovalLabTestIds,
    user?.id,
    syncOnChange,
    isSyncing,
    isInitialized,
    syncWithServer,
    syncDelay,
  ]);

  /**
   * Manual sync trigger
   */
  const manualSync = useCallback(async () => {
    if (!user?.id) return;
    await syncWithServer();
    lastSyncedKeyRef.current = getCartSyncKey();
  }, [user?.id, syncWithServer]);

  /**
   * Add item to cart and sync with server
   */
  const addItemWithSync = useCallback(
    async (item: CartItem) => {
      useCartStore.setState((state) => {
        const exists = state.items.some((i) => i.id === item.id);
        if (exists) {
          return state;
        }
        return { items: [...state.items, item] };
      });

      if (user?.id) {
        await manualSync();
      }
    },
    [user?.id, manualSync],
  );

  /**
   * Remove item from cart and sync with server
   */
  const removeItemWithSync = useCallback(
    async (itemId: string) => {
      useCartStore.setState((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
      }));

      if (user?.id) {
        await manualSync();
      }
    },
    [user?.id, manualSync],
  );

  return {
    isSyncing,
    isInitialized,
    manualSync,
    addItemWithSync,
    removeItemWithSync,
  };
}

/**
 * Hook to check if cart is in sync with server
 */
export function useCartSyncStatus() {
  const { lastSyncAt, isSyncing } = useCartStore();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const isOutOfSync = lastSyncAt
    ? now - new Date(lastSyncAt).getTime() > 5 * 60 * 1000 // 5 minutes
    : !lastSyncAt;

  return {
    isSyncing,
    isOutOfSync,
    lastSyncAt,
  };
}

/**
 * Hook to sync cart when window regains focus
 * Useful for detecting when user switches tabs/devices
 */
export function useCartSyncOnFocus() {
  const { syncWithServer, isInitialized } = useCartStore();
  const { user } = useAuth();
  const lastFocusSyncRef = useRef(0);

  useEffect(() => {
    if (!user?.id || !isInitialized) return;

    const handleFocus = () => {
      const now = Date.now();
      if (now - lastFocusSyncRef.current < CART_FOCUS_SYNC_COOLDOWN_MS) return;
      lastFocusSyncRef.current = now;
      syncWithServer();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [user?.id, isInitialized, syncWithServer]);
}

/**
 * Hook to detect changes from other tabs using BroadcastChannel API
 */
export function useCartSyncCrossTab() {
  const { syncWithServer, isInitialized } = useCartStore();
  const { user } = useAuth();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!user?.id || !isInitialized || !("BroadcastChannel" in globalThis)) {
      return;
    }

    try {
      const channel = new BroadcastChannel("cart-sync");

      channel.onmessage = (event) => {
        if (event.data.type === "CART_UPDATED") {
          if (event.data.deviceId === getCartDeviceId()) return;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            syncWithServer();
          }, CART_CROSS_TAB_SYNC_DELAY_MS);
        }
      };

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        channel.close();
      };
    } catch (error) {
      console.warn("BroadcastChannel not available:", error);
    }
  }, [user?.id, isInitialized, syncWithServer]);
}

/**
 * Hook to receive real-time cart updates from other devices.
 */
export function useCartRealtimeSync() {
  const { user } = useAuth();
  const { applyServerCart, setLockState, clearCart } = useCartStore();

  useEffect(() => {
    if (!user?.id) return;

    let isActive = true;
    let cleanup: (() => void) | undefined;

    connectNotificationSocket()
      .then((socket) => {
        if (!isActive) return;

        const handleCartUpdated = (payload: any) => {
          if (payload?.sourceDeviceId === getCartDeviceId()) return;
          if (payload?.cart) {
            applyServerCart(payload.cart);
          }
        };

        const handleCartLocked = (payload: any) => {
          setLockState(Boolean(payload?.locked), payload?.expiresAt || null);
        };

        const handleCartUnlocked = () => {
          setLockState(false, null);
        };

        const handleDeviceLogout = async (payload: any) => {
          if (payload?.deviceId !== getCartDeviceId()) return;
          if (payload?.clearCart) {
            clearCart();
          }

          await clientFetch("/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
            redirectOnAuthFailure: false,
          }).catch(() => undefined);

          window.location.assign("/login");
        };

        socket.on("cart:updated", handleCartUpdated);
        socket.on("cart:locked", handleCartLocked);
        socket.on("cart:unlocked", handleCartUnlocked);
        socket.on("auth:device-logout", handleDeviceLogout);

        cleanup = () => {
          socket.off("cart:updated", handleCartUpdated);
          socket.off("cart:locked", handleCartLocked);
          socket.off("cart:unlocked", handleCartUnlocked);
          socket.off("auth:device-logout", handleDeviceLogout);
        };
      })
      .catch((error) => {
        console.warn("Cart realtime sync unavailable:", error);
      });

    return () => {
      isActive = false;
      cleanup?.();
    };
  }, [user?.id, applyServerCart, setLockState, clearCart]);
}
