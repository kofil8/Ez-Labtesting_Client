type EzLabEventName =
  | "hero_zip_cta_click"
  | "trust_badge_impression"
  | "testimonial_click"
  | "review_submit_success"
  | "review_submit_failure";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEzLabEvent(
  eventName: EzLabEventName,
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
    new CustomEvent("ezlab:event", {
      detail: {
        eventName,
        payload,
      },
    }),
  );

  if (process.env.NODE_ENV === "development") {
    console.debug("[ezlab]", eventName, payload);
  }
}
