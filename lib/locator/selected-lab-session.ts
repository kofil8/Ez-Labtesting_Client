import { LabCenter, SelectedLabCenter } from "@/types/lab-center";

const SELECTED_LAB_STORAGE_KEY = "ezlab-selected-lab";

function getSessionStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function toSelectedLabCenter(
  lab: LabCenter | SelectedLabCenter,
  source: SelectedLabCenter["source"] = "locator",
): SelectedLabCenter {
  return {
    id: lab.id,
    name: lab.name,
    address: lab.address,
    latitude: lab.latitude,
    longitude: lab.longitude,
    phone: lab.phone,
    hours: lab.hours,
    status: lab.status,
    type: lab.type,
    source,
    selectedAt: new Date().toISOString(),
  };
}

export function readSelectedLabCenter(): SelectedLabCenter | null {
  const storage = getSessionStorage();
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(SELECTED_LAB_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as SelectedLabCenter;
    if (
      !parsed?.id ||
      !parsed?.name ||
      !parsed?.address ||
      typeof parsed.latitude !== "number" ||
      typeof parsed.longitude !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function writeSelectedLabCenter(lab: SelectedLabCenter): void {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  storage.setItem(SELECTED_LAB_STORAGE_KEY, JSON.stringify(lab));
}

export function clearSelectedLabCenter(): void {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(SELECTED_LAB_STORAGE_KEY);
}
