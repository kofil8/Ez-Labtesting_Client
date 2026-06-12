"use client";

import {
  useCartSync,
  useCartSyncCrossTab,
  useCartSyncOnFocus,
  useCartRealtimeSync,
} from "@/hook/useCartSync";

/**
 * CartInitializer Component
 * Initializes server-side cart synchronization on app load
 * Should be placed inside AuthProvider but outside any route components
 */
export function CartInitializer() {
  // Initialize cart from server on mount
  useCartSync({ autoSync: true, syncOnChange: true });

  // Re-sync when window regains focus (user switches tabs/returns to browser)
  useCartSyncOnFocus();

  // Sync across browser tabs using BroadcastChannel API
  useCartSyncCrossTab();

  // Real-time multi-device sync over the existing authenticated socket
  useCartRealtimeSync();

  return null;
}
