"use client";

import { sendTestNotification } from "@/lib/services/notifications.api";
import { useState } from "react";
import { toast } from "sonner";

export function NotificationTestButton() {
  const [loading, setLoading] = useState(false);

  const sendTest = async () => {
    setLoading(true);

    try {
      const data = await sendTestNotification({
        title: "Test Notification",
        body: "Test from header",
      });

      console.log("Response data:", data);

      toast.success("Test notification sent!");
    } catch (err) {
      console.error("NETWORK ERROR:", err);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={sendTest} className='p-2 rounded bg-blue-600 text-white'>
      {loading ? "..." : "Test Push"}
    </button>
  );
}
