"use client";

import { useState } from "react";
import { toast } from "sonner";

export function NotificationTestButton() {
  const [loading, setLoading] = useState(false);

  const sendTest = async () => {
    setLoading(true);

    const token = localStorage.getItem("accessToken");
    console.log("Access Token:", token);

    try {
      const res = await fetch(
        "http://localhost:7001/api/v1/notifications/test-user",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            title: "Test Notification",
            body: "Test from header",
          }),
        }
      );

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        toast.error("Failed");
        return;
      }

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
