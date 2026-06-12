import { describe, expect, it, vi } from "vitest";
import {
  clearRegisteredPushTokenMarker,
  getPushRegistrationAttemptKey,
  getStoredPushRegistration,
  setStoredPushRegistration,
} from "./push";

function createStorage() {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
    get length() {
      return Object.keys(store).length;
    },
  };
}

describe("push registration storage", () => {
  it("stores push tokens with the owning user id", () => {
    vi.stubGlobal("localStorage", createStorage());
    vi.stubGlobal("window", {});

    setStoredPushRegistration({ token: "token-1", userId: "user-1" });

    expect(getStoredPushRegistration()).toEqual({
      token: "token-1",
      userId: "user-1",
    });

    clearRegisteredPushTokenMarker();
    expect(getStoredPushRegistration()).toBeNull();
    vi.unstubAllGlobals();
  });

  it("keeps registration attempt keys scoped by user", () => {
    expect(getPushRegistrationAttemptKey("user-1")).toBe(
      "push_register_attempted:user-1",
    );
  });
});
