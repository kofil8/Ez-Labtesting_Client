type LocatorEventName =
  | "locator_view"
  | "locator_location_submit"
  | "locator_geolocate_result"
  | "locator_results_loaded"
  | "locator_filter_change"
  | "locator_result_click"
  | "locator_map_pin_click"
  | "locator_cta_select_lab"
  | "locator_cta_directions"
  | "booking_started"
  | "booking_completed";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackLocatorEvent(
  eventName: LocatorEventName,
  payload: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...payload,
  });

  window.dispatchEvent(
    new CustomEvent("ezlab:locator-event", {
      detail: {
        eventName,
        payload,
      },
    }),
  );

  if (process.env.NODE_ENV === "development") {
    console.debug("[locator]", eventName, payload);
  }
}
