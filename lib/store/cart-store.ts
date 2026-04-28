import { clientFetch } from "@/lib/api-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string; // unique identifier for the cart item, e.g., `test-${testId}` or `panel-${panelId}`
  itemType: "TEST" | "PANEL";
  name: string;
  price: number;
  slug?: string;
  isPanel?: boolean;
  labTestId?: string;
} & (
  | { itemType: "TEST"; testId: string }
  | { itemType: "PANEL"; panelId: string; testIds: string[] }
);

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discount: number;
  lastSyncAt: Date | null;
  isSyncing: boolean;
  isInitialized: boolean;
  pendingRemovalLabTestIds: string[];
  isLocked: boolean;
  lockExpiresAt: Date | null;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  setPromoCode: (code: string, discount: number) => void;
  clearPromoCode: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getItemCount: () => number;
  syncWithServer: () => Promise<void>;
  initializeFromServer: () => Promise<void>;
  setItems: (items: CartItem[]) => void;
  setIsSyncing: (syncing: boolean) => void;
  applyServerCart: (cart: any) => void;
  setLockState: (locked: boolean, expiresAt?: string | Date | null) => void;
}

const CART_DEVICE_ID_KEY = "cart-device-id";

export function getCartDeviceId() {
  if (typeof window === "undefined") return "server";

  const existing = window.localStorage.getItem(CART_DEVICE_ID_KEY);
  if (existing) return existing;

  const next =
    globalThis.crypto?.randomUUID?.() ||
    `device-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(CART_DEVICE_ID_KEY, next);
  return next;
}

function broadcastCartUpdated() {
  if (typeof BroadcastChannel === "undefined") return;

  try {
    const channel = new BroadcastChannel("cart-sync");
    channel.postMessage({ type: "CART_UPDATED", deviceId: getCartDeviceId() });
    channel.close();
  } catch {
    // BroadcastChannel is an enhancement only.
  }
}

function serverItemsToClientItems(items: any[]): CartItem[] {
  return items.map((item: any) => ({
    id: `test-${item.testId}`,
    itemType: "TEST" as const,
    name: item.testName,
    price: item.effectiveUnitPrice,
    testId: item.testId,
    labTestId: item.labTestId,
    slug: item.slug || undefined,
    isPanel: false,
  }));
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discount: 0,
      lastSyncAt: null,
      isSyncing: false,
      isInitialized: false,
      pendingRemovalLabTestIds: [],
      isLocked: false,
      lockExpiresAt: null,

      addItem: (item: CartItem) => {
        set((state) => {
          // Check if item already exists
          const exists = state.items.some((i) => i.id === item.id);
          if (exists) {
            return state; // Don't add duplicates
          }
          const nextPendingRemovals = item.labTestId
            ? state.pendingRemovalLabTestIds.filter((id) => id !== item.labTestId)
            : state.pendingRemovalLabTestIds;
          return {
            items: [...state.items, item],
            pendingRemovalLabTestIds: nextPendingRemovals,
          };
        });
        broadcastCartUpdated();
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
          pendingRemovalLabTestIds: [
            ...new Set([
              ...state.pendingRemovalLabTestIds,
              state.items.find((item) => item.id === itemId)?.labTestId,
            ].filter((id): id is string => Boolean(id))),
          ],
        }));
        broadcastCartUpdated();
      },

      clearCart: () => {
        set((state) => ({
          items: [],
          promoCode: null,
          discount: 0,
          pendingRemovalLabTestIds: [
            ...new Set([
              ...state.pendingRemovalLabTestIds,
              ...state.items.map((item) => item.labTestId).filter(Boolean),
            ] as string[]),
          ],
        }));
        broadcastCartUpdated();
      },

      setPromoCode: (code: string, discount: number) => {
        set({ promoCode: code, discount });
      },

      clearPromoCode: () => {
        set({ promoCode: null, discount: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        return subtotal * get().discount;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discountAmount = subtotal * get().discount;
        return subtotal - discountAmount;
      },

      getItemCount: () => {
        return get().items.length;
      },

      setItems: (items: CartItem[]) => {
        set({ items, lastSyncAt: new Date(), pendingRemovalLabTestIds: [] });
        broadcastCartUpdated();
      },

      setIsSyncing: (syncing: boolean) => {
        set({ isSyncing: syncing });
      },

      applyServerCart: (cart: any) => {
        set({
          items: serverItemsToClientItems(cart.items || []),
          promoCode: cart.promoCode || null,
          discount: cart.discount || 0,
          lastSyncAt: cart.lastSyncAt ? new Date(cart.lastSyncAt) : new Date(),
          isInitialized: true,
          pendingRemovalLabTestIds: [],
        });
      },

      setLockState: (locked: boolean, expiresAt?: string | Date | null) => {
        set({
          isLocked: locked,
          lockExpiresAt: expiresAt ? new Date(expiresAt) : null,
        });
      },

      /**
       * Fetch cart from server - used on app initialization
       */
      initializeFromServer: async () => {
        if (get().isInitialized) return;

        set({ isSyncing: true });
        try {
          const response = await clientFetch("/cart", {
            redirectOnAuthFailure: false,
          });

          if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.items) {
              get().applyServerCart(data.data);
            }
          } else if (response.status === 401) {
            // User not authenticated
            set({ isInitialized: true });
          }
        } catch (error) {
          console.error("Failed to initialize cart from server:", error);
          set({ isInitialized: true });
        } finally {
          set({ isSyncing: false });
        }
      },

      /**
       * Sync local cart with server
       * Handles multi-device synchronization with conflict resolution
       */
      syncWithServer: async () => {
        const state = get();
        if (state.isSyncing) return; // Prevent duplicate syncs

        set({ isSyncing: true });
        try {
          const syncItems = [
            ...state.items
              .filter((item) => item.itemType === "TEST" && item.labTestId)
              .map((item) => ({
                labTestId: item.labTestId,
                quantity: 1,
                drawCenterId: null,
              })),
            ...state.pendingRemovalLabTestIds.map((labTestId) => ({
              labTestId,
              quantity: 0,
              drawCenterId: null,
            })),
          ];

          const response = await clientFetch("/cart/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Cart-Device-Id": getCartDeviceId(),
            },
            body: JSON.stringify({
              items: syncItems,
              clientTimestamp: new Date(),
              deviceId: getCartDeviceId(),
            }),
            redirectOnAuthFailure: false,
          });

          if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.items) {
              get().applyServerCart(data.data);
            }
          } else if (response.status === 409) {
            const data = await response.json().catch(() => null);
            console.warn(data?.message || "Cart is locked during checkout");
          } else if (response.status === 401) {
            // User session expired
            console.warn("User session expired, unable to sync cart");
          }
        } catch (error) {
          console.error("Failed to sync cart with server:", error);
          // Silently fail - use local cache
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);
