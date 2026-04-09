import {
  clearSelectedLabCenter,
  readSelectedLabCenter,
  toSelectedLabCenter,
  writeSelectedLabCenter,
} from "@/lib/locator/selected-lab-session";
import { LabCenter } from "@/types/lab-center";
import { describe, expect, it, vi } from "vitest";

function createSessionStorageMock() {
  const store = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
  };
}

const lab: LabCenter = {
  id: "lab-123",
  name: "Downtown Lab",
  address: "123 Main St",
  phone: "555-111-2222",
  type: "Labcorp",
  hours: "Mon-Fri 8am-5pm",
  status: "Open",
  latitude: 40,
  longitude: -73,
  rating: 4.6,
  reviewCount: 18,
  isActive: true,
  lastVerified: "2026-01-01T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("selected-lab-session", () => {
  it("serializes a lab to selected-lab shape", () => {
    const selected = toSelectedLabCenter(lab);

    expect(selected).toMatchObject({
      id: "lab-123",
      name: "Downtown Lab",
      latitude: 40,
      longitude: -73,
      source: "locator",
    });
    expect(selected.selectedAt).toBeTruthy();
  });

  it("writes and reads the selected lab from session storage", () => {
    const sessionStorageMock = createSessionStorageMock();
    vi.stubGlobal("window", {
      sessionStorage: sessionStorageMock,
    });

    const selected = toSelectedLabCenter(lab);
    writeSelectedLabCenter(selected);

    expect(readSelectedLabCenter()).toMatchObject({
      id: "lab-123",
      name: "Downtown Lab",
    });
    vi.unstubAllGlobals();
  });

  it("clears the selected lab from session storage", () => {
    const sessionStorageMock = createSessionStorageMock();
    vi.stubGlobal("window", {
      sessionStorage: sessionStorageMock,
    });

    writeSelectedLabCenter(toSelectedLabCenter(lab));
    clearSelectedLabCenter();

    expect(readSelectedLabCenter()).toBeNull();
    vi.unstubAllGlobals();
  });
});
