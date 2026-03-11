export async function registerFirebaseSW() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  // Avoid stale SW/cache behavior during local development.
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  try {
    const reg = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      {
        scope: "/firebase-cloud-messaging-push-scope",
      }
    );

    console.log("SW registered:", reg);
    return reg;
  } catch (err) {
    console.error("SW registration FAILED:", err);
  }
}
