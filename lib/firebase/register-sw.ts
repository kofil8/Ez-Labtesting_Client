export async function registerFirebaseSW() {
  if (typeof window === "undefined") return;

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
