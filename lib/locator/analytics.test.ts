import { trackLocatorEvent } from "@/lib/locator/analytics";
import { describe, expect, it, vi } from "vitest";

describe("locator analytics", () => {
  it("pushes locator events into the browser data layer", () => {
    const dispatchEvent = vi.fn();
    vi.stubGlobal("window", {
      dataLayer: [],
      dispatchEvent,
    });

    trackLocatorEvent("locator_cta_select_lab", {
      lab_id: "lab-123",
    });

    const { dataLayer } = window as typeof window & {
      dataLayer: Array<Record<string, unknown>>;
    };
    expect(dataLayer).toEqual([
      {
        event: "locator_cta_select_lab",
        lab_id: "lab-123",
      },
    ]);
    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });
});
